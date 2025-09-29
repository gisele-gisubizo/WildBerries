import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController";

const router = Router();

// Create category
router.post("/", createCategoryController);

// Get all categories
router.get("/", getAllCategoriesController);

// Get category by ID
router.get("/:id", getCategoryByIdController);

// Update category
router.put("/:id", updateCategoryController);

// Delete category
router.delete("/:id", deleteCategoryController);

export default router;
