"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const errors_1 = require("../utilis/errors");
const errorHandler = (error, req, res, next) => {
    console.error("❌ Error:", {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    // Validation errors
    if (error instanceof errors_1.ValidationError) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error.errors,
        });
        return;
    }
    // Custom operational errors (AppError)
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.details || undefined,
        });
        return;
    }
    // TypeORM/Database errors
    if (error.name === "QueryFailedError") {
        let message = "Database operation failed";
        let statusCode = 500;
        // Handle unique constraint violations
        if (error.message.includes("UNIQUE constraint failed")) {
            message = "A record with this information already exists";
            statusCode = 409;
        }
        res.status(statusCode).json({
            success: false,
            message,
        });
        return;
    }
    // JWT errors
    if (error.name === "JsonWebTokenError") {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
        return;
    }
    if (error.name === "TokenExpiredError") {
        res.status(401).json({
            success: false,
            message: "Token expired",
        });
        return;
    }
    // Default (unknown errors)
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message,
    });
};
exports.errorHandler = errorHandler;
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
