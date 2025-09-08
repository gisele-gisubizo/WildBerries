import { Router } from "express";
import multer from "multer";
import {
  registerSellerController,
  approveSellerController,
  rejectSellerController,
  registerCustomerController,
  verifyOtpController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  updateOwnAccountController,
  deleteOwnAccountController,
  loginController,
  getPendingSellersController,
  getApprovedSellersController,
  getRejectedSellersController} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import fs from "fs";
import path from "path";

const router = Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Register seller with specific fields
const uploadFields = upload.fields([
  { name: "idCopy", maxCount: 1 },
  { name: "licenseDoc", maxCount: 1 },
]);

// --- Public routes (no token required) ---
router.post("/register-seller", uploadFields, registerSellerController);
router.post("/register", registerCustomerController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginController);

// --- Protected routes (token required) ---
router.use(authMiddleware);

// Admin routes
router.put("/sellers/:id/approve", approveSellerController);
router.put("/sellers/:id/reject", rejectSellerController);

// Seller management
router.get("/sellers/pending", getPendingSellersController);
router.get("/sellers/approved", getApprovedSellersController);
router.get("/sellers/rejected", getRejectedSellersController);

// User management
router.get("/", getAllUsersController);
router.get("/:id", getUserByIdController);
router.delete("/:id", deleteUserController);
router.put("/me", updateOwnAccountController);
router.delete("/me", deleteOwnAccountController);

export default router;
