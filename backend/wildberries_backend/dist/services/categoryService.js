"use strict";
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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const data_source_1 = require("../data-source");
const errors_1 = require("../utilis/errors");
const category_1 = require("../entities/category");
const categoryRepo = data_source_1.AppDataSource.getRepository(category_1.Category);
// =============================
// Create Category
// =============================
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield categoryRepo.findOneBy({ name: data.name });
    if (existingCategory)
        throw new errors_1.AppError("Category already exists", 400);
    const category = categoryRepo.create(data);
    yield categoryRepo.save(category);
    return category;
});
exports.createCategory = createCategory;
// =============================
// Get All Categories
// =============================
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return categoryRepo.find();
});
exports.getAllCategories = getAllCategories;
// =============================
// Get Category by ID
// =============================
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categoryRepo.findOneBy({ id });
    if (!category)
        throw new errors_1.AppError("Category not found", 404);
    return category;
});
exports.getCategoryById = getCategoryById;
// =============================
// Update Category
// =============================
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categoryRepo.findOneBy({ id });
    if (!category)
        throw new errors_1.AppError("Category not found", 404);
    Object.assign(category, data);
    yield categoryRepo.save(category);
    return category;
});
exports.updateCategory = updateCategory;
// =============================
// Delete Category
// =============================
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categoryRepo.findOneBy({ id });
    if (!category)
        throw new errors_1.AppError("Category not found", 404);
    yield categoryRepo.remove(category);
    return category;
});
exports.deleteCategory = deleteCategory;
