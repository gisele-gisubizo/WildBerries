import { z } from "zod";

// Phone schema
export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, "Phone must be 10–15 digits (with optional +)");

// Registration schema
export const registerCustomerSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: phoneSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase, one uppercase letter, and one number"
    ),
  role: z.enum(["admin", "seller", "customer"]).optional(), // role
});


// ✅ Seller registration schema
export const registerSellerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),

});


// Login schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
