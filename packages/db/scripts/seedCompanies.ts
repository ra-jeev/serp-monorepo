/* eslint-disable @typescript-eslint/no-explicit-any */
import { inArray } from 'drizzle-orm';
import { closeDb, getData, getDb } from './utils';
import { companies as companiesTable } from '../src/schema/companies';
import { categories as categoriesTable } from '../src/schema/categories';
import { tags as tagsTable } from '../src/schema/tags';
import {
  companyCategories as companyCategoriesTable,
  companyAlternatives as companyAlternativesTable,
  companyTags as companyTagsTable,
} from '../src/schema/junction-tables';

type CompanyInsertData = {
  slug: string;
  name: string;
  logo: string | null;
  domain: string | null;
  excerpt: string | null;
  oneLiner: string | null;
  serplyLink: string | null;
  content: string | null;
  videoId: string | null;
  screenshots: string[];
};

function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

export async function seed(shouldCloseDb: boolean = true) {
  const db = getDb();
  const entities = getData('entities.json');
  console.log(`🌱 Seeding companies from ${entities.length} entities...`);

  const companies = entities.filter((e: any) => e.module === 'company');
  console.log(`ℹ️ Found ${companies.length} company entities`);

  // Step 1: Prepare all company data for bulk insert
  console.log('📦 Preparing company data for bulk insert...');
  const companiesData: CompanyInsertData[] = companies.map((entity: any) => ({
    slug: entity.slug,
    name: entity.name,
    logo: entity.data?.logo ?? null,
    domain: entity.data?.domain ?? null,
    excerpt: entity.data?.excerpt ?? null,
    oneLiner: entity.data?.oneLiner ?? null,
    serplyLink: entity.data?.serplyLink ?? null,
    content: entity.single_data?.content ?? null,
    videoId: entity.single_data?.videoId ?? null,
    screenshots: entity.single_data?.screenshots ?? [],
  }));

  // Step 2: Bulk insert companies
  console.log('🚀 Bulk inserting companies in batches...');
  const BATCH_SIZE = 500;
  const companyBatches = batchArray(companiesData, BATCH_SIZE);

  let totalInserted = 0;
  for (let i = 0; i < companyBatches.length; i++) {
    const batchData = companyBatches[i];
    try {
      await db.insert(companiesTable).values(batchData).onConflictDoNothing();
      totalInserted += batchData.length;
      console.log(
        `✅ Inserted batch ${i + 1}/${companyBatches.length} (${batchData.length} companies)`,
      );
    } catch (err) {
      console.error(`❌ Failed to insert batch ${i + 1}:`, err);
      throw err;
    }
  }
  console.log(`✅ Total companies inserted: ${totalInserted}`);

  // Step 3: Get company slug -> ID mapping
  console.log('🔍 Building company slug to ID mapping...');
  const companySlugs = companies.map((e: any) => e.slug);
  const dbCompanies = await db
    .select({
      id: companiesTable.id,
      slug: companiesTable.slug,
      domain: companiesTable.domain,
    })
    .from(companiesTable)
    .where(inArray(companiesTable.slug, companySlugs));

  const slugToIdMap = new Map(dbCompanies.map((c) => [c.slug, c.id]));
  const domainToIdMap = new Map<string, number>();
  dbCompanies.forEach((company) => {
    if (company.domain && company.domain.trim().length > 0) {
      domainToIdMap.set(company.domain, company.id);
    }
  });

  console.log(`✅ Mapped ${slugToIdMap.size} companies by slug`);
  console.log(`✅ Mapped ${domainToIdMap.size} companies by domain`);

  // Step 4: Prepare junction table data
  console.log('📦 Preparing junction table data...');

  // Get all category and tag data we'll need
  const allCategorySlugs = new Set<string>();
  const allTagSlugs = new Set<string>();

  companies.forEach((entity: any) => {
    entity.categories?.forEach((cat: any) => allCategorySlugs.add(cat.slug));
    entity.topics?.forEach((topic: any) => allTagSlugs.add(topic.slug));
  });

  // Fetch categories and tags
  const dbCategories =
    allCategorySlugs.size > 0
      ? await db
          .select({ id: categoriesTable.id, slug: categoriesTable.slug })
          .from(categoriesTable)
          .where(inArray(categoriesTable.slug, Array.from(allCategorySlugs)))
      : [];

  const dbTags =
    allTagSlugs.size > 0
      ? await db
          .select({ id: tagsTable.id, slug: tagsTable.slug })
          .from(tagsTable)
          .where(inArray(tagsTable.slug, Array.from(allTagSlugs)))
      : [];

  const categorySlugToIdMap = new Map(dbCategories.map((c) => [c.slug, c.id]));
  const tagSlugToIdMap = new Map(dbTags.map((t) => [t.slug, t.id]));

  // Build junction table data
  const companyCategoriesData: { companyId: number; categoryId: number }[] = [];
  const companyTagsData: { companyId: number; tagId: number }[] = [];
  const companyAlternativesData: {
    companyId: number;
    alternativeId: number;
  }[] = [];

  companies.forEach((entity: any) => {
    const companyId = slugToIdMap.get(entity.slug);
    if (!companyId) {
      console.warn(`⚠️ Company not found for slug: ${entity.slug}`);
      return;
    }

    // Categories
    entity.categories?.forEach((cat: any) => {
      const categoryId = categorySlugToIdMap.get(cat.slug);
      if (categoryId) {
        companyCategoriesData.push({ companyId, categoryId });
      } else {
        console.warn(`⚠️ Category not found for slug: ${cat.slug}`);
      }
    });

    // Tags
    entity.topics?.forEach((topic: any) => {
      const tagId = tagSlugToIdMap.get(topic.slug);
      if (tagId) {
        companyTagsData.push({ companyId, tagId });
      } else {
        console.warn(`⚠️ Tag not found for slug: ${topic.slug}`);
      }
    });

    // Alternatives
    entity.single_data?.alternatives?.forEach((alt: any) => {
      if (!alt.domain || alt.domain.trim().length === 0) {
        console.warn(
          `⚠️ Alternative has no domain for company ${entity.slug}: ${alt.name}`,
        );
        return;
      }

      const alternativeId = domainToIdMap.get(alt.domain);
      if (alternativeId) {
        companyAlternativesData.push({ companyId, alternativeId });
      } else {
        console.warn(
          `⚠️ Alternative company not found for domain: ${alt.domain}`,
        );
      }
    });
  });

  // Step 5: Bulk insert junction table data
  console.log('🚀 Bulk inserting junction table data...');

  const JUNCTION_BATCH_SIZE = 1000;
  let batchIndex = 1;
  if (companyCategoriesData.length > 0) {
    const companyCategoriesBatches = batchArray(
      companyCategoriesData,
      JUNCTION_BATCH_SIZE,
    );

    for (const batch of companyCategoriesBatches) {
      await db
        .insert(companyCategoriesTable)
        .values(batch)
        .onConflictDoNothing();
      console.log(
        `✅ Inserted batch ${batchIndex++}/${companyCategoriesBatches.length} (${batch.length} company-category relationships)`,
      );
    }

    console.log(
      `✅ Bulk inserted ${companyCategoriesData.length} company-category relationships`,
    );
  }

  if (companyTagsData.length > 0) {
    await db
      .insert(companyTagsTable)
      .values(companyTagsData)
      .onConflictDoNothing();
    console.log(
      `✅ Bulk inserted ${companyTagsData.length} company-tag relationships`,
    );
  }

  if (companyAlternativesData.length > 0) {
    const alternativesBatches = batchArray(
      companyAlternativesData,
      JUNCTION_BATCH_SIZE,
    );

    batchIndex = 1;
    for (const batch of alternativesBatches) {
      await db
        .insert(companyAlternativesTable)
        .values(batch)
        .onConflictDoNothing();
      console.log(
        `✅ Inserted batch ${batchIndex++}/${alternativesBatches.length} (${batch.length} company-alternative relationships)`,
      );
    }

    console.log(
      `✅ Bulk inserted ${companyAlternativesData.length} company-alternative relationships`,
    );
  }

  console.log('🎉 Company seeding completed!');
  if (shouldCloseDb) {
    await closeDb();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((err) => {
    console.error('💥 Company seeding failed:', err);
    process.exit(1);
  });
}
