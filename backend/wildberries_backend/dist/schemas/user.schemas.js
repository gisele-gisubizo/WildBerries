"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSellerSchema = exports.registerCustomerSchema = exports.phoneSchema = void 0;
const zod_1 = require("zod");
// Phone schema
exports.phoneSchema = zod_1.z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Phone must be 10–15 digits (with optional +)");
// Registration schema
exports.registerCustomerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    phone: exports.phoneSchema,
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(255, "Password must be less than 255 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase, one uppercase letter, and one number"),
    role: zod_1.z.enum(["admin", "seller", "customer"]).optional(), // role
});
// ✅ Seller registration schema
exports.registerSellerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(10),
    password: zod_1.z.string().min(6),
});
// Login schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Valid email is required" }),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters" }),
});
