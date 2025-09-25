"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Product creation schema
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "Name must be a string" })
        .min(1, { message: "Product name is required" })
        .max(255, { message: "Name too long" }),
    price: zod_1.z
        .number({ invalid_type_error: "Price must be a number" })
        .min(0.01, { message: "Price must be positive" }),
    description: zod_1.z
        .string({ invalid_type_error: "Description must be a string" })
        .min(10, { message: "Description must be at least 10 characters" }),
    stockQuantity: zod_1.z
        .number({ invalid_type_error: "Stock quantity must be a number" })
        .int()
        .min(0, { message: "Stock cannot be negative" }),
    categoryId: zod_1.z
        .number({ invalid_type_error: "Category ID must be a number" })
        .int()
        .min(1, { message: "Valid category ID required" }),
    categoryFields: zod_1.z.record(zod_1.z.any()).optional(),
    images: zod_1.z
        .array(zod_1.z
        .string({ invalid_type_error: "Image must be a string" })
        .url({ message: "Image must be a valid URL" }))
        .optional(),
    status: zod_1.z
        .enum([
        "draft",
        "active",
        "out_of_stock",
        "ordered",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
    ])
        .optional(),
});
// Product update schema
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    price: zod_1.z.number().min(0.01).optional(),
    description: zod_1.z.string().min(10).optional(),
    stockQuantity: zod_1.z.number().int().min(0).optional(),
    categoryId: zod_1.z.number().int().positive().optional(),
    categoryFields: zod_1.z.record(zod_1.z.any()).optional(),
    images: zod_1.z.array(zod_1.z.string().url()).optional(),
    status: zod_1.z
        .enum([
        "draft",
        "active",
        "out_of_stock",
        "ordered",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
    ])
        .optional(),
});
// Product query schema
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 10)),
    categoryId: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),
    status: zod_1.z
        .enum([
        "draft",
        "active",
        "out_of_stock",
        "ordered",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
    ])
        .optional(),
    minPrice: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined)),
    search: zod_1.z.string().optional(),
});
