import { z } from "zod";

// Product creation schema
export const createProductSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(1, { message: "Product name is required" })
    .max(255, { message: "Name too long" }),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.01, { message: "Price must be positive" }),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .min(10, { message: "Description must be at least 10 characters" }),
  stockQuantity: z
    .number({ invalid_type_error: "Stock quantity must be a number" })
    .int()
    .min(0, { message: "Stock cannot be negative" }),
  categoryId: z
    .number({ invalid_type_error: "Category ID must be a number" })
    .int()
    .min(1, { message: "Valid category ID required" }),
  categoryFields: z.record(z.any()).optional(),
  images: z
    .array(
      z
        .string({ invalid_type_error: "Image must be a string" })
        .url({ message: "Image must be a valid URL" })
    )
    .optional(),
  status: z
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
export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  price: z.number().min(0.01).optional(),
  description: z.string().min(10).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  categoryId: z.number().int().positive().optional(),
  categoryFields: z.record(z.any()).optional(),
  images: z.array(z.string().url()).optional(),
  status: z
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
export const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  categoryId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  status: z
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
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  search: z.string().optional(),
});
