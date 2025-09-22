/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeDb, getData, getDb } from './utils';
import { categories as categoriesTable } from '../src/schema/categories';

function transformCategory(category: any) {
  return {
    entityType: category.module,
    slug: category.slug,
    name: category.name,
    faqs: category.data?.faqs ?? null,
    buyingGuide: category.data?.buyers_guide ?? null,
  };
}

async function seed() {
  const db = getDb();
  const categories = getData('categories.json');
  console.log(`🌱 Starting to seed ${categories.length} categories...`);

  for (const category of categories) {
    const transformedCategory = transformCategory(category);

    try {
      await db.insert(categoriesTable).values(transformedCategory);
    } catch (err: any) {
      if (err.code === '23505') {
        console.warn(`⚠️ Conflict on slug: ${transformedCategory.slug}`);
      } else {
        console.error(`❌ Unexpected error for slug ${transformedCategory.slug}`, err);
      }
    }
  }

  console.log('🎉 Seeding completed!');
  await closeDb();
}

seed().catch((err) => {
  console.error('💥 Seeding failed:', err);
  process.exit(1);
});
