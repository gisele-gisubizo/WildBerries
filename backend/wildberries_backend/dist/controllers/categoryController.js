"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryController = exports.updateCategoryController = exports.getCategoryByIdController = exports.getAllCategoriesController = exports.createCategoryController = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const category_schemas_1 = require("../schemas/category.schemas");
const CategoryService = __importStar(require("../services/categoryService"));
// ========================
// Create Category
// ========================
exports.createCategoryController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = category_schemas_1.createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.issues,
        });
    }
    const category = yield CategoryService.createCategory(parsed.data);
    return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
}));
// ========================
// Get All Categories
// ========================
exports.getAllCategoriesController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield CategoryService.getAllCategories();
    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
}));
// ========================
// Get Category by ID
// ========================
exports.getCategoryByIdController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        throw new Error("Invalid category ID");
    const category = yield CategoryService.getCategoryById(id);
    res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
}));
// ========================
// Update Category
// ========================
exports.updateCategoryController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        throw new Error("Invalid category ID");
    const parsed = category_schemas_1.updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.issues,
        });
    }
    const category = yield CategoryService.updateCategory(id, parsed.data);
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
}));
// ========================
// Delete Category
// ========================
exports.deleteCategoryController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        throw new Error("Invalid category ID");
    const category = yield CategoryService.deleteCategory(id);
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: category,
    });
}));
