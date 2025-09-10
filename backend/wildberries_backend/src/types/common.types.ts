import { Request } from 'express';
// import { User } from '../entities/User';
import { User } from '../entities/user';
import { ZodIssue } from 'zod';

export interface AuthenticatedRequest extends Request {
  user?: User;
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
  errors?: Record<string, string[]> | ZodIssue[]; // ✅ strict instead of "any"
}

// Roles
export type UserRole = "user" | "admin";
