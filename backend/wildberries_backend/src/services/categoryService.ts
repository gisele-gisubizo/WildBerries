import { AppDataSource } from "../data-source";
import { AppError } from "../utilis/errors";
import { Category } from "../entities/category";

const categoryRepo = AppDataSource.getRepository(Category);

// =============================
// Create Category
// =============================
export const createCategory = async (data: {
  name: Category["name"];
  fields: Category["fields"];
  description?: string;
}) => {
  const existingCategory = await categoryRepo.findOneBy({ name: data.name });
  if (existingCategory) throw new AppError("Category already exists", 400);

  const category = categoryRepo.create(data);
  await categoryRepo.save(category);
  return category;
};

// =============================
// Get All Categories
// =============================
export const getAllCategories = async () => {
  return categoryRepo.find();
};

// =============================
// Get Category by ID
// =============================
export const getCategoryById = async (id: number) => {
  const category = await categoryRepo.findOneBy({ id });
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

// =============================
// Update Category
// =============================
export const updateCategory = async (id: number, data: Partial<Category>) => {
  const category = await categoryRepo.findOneBy({ id });
  if (!category) throw new AppError("Category not found", 404);

  Object.assign(category, data);
  await categoryRepo.save(category);
  return category;
};

// =============================
// Delete Category
// =============================
export const deleteCategory = async (id: number) => {
  const category = await categoryRepo.findOneBy({ id });
  if (!category) throw new AppError("Category not found", 404);

  await categoryRepo.remove(category);
  return category;
};
