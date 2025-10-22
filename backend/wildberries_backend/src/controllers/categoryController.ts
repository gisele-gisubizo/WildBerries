import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { ApiResponse } from "../types/common.types";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schemas";
import * as CategoryService from "../services/categoryService";
import { CategoryType } from "../entities/category";

// ========================
// Create Category
// ========================
export const createCategoryController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const category = await CategoryService.createCategory(parsed.data);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }
);

// ========================
// Get All Categories
// ========================
export const getAllCategoriesController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  }
);

// ========================
// Get Category by ID
// ========================
export const getCategoryByIdController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid category ID");

    const category = await CategoryService.getCategoryById(id);
    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  }
);


// ========================
// Get Category with Subcategories
// ========================
export const getCategoryWithSubcategoriesController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const name = req.params.name;

    // ✅ Type-safe validation
    const validCategories: CategoryType[] = [
      "Fashion & Clothing",
      "Electronics & Gadgets",
      "Home & Furniture",
      "Food & Beverages",
      "Beauty & Personal Care",
      "Books & Stationery",
      "Health & Fitness",
      "Automotive & Accessories",
      "Kids & Baby Products",
      "Real Estate & Property",
      "Services",
    ];

    if (!validCategories.includes(name as CategoryType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category name",
      });
    }

    const category = await CategoryService.getCategoryWithSubcategories(
      name as CategoryType
    );

    res.status(200).json({
      success: true,
      message: "Category with subcategories retrieved successfully",
      data: category,
    });
  }
);


// ========================
// Update Category
// ========================
export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid category ID");

    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const category = await CategoryService.updateCategory(id, parsed.data);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  }
);

// ========================
// Delete Category
// ========================
export const deleteCategoryController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid category ID");

    const category = await CategoryService.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  }
);
