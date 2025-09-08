// controllers/userController.ts
import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { AppError } from "../utilis/errors";
import { ApiResponse, AuthenticatedRequest } from "../types/common.types";
import { registerCustomerSchema, registerSellerSchema,loginSchema } from "../schemas/user.schemas";
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

    try {
      const user = await UserService.registerCustomer(email, phone, password, role);
      return res.status(201).json({
        success: true,
        message: "Registered successfully. Please verify your email with the OTP sent.",
        data: { id: user.id, email: user.email, phone: user.phone, role: user.role },
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message || "Registration failed",
      });
    }
  }
);

// ========================
// Register Seller (Form-data)
// ========================
interface MulterRequestFields extends Request {
  files?: {
    idCopy?: Express.Multer.File[];
    licenseDoc?: Express.Multer.File[];
  };
}

export const registerSellerController = asyncHandler(
  async (req: MulterRequestFields, res: Response<ApiResponse>) => {
    const { name, email, phone, password } = req.body;

    // Get uploaded files
    const idCopy = req.files?.idCopy?.[0]?.path;
    const licenseDoc = req.files?.licenseDoc?.[0]?.path;

    // Make sure both files are uploaded
    if (!idCopy || !licenseDoc) {
      return res.status(400).json({
        success: false,
        message: "Both ID copy and license document are required.",
      });
    }

    // Validate text input fields
    const parsed = registerSellerSchema.safeParse({
      name,
      email,
      phone,
      password,
      idCopy,
      licenseDoc,
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    // Register seller
    const seller = await UserService.registerSeller(
      name,
      email,
      phone,
      password,
      idCopy,
      licenseDoc
    );

    return res.status(201).json({
      success: true,
      message: "Seller registered successfully. Awaiting admin approval.",
      data: seller,
    });
  }
);


// ========================
// Verify OTP
// ========================
export const verifyOtpController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { email, otp } = req.body;
  const user = await UserService.getUserByEmail(email);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });
  if (user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

  user.isVerified = true;
  user.otp = null;
  await UserService.updateUser(user);

  return res.status(200).json({ success: true, message: "Email verified successfully" });
});



// Login (Customer, Seller, Admin)
// =============================
export const loginController = asyncHandler(async (req: Request, res: Response) => {
  // Validate input using Zod
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    const details = parsed.error.issues.map((e) => ({
      path: e.path,
      message: e.message,
    }));
    throw new AppError("Validation failed", 400, details);
  }

  const { email, password } = parsed.data;

  // Find user by email
  const user = await UserService.findByEmail(email);
  if (!user) throw new AppError("Invalid email or password", 401);

  // Check if email is verified
  if (!user.isVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  // Check if seller is approved
  if (user.role === "seller" && user.status !== "approved") {
    throw new AppError("Your seller account is not approved yet", 403);
  }

  // Check password
  const isPasswordValid = await UserService.comparePassword(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

  // Generate JWT token
  const token = UserService.generateToken(user);

  // Respond with success
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    },
  });
});


// ========================
// Get all users
// ========================
export const getAllUsersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const users = await UserService.getAllUsers();
  return res.status(200).json({ success: true, data: users });
});

// ========================
// Get user by ID
// ========================
export const getUserByIdController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ success: false, message: "Invalid user ID" });

  const user = await UserService.getUserById(userId);
  return res.status(200).json({ success: true, data: user });
});

// ========================
// Delete user (Admin)
// ========================
export const deleteUserController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ success: false, message: "Invalid user ID" });

  const deleted = await UserService.deleteUser(userId);
  return res.status(200).json({ success: true, message: "User deleted successfully", data: deleted });
});

// ========================
// Update own account
// ========================
export const updateOwnAccountController = asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const userId = Number(req.user?.id);
  if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

  const updated = await UserService.updateOwnAccount(userId, req.body);
  return res.status(200).json({ success: true, message: "Account updated successfully", data: updated });
});

// ========================
// Delete own account
// ========================
export const deleteOwnAccountController = asyncHandler(async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  const userId = Number(req.user?.id);
  if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

  await UserService.deleteOwnAccount(userId);
  return res.status(200).json({ success: true, message: "Account deleted successfully" });
});

// ========================
// Approve Seller
// ========================
export const approveSellerController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const sellerId = Number(req.params.id);
    if (isNaN(sellerId)) return res.status(400).json({ success: false, message: "Invalid seller ID" });

    const seller = await UserService.approveSeller(sellerId);
    return res.status(200).json({ success: true, message: "Seller approved successfully", data: seller });
  }
);

// ========================
// Reject Seller
// ========================
export const rejectSellerController = asyncHandler(
  async (req: Request, res: Response<ApiResponse>) => {
    const sellerId = Number(req.params.id);
    const { reason } = req.body;

    if (isNaN(sellerId)) return res.status(400).json({ success: false, message: "Invalid seller ID" });

    const seller = await UserService.rejectSeller(sellerId, reason);
    return res.status(200).json({ success: true, message: "Seller rejected successfully", data: seller });
  }
);


// Pending sellers
export const getPendingSellersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellers = await UserService.getPendingSellers();
  res.status(200).json({
    success: true,
    message: "Pending sellers retrieved successfully",
    data: sellers,
  });
});

// Approved sellers
export const getApprovedSellersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellers = await UserService.getApprovedSellers();
  res.status(200).json({
    success: true,
    message: "Approved sellers retrieved successfully",
    data: sellers,
  });
});

// Rejected sellers
export const getRejectedSellersController = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const sellers = await UserService.getRejectedSellers();
  res.status(200).json({
    success: true,
    message: "Rejected sellers retrieved successfully",
    data: sellers,
  });
});
