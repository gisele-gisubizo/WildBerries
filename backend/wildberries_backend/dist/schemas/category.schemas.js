"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
// Category creation schema
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.enum([
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
        "Services"
    ]),
    fields: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1, "Field name is required"),
        type: zod_1.z.enum(["string", "number", "boolean", "array", "date"]),
        required: zod_1.z.boolean(),
        options: zod_1.z.array(zod_1.z.string()).optional()
    })).min(1, "At least one field is required"),
    description: zod_1.z.string().optional()
});
// Category update schema
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.enum([
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
        "Services"
    ]).optional(),
    fields: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1, "Field name is required"),
        type: zod_1.z.enum(["string", "number", "boolean", "array", "date"]),
        required: zod_1.z.boolean(),
        options: zod_1.z.array(zod_1.z.string()).optional()
    })).optional(),
    description: zod_1.z.string().optional()
});
