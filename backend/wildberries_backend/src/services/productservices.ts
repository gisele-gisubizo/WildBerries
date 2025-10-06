import { AppDataSource } from "../data-source";
import { Product } from "../entities/product";
import { Category } from "../entities/category";
import { User } from "../entities/user";
import { AppError } from "../utilis/errors";

const productRepo = AppDataSource.getRepository(Product);
const categoryRepo = AppDataSource.getRepository(Category);
const userRepo = AppDataSource.getRepository(User);

export class ProductService {
  static async createProduct(data: any, sellerId: number) {
    const { name, price, stock, attributes, categoryId, images } = data;

    const category = await categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new AppError("Category not found", 404);

    const seller = await userRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new AppError("Seller not found", 404);

    const product = productRepo.create({
      name,
      price,
      stock,
      attributes,
      category,
      seller,
      images,
    });

    return await productRepo.save(product);
  }

  static async getAllProducts() {
    return await productRepo.find();
  }

  static async getProductById(id: number) {
    const product = await productRepo.findOne({ where: { id } });
    if (!product) throw new AppError("Product not found", 404);
    return product;
  }

  static async updateProduct(id: number, sellerId: number, data: any) {
    const product = await productRepo.findOne({
      where: { id },
      relations: ["seller"],
    });
    if (!product) throw new AppError("Product not found", 404);

    if (product.seller.id !== sellerId) {
      throw new AppError("Unauthorized", 403);
    }

    Object.assign(product, data);
    return await productRepo.save(product);
  }

  static async deleteProduct(id: number, sellerId: number) {
    const product = await productRepo.findOne({
      where: { id },
      relations: ["seller"],
    });
    if (!product) throw new AppError("Product not found", 404);

    if (product.seller.id !== sellerId) {
      throw new AppError("Unauthorized", 403);
    }

    await productRepo.remove(product);
    return { message: "Product deleted successfully" };
  }
}



// ========================
// Get All Products (with filtering, sorting, pagination)
// ========================
export const getAllProducts = async (
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order: "ASC" | "DESC" = "DESC",
  filters: { categoryId?: number; sellerId?: number } = {}
) => {
  const skip = (page - 1) * limit;

  const query = productRepo
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.seller", "seller");

  if (filters.categoryId) {
    query.andWhere("category.id = :categoryId", { categoryId: filters.categoryId });
  }

  if (filters.sellerId) {
    query.andWhere("seller.id = :sellerId", { sellerId: filters.sellerId });
  }

  const [products, total] = await query
    .orderBy(`product.${sortBy}`, order)
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return { products, total, page, limit };
};

// ========================
// Get One Product
// ========================
export const getProductById = async (id: number) => {
  const product = await productRepo.findOne({
    where: { id },
    relations: ["category", "seller"],
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

// ========================
// Update Product
// ========================
export const updateProduct = async (
  productId: string,
  sellerId: number,
  updates: Partial<Product>
) => {
  const product = await productRepo.findOne({
    where: { id: parseInt(productId) },
    relations: ["seller"],
  });

  if (!product) throw new AppError("Product not found", 404);

  if (product.seller.id !== sellerId) {
    throw new AppError("You are not allowed to update this product", 403);
  }

  Object.assign(product, updates);
  return await productRepo.save(product);
};

// ========================
// Delete Product
// ========================
export const deleteProduct = async (productId: number, sellerId: number) => {
  const product = await productRepo.findOne({
    where: { id: productId },
    relations: ["seller"],
  });

  if (!product) throw new AppError("Product not found", 404);

  if (product.seller.id !== sellerId) {
    throw new AppError("You are not allowed to delete this product", 403);
  }

  return await productRepo.remove(product);
};
