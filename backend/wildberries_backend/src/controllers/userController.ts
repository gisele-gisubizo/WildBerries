// controllers/userController.ts
import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { AppError } from "../utilis/errors";
import { ApiResponse, AuthenticatedRequest } from "../types/common.types";
import { registerCustomerSchema, registerSellerSchema, loginSchema } from "../schemas/user.schemas";
import * as UserService from "../services/userService";

// ========================
// Register Customer
// ========================
export const registerCustomerController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    const parsed = registerCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const { email, phone, password, role } = parsed.data;

    const user = await UserService.registerCustomer(email, phone, password, role);

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Please verify your email with the OTP sent.",
      data: { id: user.id, email: user.email, phone: user.phone, role: user.role },
    });
  }
);

// ========================
// Register Seller
// ========================
interface MulterRequestFields extends Request {
  files?: {
    idCopy?: Express.Multer.File[];
    licenseDoc?: Express.Multer.File[];
  };
}

export const registerSellerController = asyncHandler(
  async (req: MulterRequestFields, res: Response<ApiResponse>) => {
    const { name, email, phone, password, category, address } = req.body;
    const idCopy = req.files?.idCopy?.[0]?.path;
    const licenseDoc = req.files?.licenseDoc?.[0]?.path;

    if (!idCopy || !licenseDoc) {
      return res.status(400).json({ success: false, message: "Both ID copy and license document are required." });
    }

    const parsed = registerSellerSchema.safeParse({ name, email, phone, password, category, address });
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
    }

    const seller = await UserService.registerSeller(name, email, phone, password, idCopy, licenseDoc, category, address);

    return res.status(201).json({ success: true, message: "Seller registered successfully. Awaiting admin approval.", data: seller });
  }
);

// ========================
// Verify OTP
// ========================
export const verifyOtpController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { email, otp } = req.body;
  const user = await UserService.findByEmail(email);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });
  if (user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

  user.isVerified = true;
  user.otp = null;
  await UserService.verifyOTP(email, otp);

  return res.status(200).json({ success: true, message: "Email verified successfully" });
});

// ========================
// Login
// ========================
export const loginController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError("Validation failed", 400, parsed.error.issues);

  const { email, password } = parsed.data;
  const { user, token } = await UserService.loginUser(email, password);

  return res.status(200).json({ success: true, message: "Login successful", data: { id: user.id, email: user.email, role: user.role, token } });
});

// ========================
// Approve Seller
// ========================
export const approveSellerController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellerId = Number(req.params.id);
  if (isNaN(sellerId)) throw new AppError("Invalid seller ID", 400);

  const seller = await UserService.reviewSeller(sellerId, "approved");
  return res.status(200).json({ success: true, message: "Seller approved successfully", data: seller });
});

// ========================
// Reject Seller
// ========================
export const rejectSellerController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellerId = Number(req.params.id);
  if (isNaN(sellerId)) throw new AppError("Invalid seller ID", 400);

  const seller = await UserService.reviewSeller(sellerId, "rejected");
  return res.status(200).json({ success: true, message: "Seller rejected successfully", data: seller });
});

// ========================
// Get pending sellers
// ========================
export const getPendingSellersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellers = await UserService.getPendingSellers();
  res.status(200).json({ success: true, message: "Pending sellers retrieved successfully", data: sellers });
});

// ========================
// Get approved sellers
// ========================
export const getApprovedSellersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellers = await UserService.getApprovedSellers();
  res.status(200).json({ success: true, message: "Approved sellers retrieved successfully", data: sellers });
});

// ========================
// Get rejected sellers
// ========================
export const getRejectedSellersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellers = await UserService.getRejectedSellers();
  res.status(200).json({ success: true, message: "Rejected sellers retrieved successfully", data: sellers });
});

// ========================
// Get all users
// ========================
// =============================
// Get all users
// =============================
export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, message: "Users retrieved", data: users });
  }
);

// =============================
// Get user by ID
// =============================
export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("Invalid user ID", 400);

    const user = await UserService.getUserById(id);
    res.status(200).json({ success: true, message: "User retrieved", data: user });
  }
);

// =============================
// Get users by filter (role/status)
// =============================
export const getUsersByFilterController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const { role, status } = req.query;
    const filter: any = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await UserService.getUsersByFilter(filter);
    res.status(200).json({ success: true, message: "Filtered users retrieved", data: users });
  }
);

// =============================
// Update user
// =============================
export const updateUserController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("Invalid user ID", 400);

    const updatedUser = await UserService.updateUser(id, req.body);
    res.status(200).json({ success: true, message: "User updated", data: updatedUser });
  }
);

// =============================
// Delete user
// =============================
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError("Invalid user ID", 400);

    const deletedUser = await UserService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted", data: deletedUser });
  }
);
