// src/services/userService.ts
import { AppDataSource } from "../data-source";
import { AppError } from "../utilis/errors";
import { generateOTP } from "../utilis/otp";
import { sendEmail } from "../utilis/nodemailer";
import { User, UserRole } from "../entities/user";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);
const SALT_ROUNDS = 10;

// =============================
// Register Customer
// =============================
export const registerCustomer = async (
  email: string,
  phone: string,
  password: string,
  role: UserRole = "customer"
) => {
  const existingEmail = await userRepo.findOneBy({ email });
  if (existingEmail) throw new AppError("Email is already registered", 400);

  const existingPhone = await userRepo.findOneBy({ phone });
  if (existingPhone) throw new AppError("Phone number is already registered", 400);

  if (role === "admin") {
    const existingAdmin = await userRepo.findOneBy({ role: "admin" });
    if (existingAdmin) throw new AppError("Admin already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const otp = generateOTP();

  const user = userRepo.create({
    email,
    phone,
    password: hashedPassword,
    otp,
    isVerified: false,
    role,
    status: "approved",
  });

  await userRepo.save(user);
  await sendEmail(email, "Your OTP Verification Code", `Your OTP is: ${otp}`);

  return user;
};

// =============================
// Register Seller
// =============================
export const registerSeller = async (
  email: string,
  phone: string,
  password: string,
  idCopy: string,
  licenseDoc: string
) => {
  const existingEmail = await userRepo.findOneBy({ email });
  if (existingEmail) throw new AppError("Email is already registered", 400);

  const existingPhone = await userRepo.findOneBy({ phone });
  if (existingPhone) throw new AppError("Phone number is already registered", 400);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const seller = userRepo.create({
    email,
    phone,
    password: hashedPassword,
    idCopy,
    licenseDoc,
    role: "seller",
    isVerified: false,
    status: "pending",
  });

  await userRepo.save(seller);
  return seller;
};

// =============================
// Verify OTP
// =============================
export const verifyOTP = async (email: string, otp: string) => {
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new AppError("User not found", 404);

  if (user.otp !== otp) throw new AppError("Invalid OTP", 400);

  user.isVerified = true;
  user.otp = null;
  await userRepo.save(user);

  return user;
};

// =============================
// Login
// =============================
export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  if (!user.isVerified) throw new AppError("User is not verified", 403);
  if (user.status !== "approved") throw new AppError("User not approved", 403);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1d" }
  );

  return { user, token };
};

// =============================
// Admin: Approve/Reject Seller
// =============================
export const reviewSeller = async (
  sellerId: string,
  status: "approved" | "rejected"
) => {
  const id = Number(sellerId); // convert string to number
  const seller = await userRepo.findOneBy({ id });
  if (!seller) throw new AppError("Seller not found", 404);

  if (seller.role !== "seller") throw new AppError("User is not a seller", 400);

  if (seller.status !== "pending") throw new AppError("Seller has already been reviewed", 400);

  seller.status = status;
  await userRepo.save(seller);

  if (status === "approved") {
    await sendEmail(
      seller.email,
      "Seller Approval",
      "Congratulations! Your seller account has been approved."
    );
  } else {
    await sendEmail(
      seller.email,
      "Seller Rejection",
      "Sorry, your seller account has been rejected."
    );
  }

  return seller;
};


// Find by email
export const findByEmail = async (email: string) => {
  return userRepo.findOneBy({ email });
};

// Compare passwords
export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};

// Generate JWT
export const generateToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


// Get pending sellers
export const getPendingSellers = async () => {
  return userRepo.find({
    where: { role: "seller", status: "pending" },
  });
};

// Get approved sellers
export const getApprovedSellers = async () => {
  return userRepo.find({
    where: { role: "seller", status: "approved" },
  });
};

// Get rejected sellers
export const getRejectedSellers = async () => {
  return userRepo.find({
    where: { role: "seller", status: "rejected" },
  });
};