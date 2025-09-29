import { AppDataSource } from "../data-source";
import { Category, CategoryType, CategoryField } from "../entities/category";
import { categoriesData, CategorySeedData } from "./categoriesData";

async function seedCategories() {
  await AppDataSource.initialize();
  const categoryRepo = AppDataSource.getRepository(Category);

  for (const catData of categoriesData) {
    const name: CategoryType = catData.name;

    const existing: Category | null = await categoryRepo.findOne({ where: { name } });

    if (!existing) {
      const category = categoryRepo.create({
        name,
        fields: catData.fields,
        description: catData.description,
      });

      await categoryRepo.save(category);
      console.log(`✅ Seeded category: ${name}`);
    } else {
      existing.fields = catData.fields;
      existing.description = catData.description || existing.description;
      await categoryRepo.save(existing);
      console.log(`♻️ Updated category: ${name}`);
    }
  }

  await AppDataSource.destroy();
  console.log("🌱 Seeding completed");
}

seedCategories().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
