import { Router } from "express";
import { upload } from "../middlewares/upload"
import { authMiddleware } from "../middlewares/authMiddleware";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController";

const router = Router();

// Accept one main image + up to 5 gallery images
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  createProduct
);

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected seller routes
// For updating product images (up to 5 images)
router.put("/:id", authMiddleware, upload.array("images", 5), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
