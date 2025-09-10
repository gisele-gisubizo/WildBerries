"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameSchema = exports.passwordSchema = exports.emailSchema = exports.paginationSchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
// ✅ ID Schema (always coerced to number)
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive("ID must be a valid positive number"),
});
// ✅ Pagination Schema (page & limit coerced to numbers with defaults)
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(100, "Limit cannot exceed 100")
        .default(10),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
});
// ✅ Email Schema
exports.emailSchema = zod_1.z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters");
// ✅ Password Schema (strong password rules)
exports.passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number");
// ✅ Name Schema
exports.nameSchema = zod_1.z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");
