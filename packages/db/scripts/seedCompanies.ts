/* eslint-disable @typescript-eslint/no-explicit-any */
import { inArray } from 'drizzle-orm';
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
    content: entity.singleData?.content ?? null,
    videoId: entity.singleData?.videoId ?? null,
    screenshots: entity.singleData?.screenshots ?? [],
    alternatives: entity.singleData?.alternatives ?? [],
    topics: entity.topics ?? [],
  };
}

async function handleCompanyCategories(companyId: number, categories: any) {
  const categoryData = categories as { id: number; name: string; slug: string }[];

  // Get category IDs from DB using slugs
  const categorySlugs = categoryData.map((cat) => cat.slug);
  const dbCategories = await db
    .select({ id: categoriesTable.id, slug: categoriesTable.slug })
    .from(categoriesTable)
    .where(inArray(categoriesTable.slug, categorySlugs));

  // Create slug-to-id mapping for quick lookup
  const slugToIdMap = new Map(dbCategories.map((cat) => [cat.slug, cat.id]));

  // Build relationships array
  const relationships = categoryData
    .map((cat) => {
      const categoryId = slugToIdMap.get(cat.slug);
      if (!categoryId) {
        console.warn(`⚠️ Category not found for slug: ${cat.slug}`);
        return null;
      }
      return {
        companyId: companyId,
        categoryId: categoryId,
      };
    })
    .filter((rel) => rel !== null); // Remove null entries

  // Insert relationships if any exist
  if (relationships.length > 0) {
    await db.insert(companyCategories).values(relationships);
    console.log(`✅ Created ${relationships.length} category relationships for company ID ${companyId}`);
  }
}

async function seed() {
  const entities = getData('entities.json');

  console.log(`🌱 Seed companies from ${entities.length} entities...`);

  const types: string[] = [];
  const companyEntities = entities.filter((e: any) => {
    if (!types.includes(e.module)) {
      types.push(e.module);
    }

    return e.module === 'company';
  });

  console.log('found types: ', types);
  console.log(`ℹ️ Found ${companyEntities.length} company entities`);

  let inserted = 0;
  const conflicts: string[] = [];

  for (const entity of companyEntities) {
    const company = transformEntityToCompany(entity);

    try {
      const [insertedCompany] = await db.insert(companies).values(company).returning({ id: companies.id });
      const companyId = insertedCompany.id;

      if (entity.categories) {
        await handleCompanyCategories(companyId, entity.categories);
      }

      inserted++;
    } catch (err: any) {
      if (err.code === '23505') {
        // Postgres unique violation
        conflicts.push(company.slug);
        console.warn(`⚠️ Conflict on slug: ${company.slug}`);
      } else {
        console.error(`❌ Unexpected error for slug ${company.slug}`, err);
      }
    }
  }

  console.log(`✅ Inserted ${inserted} companies`);
  if (conflicts.length > 0) {
    console.log(`⚠️ Conflicts (${conflicts.length}):`, conflicts);
  }

  await closeDb();
}

seed().catch((err) => {
  console.error('💥 Seeding failed:', err);
  process.exit(1);
});
