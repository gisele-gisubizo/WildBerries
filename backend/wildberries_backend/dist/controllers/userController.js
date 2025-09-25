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
exports.deleteUserController = exports.updateUserController = exports.getUsersByFilterController = exports.getUserByIdController = exports.getAllUsersController = exports.getRejectedSellersController = exports.getApprovedSellersController = exports.getPendingSellersController = exports.rejectSellerController = exports.approveSellerController = exports.loginController = exports.verifyOtpController = exports.registerSellerController = exports.registerCustomerController = void 0;
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
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.issues,
        });
    }
    const { email, phone, password, role } = parsed.data;
    const user = yield UserService.registerCustomer(email, phone, password, role);
    return res.status(201).json({
        success: true,
        message: "Registered successfully. Please verify your email with the OTP sent.",
        data: { id: user.id, email: user.email, phone: user.phone, role: user.role },
    });
}));
exports.registerSellerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { name, email, phone, password, category, address } = req.body;
    const idCopy = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.idCopy) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
    const licenseDoc = (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.licenseDoc) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path;
    if (!idCopy || !licenseDoc) {
        return res.status(400).json({ success: false, message: "Both ID copy and license document are required." });
    }
    const parsed = user_schemas_1.registerSellerSchema.safeParse({ name, email, phone, password, category, address });
    if (!parsed.success) {
        return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
    }
    const seller = yield UserService.registerSeller(name, email, phone, password, idCopy, licenseDoc, category, address);
    return res.status(201).json({
        success: true,
        message: "Seller registered successfully. Awaiting admin approval.",
        data: { id: seller.id, name: seller.name, email: seller.email, phone: seller.phone, role: seller.role, category: seller.category, address: seller.address },
    });
}));
// ========================
// Verify OTP
// ========================
exports.verifyOtpController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield UserService.findByEmail(email);
    if (!user)
        return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified)
        return res.status(400).json({ success: false, message: "User already verified" });
    // Temporarily accept 123456 for testing
    if (otp !== "123456")
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    user.isVerified = true;
    user.otp = null;
    yield UserService.verifyOTP(email, otp);
    return res.status(200).json({ success: true, message: "Email verified successfully" });
}));
// ========================
// Login
// ========================
exports.loginController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_schemas_1.loginSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errors_1.AppError("Validation failed", 400, parsed.error.issues);
    const { email, password } = parsed.data;
    const { user, token } = yield UserService.loginUser(email, password);
    return res.status(200).json({ success: true, message: "Login successful", data: { id: user.id, email: user.email, role: user.role, token } });
}));
// ========================
// Approve Seller
// ========================
exports.approveSellerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = Number(req.params.id);
    if (isNaN(sellerId))
        throw new errors_1.AppError("Invalid seller ID", 400);
    const seller = yield UserService.reviewSeller(sellerId, "approved");
    return res.status(200).json({ success: true, message: "Seller approved successfully", data: seller });
}));
// ========================
// Reject Seller
// ========================
exports.rejectSellerController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = Number(req.params.id);
    if (isNaN(sellerId))
        throw new errors_1.AppError("Invalid seller ID", 400);
    const seller = yield UserService.reviewSeller(sellerId, "rejected");
    return res.status(200).json({ success: true, message: "Seller rejected successfully", data: seller });
}));
// ========================
// Get pending sellers
// ========================
exports.getPendingSellersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield UserService.getPendingSellers();
    res.status(200).json({ success: true, message: "Pending sellers retrieved successfully", data: sellers });
}));
// ========================
// Get approved sellers
// ========================
exports.getApprovedSellersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield UserService.getApprovedSellers();
    res.status(200).json({ success: true, message: "Approved sellers retrieved successfully", data: sellers });
}));
// ========================
// Get rejected sellers
// ========================
exports.getRejectedSellersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield UserService.getRejectedSellers();
    res.status(200).json({ success: true, message: "Rejected sellers retrieved successfully", data: sellers });
}));
// ========================
// Get all users
// ========================
// =============================
// Get all users
// =============================
exports.getAllUsersController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserService.getAllUsers();
    res.status(200).json({ success: true, message: "Users retrieved", data: users });
}));
// =============================
// Get user by ID
// =============================
exports.getUserByIdController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        throw new errors_1.AppError("Invalid user ID", 400);
    const user = yield UserService.getUserById(id);
    res.status(200).json({ success: true, message: "User retrieved", data: user });
}));
// =============================
// Get users by filter (role/status)
// =============================
exports.getUsersByFilterController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, status } = req.query;
    const filter = {};
    if (role)
        filter.role = role;
    if (status)
        filter.status = status;
    const users = yield UserService.getUsersByFilter(filter);
    res.status(200).json({ success: true, message: "Filtered users retrieved", data: users });
}));
// =============================
// Update user
// =============================
exports.updateUserController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        throw new errors_1.AppError("Invalid user ID", 400);
    const updatedUser = yield UserService.updateUser(id, req.body);
    res.status(200).json({ success: true, message: "User updated", data: updatedUser });
}));
// =============================
// Delete user
// =============================
exports.deleteUserController = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        throw new errors_1.AppError("Invalid user ID", 400);
    const deletedUser = yield UserService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted", data: deletedUser });
}));
