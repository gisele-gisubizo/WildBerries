import { ZodIssue } from "zod";
import { Request } from "express";
import { Users } from "../entities/user";

export interface AuthenticatedRequest extends Request {
  user?: Users;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | ZodIssue[];
}

// Roles must match User entity
export type UserRole = "admin" | "seller" | "customer";
export type UserStatus = "pending" | "approved" | "rejected";
