"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRejectedSellersController = exports.getApprovedSellersController = exports.getPendingSellersController = exports.rejectSellerController = exports.approveSellerController = exports.deleteOwnAccountController = exports.updateOwnAccountController = exports.deleteUserController = exports.getUserByIdController = exports.getAllUsersController = exports.loginController = exports.verifyOtpController = exports.registerSellerController = exports.registerCustomerController = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const errors_1 = require("../utilis/errors");
const user_schemas_1 = require("../schemas/user.schemas");
const UserService = __importStar(require("../services/userService"));
// ========================
// Register Customer
// ========================
exports.registerCustomerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_schemas_1.registerCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new errors_1.AppError("Validation failed", 400, parsed.error.issues);
    }
    const { email, phone, password, role } = parsed.data;
    const user = yield UserService.registerCustomer(email, phone, password, role);
    res.status(201).json({
        success: true,
        message: "Registered successfully. Please verify your email with the OTP sent.",
        data: { id: user.id, email: user.email, phone: user.phone, role: user.role },
    });
}));
exports.registerSellerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { name, email, phone, password } = req.body;
    const idCopy = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.idCopy) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
    const licenseDoc = (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.licenseDoc) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path;
    if (!idCopy || !licenseDoc) {
        throw new errors_1.AppError("Both ID copy and license document are required.", 400);
    }
    const parsed = user_schemas_1.registerSellerSchema.safeParse({
        name,
        email,
        phone,
        password,
        idCopy,
        licenseDoc,
    });
    if (!parsed.success) {
        throw new errors_1.AppError("Validation failed", 400, parsed.error.issues);
    }
    const seller = yield UserService.registerSeller(name, email, phone, password, idCopy, licenseDoc);
    res.status(201).json({
        success: true,
        message: "Seller registered successfully. Awaiting admin approval.",
        data: seller,
    });
}));
// ========================
// Verify OTP
// ========================
exports.verifyOtpController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield UserService.getUserByEmail(email);
    if (!user)
        throw new errors_1.AppError("User not found", 404);
    if (user.isVerified)
        throw new errors_1.AppError("User already verified", 400);
    if (user.otp !== otp)
        throw new errors_1.AppError("Invalid OTP", 400);
    user.isVerified = true;
    user.otp = null;
    yield UserService.updateUser(user);
    res.status(200).json({ success: true, message: "Email verified successfully" });
}));
// ========================
// Login
// ========================
exports.loginController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_schemas_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new errors_1.AppError("Validation failed", 400, parsed.error.issues.map((e) => ({ path: e.path, message: e.message })));
    }
    const { email, password } = parsed.data;
    const user = yield UserService.findByEmail(email);
    if (!user)
        throw new errors_1.AppError("Invalid email or password", 401);
    if (!user.isVerified)
        throw new errors_1.AppError("Please verify your email before logging in", 403);
    if (user.role === "seller" && user.status !== "approved") {
        throw new errors_1.AppError("Your seller account is not approved yet", 403);
    }
    const isPasswordValid = yield UserService.comparePassword(password, user.password);
    if (!isPasswordValid)
        throw new errors_1.AppError("Invalid email or password", 401);
    const token = UserService.generateToken(user);
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: { id: user.id, email: user.email, role: user.role, token },
    });
}));
// ========================
// Get all users
// ========================
exports.getAllUsersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
}));
// ========================
// Get user by ID
// ========================
exports.getUserByIdController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    if (isNaN(userId))
        throw new errors_1.AppError("Invalid user ID", 400);
    const user = yield UserService.getUserById(userId);
    res.status(200).json({ success: true, data: user });
}));
// ========================
// Delete user (Admin)
// ========================
exports.deleteUserController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    if (isNaN(userId))
        throw new errors_1.AppError("Invalid user ID", 400);
    const deleted = yield UserService.deleteUser(userId);
    res.status(200).json({ success: true, message: "User deleted successfully", data: deleted });
}));
// ========================
// Update own account
// ========================
exports.updateOwnAccountController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId);
    if (!userId)
        throw new errors_1.AppError("User not authenticated", 401);
    const updated = yield UserService.updateOwnAccount(userId, req.body);
    res.status(200).json({ success: true, message: "Account updated successfully", data: updated });
}));
// ========================
// Delete own account
// ========================
exports.deleteOwnAccountController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId);
    if (!userId)
        throw new errors_1.AppError("User not authenticated", 401);
    yield UserService.deleteOwnAccount(userId);
    res.status(200).json({ success: true, message: "Account deleted successfully" });
}));
// ========================
// Approve Seller
// ========================
exports.approveSellerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = Number(req.params.id);
    if (isNaN(sellerId))
        throw new errors_1.AppError("Invalid seller ID", 400);
    const seller = yield UserService.approveSeller(sellerId);
    res.status(200).json({ success: true, message: "Seller approved successfully", data: seller });
}));
// ========================
// Reject Seller
// ========================
exports.rejectSellerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = Number(req.params.id);
    const { reason } = req.body;
    if (isNaN(sellerId))
        throw new errors_1.AppError("Invalid seller ID", 400);
    const seller = yield UserService.rejectSeller(sellerId, reason);
    res.status(200).json({ success: true, message: "Seller rejected successfully", data: seller });
}));
// ========================
// Get sellers by status
// ========================
exports.getPendingSellersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield UserService.getPendingSellers();
    res.status(200).json({ success: true, message: "Pending sellers retrieved successfully", data: sellers });
}));
exports.getApprovedSellersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield UserService.getApprovedSellers();
    res.status(200).json({ success: true, message: "Approved sellers retrieved successfully", data: sellers });
}));
exports.getRejectedSellersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield UserService.getRejectedSellers();
    res.status(200).json({ success: true, message: "Rejected sellers retrieved successfully", data: sellers });
}));
