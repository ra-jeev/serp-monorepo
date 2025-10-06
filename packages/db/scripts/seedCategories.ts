/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeDb, getData, getDb } from './utils';
import { categories as categoriesTable } from '../src/schema/categories';

export async function seed(shouldCloseDb: boolean = true) {
  const db = getDb();
  const categories = getData('categories.json');
  console.log(`🌱 Starting to seed ${categories.length} categories...`);

  const transformedCategories = categories.map((category: any) => ({
    entityType: category.module,
    slug: category.slug,
    name: category.name,
    faqs: category.data?.faqs ?? null,
    buyingGuide: category.data?.buyers_guide ?? null,
  }));

  try {
    await db
      .insert(categoriesTable)
      .values(transformedCategories)
      .onConflictDoNothing();
    console.log(`✅ Bulk inserted ${transformedCategories.length} categories`);
  } catch (err) {
    console.error('❌ Bulk category insert failed:', err);
    throw err;
  }

  console.log('🎉 Category seeding completed!');
  if (shouldCloseDb) {
    await closeDb();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((err) => {
    console.error('💥 Category seeding failed:', err);
    process.exit(1);
  });
}
