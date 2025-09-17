import { z } from "zod";

// Category creation schema
export const createCategorySchema = z.object({
  name: z.enum([
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
  fields: z.array(z.object({
    name: z.string().min(1, "Field name is required"),
    type: z.enum(["string", "number", "boolean", "array", "date"]),
    required: z.boolean(),
    options: z.array(z.string()).optional()
  })).min(1, "At least one field is required"),
  description: z.string().optional()
});

// Category update schema
export const updateCategorySchema = z.object({
  name: z.enum([
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
  fields: z.array(z.object({
    name: z.string().min(1, "Field name is required"),
    type: z.enum(["string", "number", "boolean", "array", "date"]),
    required: z.boolean(),
    options: z.array(z.string()).optional()
  })).optional(),
  description: z.string().optional()
});
