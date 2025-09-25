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
exports.getAllProductsController = exports.getSellerProductsController = exports.addProductController = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const errors_1 = require("../utilis/errors");
const ProductService = __importStar(require("../services/productservices"));
// ========================
// Add Product
// ========================
exports.addProductController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new errors_1.AppError("Unauthorized", 401);
    const sellerId = req.user.id;
    const { fields } = req.body;
    if (!fields || typeof fields !== "object") {
        throw new errors_1.AppError("Fields object is required", 400);
    }
    const category = req.user.category;
    if (!category) {
        throw new errors_1.AppError("Seller category not set. Cannot add product.", 400);
    }
    const product = yield ProductService.addProduct(sellerId, category, fields);
    return res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: product,
    });
}));
// ========================
// Get Seller Products
// ========================
exports.getSellerProductsController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new errors_1.AppError("Unauthorized", 401);
    const sellerId = req.user.id;
    const products = yield ProductService.getProductsBySeller(sellerId);
    return res.status(200).json({
        success: true,
        message: "Seller products retrieved successfully",
        data: products,
    });
}));
// ========================
// Get All Products
// ========================
exports.getAllProductsController = (0, errorHandler_1.asyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield ProductService.getAllProducts();
    return res.status(200).json({
        success: true,
        message: "All products retrieved successfully",
        data: products,
    });
}));
