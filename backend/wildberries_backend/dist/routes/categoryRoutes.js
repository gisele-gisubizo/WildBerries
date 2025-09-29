"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
// Create category
router.post("/", categoryController_1.createCategoryController);
// Get all categories
router.get("/", categoryController_1.getAllCategoriesController);
// Get category by ID
router.get("/:id", categoryController_1.getCategoryByIdController);
// Update category
router.put("/:id", categoryController_1.updateCategoryController);
// Delete category
router.delete("/:id", categoryController_1.deleteCategoryController);
exports.default = router;
