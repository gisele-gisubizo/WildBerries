"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsersByFilter = exports.getUserById = exports.getAllUsers = exports.getRejectedSellers = exports.getApprovedSellers = exports.getPendingSellers = exports.generateToken = exports.comparePassword = exports.findByEmail = exports.reviewSeller = exports.loginUser = exports.verifyOTP = exports.registerSeller = exports.registerCustomer = void 0;
// src/services/userService.ts
const data_source_1 = require("../data-source");
const errors_1 = require("../utilis/errors");
const otp_1 = require("../utilis/otp");
const nodemailer_1 = require("../utilis/nodemailer");
const user_1 = require("../entities/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepo = data_source_1.AppDataSource.getRepository(user_1.User);
const SALT_ROUNDS = 10;
// =============================
// Register Customer
// =============================
const registerCustomer = (email_1, phone_1, password_1, ...args_1) => __awaiter(void 0, [email_1, phone_1, password_1, ...args_1], void 0, function* (email, phone, password, role = "customer") {
    const existingEmail = yield userRepo.findOneBy({ email });
    if (existingEmail)
        throw new errors_1.AppError("Email is already registered", 400);
    const existingPhone = yield userRepo.findOneBy({ phone });
    if (existingPhone)
        throw new errors_1.AppError("Phone number is already registered", 400);
    // Temporarily allow multiple admins for testing
    // if (role === "admin") {
    //   const existingAdmin = await userRepo.findOneBy({ role: "admin" });
    //   if (existingAdmin) throw new AppError("Admin already exists", 400);
    // }
    const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    const otp = (0, otp_1.generateOTP)();
    const user = userRepo.create({
        email,
        phone,
        password: hashedPassword,
        otp,
        isVerified: false,
        role,
        status: "approved",
    });
    yield userRepo.save(user);
    yield (0, nodemailer_1.sendEmail)(email, "Your OTP Verification Code", `Your OTP is: ${otp}`);
    return user;
});
exports.registerCustomer = registerCustomer;
// =============================
// Register Seller
// =============================
const registerSeller = (name, email, phone, password, idCopy, licenseDoc, category, address) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmail = yield userRepo.findOneBy({ email });
    if (existingEmail)
        throw new errors_1.AppError("Email is already registered", 400);
    const existingPhone = yield userRepo.findOneBy({ phone });
    if (existingPhone)
        throw new errors_1.AppError("Phone number is already registered", 400);
    const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    const otp = (0, otp_1.generateOTP)();
    const seller = userRepo.create({
        name,
        email,
        phone,
        password: hashedPassword,
        otp,
        idCopy,
        licenseDoc,
        category,
        address,
        role: "seller",
        isVerified: false,
        status: "pending",
    });
    yield userRepo.save(seller);
    yield (0, nodemailer_1.sendEmail)(email, "Your OTP Verification Code", `Your OTP is: ${otp}`);
    return seller;
});
exports.registerSeller = registerSeller;
// =============================
// Verify OTP
// =============================
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepo.findOneBy({ email });
    if (!user)
        throw new errors_1.AppError("User not found", 404);
    // Temporarily accept 123456 for testing
    if (otp !== "123456")
        throw new errors_1.AppError("Invalid OTP", 400);
    user.isVerified = true;
    user.otp = null;
    yield userRepo.save(user);
    return user;
});
exports.verifyOTP = verifyOTP;
// =============================
// Login
// =============================
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepo.findOneBy({ email });
    if (!user)
        throw new errors_1.AppError("User not found", 404);
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new errors_1.AppError("Invalid credentials", 401);
    if (!user.isVerified)
        throw new errors_1.AppError("User is not verified", 403);
    if (user.status !== "approved")
        throw new errors_1.AppError("User not approved", 403);
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret123", { expiresIn: "1d" });
    return { user, token };
});
exports.loginUser = loginUser;
// =============================
// Admin: Approve/Reject Seller
// =============================
const reviewSeller = (sellerId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(sellerId); // convert string to number
    const seller = yield userRepo.findOneBy({ id });
    if (!seller)
        throw new errors_1.AppError("Seller not found", 404);
    if (seller.role !== "seller")
        throw new errors_1.AppError("User is not a seller", 400);
    if (seller.status !== "pending")
        throw new errors_1.AppError("Seller has already been reviewed", 400);
    seller.status = status;
    yield userRepo.save(seller);
    if (status === "approved") {
        yield (0, nodemailer_1.sendEmail)(seller.email, "Seller Approval", "Congratulations! Your seller account has been approved.");
    }
    else {
        yield (0, nodemailer_1.sendEmail)(seller.email, "Seller Rejection", "Sorry, your seller account has been rejected.");
    }
    return seller;
});
exports.reviewSeller = reviewSeller;
// Find by email
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepo.findOneBy({ email });
});
exports.findByEmail = findByEmail;
// Compare passwords
const comparePassword = (plain, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(plain, hashed);
});
exports.comparePassword = comparePassword;
// Generate JWT
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
exports.generateToken = generateToken;
// Get pending sellers
const getPendingSellers = () => __awaiter(void 0, void 0, void 0, function* () {
    return userRepo.find({
        where: { role: "seller", status: "pending" },
    });
});
exports.getPendingSellers = getPendingSellers;
// Get approved sellers
const getApprovedSellers = () => __awaiter(void 0, void 0, void 0, function* () {
    return userRepo.find({
        where: { role: "seller", status: "approved" },
    });
});
exports.getApprovedSellers = getApprovedSellers;
// Get rejected sellers
const getRejectedSellers = () => __awaiter(void 0, void 0, void 0, function* () {
    return userRepo.find({
        where: { role: "seller", status: "rejected" },
    });
});
exports.getRejectedSellers = getRejectedSellers;
// =============================
// Get all users
// =============================
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return userRepo.find();
});
exports.getAllUsers = getAllUsers;
// =============================
// Get user by ID
// =============================
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepo.findOneBy({ id });
    if (!user)
        throw new errors_1.AppError("User not found", 404);
    return user;
});
exports.getUserById = getUserById;
const getUsersByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepo.find({ where: filter });
});
exports.getUsersByFilter = getUsersByFilter;
// =============================
// Update user
// =============================
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepo.findOneBy({ id });
    if (!user)
        throw new errors_1.AppError("User not found", 404);
    Object.assign(user, data);
    yield userRepo.save(user);
    return user;
});
exports.updateUser = updateUser;
// =============================
// Delete user
// =============================
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepo.findOneBy({ id });
    if (!user)
        throw new errors_1.AppError("User not found", 404);
    yield userRepo.remove(user);
    return user;
});
exports.deleteUser = deleteUser;
