async function runScript(scriptName: string, shouldCloseDb: boolean = false) {
  console.log(`\n🚀 Running ${scriptName}...`);
  try {
    const { seed } = await import(`./${scriptName}`);
    await seed(shouldCloseDb);
    console.log(`✅ ${scriptName} completed successfully`);
  } catch (error) {
    console.error(`❌ ${scriptName} failed:`, error);
    process.exit(1);
  }
}

async function seedAll() {
  console.log('🌱 Starting complete database seeding...\n');

  // Order matters: dependencies first
  await runScript('seedCategories');
  await runScript('seedTags');
  await runScript('seedCompanies');
  await runScript('seedPosts', true);

  console.log('\n🎉 All seeding completed successfully!');
}

seedAll().catch((err) => {
  console.error('💥 Complete seeding failed:', err);
  process.exit(1);
});
