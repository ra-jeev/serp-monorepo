/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeDb, getData, getDb } from './utils';
import { tags as tagsTable } from '../src/schema/tags';

export async function seed(shouldCloseDb: boolean = true) {
  const db = getDb();
  const tagsData = getData('tags.json');
  console.log(`🌱 Starting to seed ${tagsData.length} tags...`);

  const transformedTags = tagsData.map((tag: any) => ({
    slug: tag.slug,
    name: tag.name,
  }));

  try {
    await db.insert(tagsTable).values(transformedTags).onConflictDoNothing();
    console.log(`✅ Bulk inserted ${transformedTags.length} tags`);
  } catch (err) {
    console.error('❌ Bulk tag insert failed:', err);
    throw err;
  }

  console.log('🎉 Tag seeding completed!');
  if (shouldCloseDb) {
    await closeDb();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((err) => {
    console.error('💥 Tag seeding failed:', err);
    process.exit(1);
  });
}
