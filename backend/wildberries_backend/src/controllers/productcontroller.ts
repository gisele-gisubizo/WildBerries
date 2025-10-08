import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { ProductService } from "../services/productservices";
import { User} from "../entities/user"
import { AppDataSource } from "../data-source";
// import cloudinary from "../utilis/cloudinary";

interface MulterFilesRequest extends Request {
  files?: {
    mainImage?: Express.Multer.File[];
    gallery?: Express.Multer.File[];
  };
}

export const createProduct = asyncHandler(async (req: MulterFilesRequest, res: Response) => {
  const sellerId = req.userId; // ✅ Comes from authMiddleware
  if (!sellerId) {
    return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
  }

  const { name, price, stock, categoryId, attributes } = req.body;
  const files = req.files;

  if (!files?.mainImage?.[0]) {
    return res.status(400).json({ success: false, message: "Main image is required" });
  }

  // Collect uploaded image paths
  const imageUrls: string[] = [];
  imageUrls.push(files.mainImage[0].path);

  if (files.gallery) {
    for (const file of files.gallery) {
      imageUrls.push(file.path);
    }
  }

  // ✅ Use Data Mapper to get the seller
  const userRepo = AppDataSource.getRepository(User);
  const seller = await userRepo.findOne({ where: { id: Number(sellerId) } });
  if (!seller) {
    return res.status(404).json({ success: false, message: "Seller not found" });
  }

  // Create product via service
  const product = await ProductService.createProduct(
    {
      name,
      price,
      stock,
      categoryId: Number(categoryId),
      attributes: attributes ? JSON.parse(attributes) : {},
      images: imageUrls,
    },
    seller.id // Pass sellerId
  );

  res.status(201).json({ success: true, data: product });
});




// ========================
// Get all products
// ========================
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const order = (req.query.order as "ASC" | "DESC") || "DESC";
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const sellerId = req.query.sellerId ? Number(req.query.sellerId) : undefined;

  // TODO: Implement the sorting logic in the getAllProducts() service
  // const result = await ProductService.getAllProducts(page, limit, sortBy, order, { categoryId, sellerId });
  const result = await ProductService.getAllProducts();
  res.status(200).json({ success: true, ...result });
});

// ========================
// Get product by ID
// ========================
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductService.getProductById(parseInt(id));
  res.status(200).json({ success: true, data: product });
});

// ========================
// Update product
// ========================
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sellerId = req.userId; // from authMiddleware
  if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });

  const updatedProduct = await ProductService.updateProduct(parseInt(id), parseInt(sellerId), req.body);
  res.status(200).json({ success: true, data: updatedProduct });
});

// ========================
// Delete product
// ========================
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sellerId = req.userId; // from authMiddleware
  if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });

  const deletedProduct = await ProductService.deleteProduct(parseInt(id), parseInt(sellerId));
  res.status(200).json({ success: true, message: "Product deleted", data: deletedProduct });
});