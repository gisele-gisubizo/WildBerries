"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const secret = process.env.JWT_SECRET || "secret123";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
// ✅ Admin-only check (same file, no extra file)
const requireAdmin = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
