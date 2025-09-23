/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, inArray } from 'drizzle-orm';
import { closeDb, getData, getDb } from './utils';
import { companies } from '../src/schema/companies';
import { categories as categoriesTable } from '../src/schema/categories';
import { companyCategories } from '../src/schema/junction-tables';

const db = getDb();

function transformEntityToCompany(entity: any) {
  return {
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
    alternatives: [],
    topics: [],
  };
}

async function handleCompanyCategories(companyId: number, categories: any) {
  const categoryData = categories as {
    id: number;
    name: string;
    slug: string;
  }[];
  if (!categoryData || categoryData.length === 0) return;

  const categorySlugs = categoryData.map((cat) => cat.slug);
  const dbCategories = await db
    .select({ id: categoriesTable.id, slug: categoriesTable.slug })
    .from(categoriesTable)
    .where(inArray(categoriesTable.slug, categorySlugs));

  const slugToIdMap = new Map(dbCategories.map((cat) => [cat.slug, cat.id]));

  const relationships = categoryData
    .map((cat) => {
      const categoryId = slugToIdMap.get(cat.slug);
      if (!categoryId) {
        console.warn(`  ⚠️ Category not found for slug: ${cat.slug}`);
        return null;
      }
      return { companyId, categoryId };
    })
    .filter(
      (rel): rel is { companyId: number; categoryId: number } => rel !== null,
    );

  if (relationships.length > 0) {
    await db
      .insert(companyCategories)
      .values(relationships)
      .onConflictDoNothing();
  }
}

async function seed() {
  const entities = getData('entities.json');
  console.log(`🌱 Seeding companies from ${entities.length} entities...`);

  const companyEntities = entities.filter((e: any) => e.module === 'company');
  console.log(`ℹ️ Found ${companyEntities.length} company entities`);

  console.log('--- Pass 1: Inserting companies and building maps ---');

  const domainToNewIdMap = new Map<string, number>();
  const newIdToAlternativesMap = new Map<number, any[]>();
  const conflicts: string[] = [];
  let inserted = 0;

  for (const entity of companyEntities) {
    const company = transformEntityToCompany(entity);
    try {
      const [insertedCompany] = await db
        .insert(companies)
        .values(company)
        .returning({ id: companies.id });
      const newId = insertedCompany.id;

      // Map domain to new ID
      if (entity.data?.domain) {
        domainToNewIdMap.set(entity.data?.domain, newId);
      }

      // Store the original alternatives data to be processed in Pass 2
      if (entity.single_data?.alternatives?.length > 0) {
        newIdToAlternativesMap.set(newId, entity.single_data.alternatives);
      }

      if (entity.categories) {
        await handleCompanyCategories(newId, entity.categories);
      }

      inserted++;
    } catch (err: any) {
      if (err.code === '23505') {
        // Postgres unique violation
        conflicts.push(company.slug);
        console.warn(`  ⚠️ Conflict on slug: ${company.slug}`);
      } else {
        console.error(`  ❌ Unexpected error for slug ${company.slug}`, err);
      }
    }
  }

  console.log(`✅ Inserted ${inserted} companies in Pass 1.`);
  if (conflicts.length > 0) {
    console.log(`⚠️ Skipped ${conflicts.length} conflicting slugs.`);
  }

  console.log('--- Pass 2: Verifying and updating alternatives ---');
  let updatedCount = 0;

  for (const [newId, alternatives] of newIdToAlternativesMap.entries()) {
    const verifiedAlternativeIds: number[] = [];

    for (const alt of alternatives) {
      const domain = alt.domain;
      const newId = domainToNewIdMap.get(domain);

      if (newId) {
        verifiedAlternativeIds.push(newId);
      } else {
        console.warn(
          `  ⚠️ Could not find new ID for alternative with domain ${domain}.`,
        );
      }
    }

    if (verifiedAlternativeIds.length > 0) {
      await db
        .update(companies)
        .set({ alternatives: verifiedAlternativeIds })
        .where(eq(companies.id, newId));
      console.log(
        `  ✅ Updated company ID ${newId} with ${verifiedAlternativeIds.length} verified alternatives.`,
      );
      updatedCount++;
    }
  }

  console.log(
    `✅ Updated ${updatedCount} companies with alternatives in Pass 2.`,
  );
  await closeDb();
}

seed().catch((err) => {
  console.error('💥 Seeding failed:', err);
  process.exit(1);
});
