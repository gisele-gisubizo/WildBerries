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
exports.getProductById = exports.getAllProducts = exports.getProductsBySeller = exports.addProduct = void 0;
const data_source_1 = require("../data-source");
const product_1 = require("../entities/product");
const category_1 = require("../entities/category");
const errors_1 = require("../utilis/errors");
const productRepo = data_source_1.AppDataSource.getRepository(product_1.Product);
const categoryRepo = data_source_1.AppDataSource.getRepository(category_1.Category);
const addProduct = (sellerId, categoryId, fields) => __awaiter(void 0, void 0, void 0, function* () {
    // Find category
    const category = yield categoryRepo.findOneBy({ id: categoryId });
    if (!category)
        throw new errors_1.AppError("Category not found", 404);
    // Validate required fields
    for (const catField of category.fields) {
        const value = fields[catField.name];
        if (catField.required && (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))) {
            throw new errors_1.AppError(`Field '${catField.name}' is required`, 400);
        }
        // Additional type checks
        if (value && catField.type === "date" && isNaN(Date.parse(value))) {
            throw new errors_1.AppError(`Field '${catField.name}' must be a valid date`, 400);
        }
    }
    const product = productRepo.create({ sellerId, categoryId, fields });
    yield productRepo.save(product);
    return product;
});
exports.addProduct = addProduct;
const getProductsBySeller = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield productRepo.find({
        where: { sellerId },
        relations: ["category"],
    });
});
exports.getProductsBySeller = getProductsBySeller;
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield productRepo.find({ relations: ["category", "seller"] });
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productRepo.findOne({ where: { id }, relations: ["category", "seller"] });
    if (!product)
        throw new errors_1.AppError("Product not found", 404);
    return product;
});
exports.getProductById = getProductById;
