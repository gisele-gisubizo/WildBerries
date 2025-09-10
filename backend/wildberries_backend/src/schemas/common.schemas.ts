import { z } from "zod";

// ✅ ID Schema (always coerced to number)
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a valid positive number"),
});

// ✅ Pagination Schema (page & limit coerced to numbers with defaults)
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// ✅ Email Schema
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(100, "Email must be less than 100 characters");

// ✅ Password Schema (strong password rules)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be less than 255 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

// ✅ Name Schema
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");
