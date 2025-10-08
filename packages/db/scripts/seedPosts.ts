/* eslint-disable @typescript-eslint/no-explicit-any */
import { inArray } from 'drizzle-orm';
import { closeDb, getData, getDb, sanitizeSlug } from './utils';
import { posts } from '../src/schema/posts';
import { categories as categoriesTable } from '../src/schema/categories';
import { tags as tagsTable } from '../src/schema/tags';
import { postCategories, postTags } from '../src/schema/junction-tables';

export async function seed(shouldCloseDb: boolean = true) {
  const db = getDb();
  const entities = getData('entities.json');
  console.log(`🌱 Seeding posts from ${entities.length} entities...`);

  const postEntities = entities.filter((e: any) => e.module === 'post');
  console.log(`ℹ️ Found ${postEntities.length} post entities`);

  // Step 1: Prepare all post data for bulk insert
  console.log('📦 Preparing post data for bulk insert...');
  const postsData = postEntities.map((entity: any) => ({
    slug: sanitizeSlug(entity.slug),
    name: entity.name,
    type: entity.data?.module?.toLowerCase() ?? 'glossary',
    image: entity.image,
    author: entity.data?.author,
    excerpt: entity.data?.excerpt,
    featuredImage: entity.data?.featuredImage,
    content: entity.single_data?.content,
    videoId: entity.single_data?.videoId,
  }));

  // Step 2: Bulk insert posts
  console.log('🚀 Bulk inserting posts...');
  await db.insert(posts).values(postsData).onConflictDoNothing();
  console.log(`✅ Bulk inserted ${postsData.length} posts`);

  // Step 3: Get post slug -> ID mapping
  console.log('🔍 Building post slug to ID mapping...');
  const postSlugs = postEntities.map((e: any) => e.slug);
  const dbPosts = await db
    .select({ id: posts.id, slug: posts.slug })
    .from(posts)
    .where(inArray(posts.slug, postSlugs));

  const slugToIdMap = new Map(dbPosts.map((p) => [p.slug, p.id]));
  console.log(`✅ Mapped ${slugToIdMap.size} posts`);

  // Step 4: Prepare junction table data
  console.log('📦 Preparing junction table data...');

  // Get all category and tag slugs we'll need
  const allCategorySlugs = new Set<string>();
  const allTagSlugs = new Set<string>();

  postEntities.forEach((entity: any) => {
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
  const postCategories_data: { postId: number; categoryId: number }[] = [];
  const postTags_data: { postId: number; tagId: number }[] = [];

  postEntities.forEach((entity: any) => {
    const postId = slugToIdMap.get(entity.slug);
    if (!postId) {
      console.warn(`⚠️ Post not found for slug: ${entity.slug}`);
      return;
    }

    // Categories
    entity.categories?.forEach((cat: any) => {
      const categoryId = categorySlugToIdMap.get(cat.slug);
      if (categoryId) {
        postCategories_data.push({ postId, categoryId });
      } else {
        console.warn(`⚠️ Category not found for slug: ${cat.slug}`);
      }
    });

    // Tags
    entity.topics?.forEach((topic: any) => {
      const tagId = tagSlugToIdMap.get(topic.slug);
      if (tagId) {
        postTags_data.push({ postId, tagId });
      } else {
        console.warn(`⚠️ Tag not found for slug: ${topic.slug}`);
      }
    });
  });

  // Step 5: Bulk insert junction table data
  console.log('🚀 Bulk inserting junction table data...');

  if (postCategories_data.length > 0) {
    await db
      .insert(postCategories)
      .values(postCategories_data)
      .onConflictDoNothing();
    console.log(
      `✅ Bulk inserted ${postCategories_data.length} post-category relationships`,
    );
  }

  if (postTags_data.length > 0) {
    await db.insert(postTags).values(postTags_data).onConflictDoNothing();
    console.log(
      `✅ Bulk inserted ${postTags_data.length} post-tag relationships`,
    );
  }

  console.log('🎉 Post seeding completed!');

  if (shouldCloseDb) {
    await closeDb();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((err) => {
    console.error('💥 Post seeding failed:', err);
    process.exit(1);
  });
}
