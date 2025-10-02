// src/routes/userRoutes.ts
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
  loginController,
  getPendingSellersController,
  getApprovedSellersController,
  resendOtpController,
  getRejectedSellersController,
} from "../controllers/userController";
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User and seller authentication & management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "StrongPass123"
 *     SellerRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - shopName
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Smith"
 *         email:
 *           type: string
 *           example: "seller@example.com"
 *         password:
 *           type: string
 *           example: "SellerPass123"
 *         shopName:
 *           type: string
 *           example: "Jane’s Electronics"
 *         idCopy:
 *           type: string
 *           format: binary
 *         licenseDoc:
 *           type: string
 *           format: binary
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "StrongPass123"
 *     OtpVerify:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         otp:
 *           type: string
 *           example: "123456"
 */

/**
 * @swagger
 * /users/register-seller:
 *   post:
 *     summary: Register as a seller
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SellerRegister'
 *     responses:
 *       201:
 *         description: Seller registered successfully (pending approval)
 *       400:
 *         description: Invalid data
 */
router.post("/register-seller", uploadFields, registerSellerController);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register as a customer
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerRegister'
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Invalid data
 */
router.post("/register", registerCustomerController);

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerify'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or expired
 */
router.post("/verify-otp", verifyOtpController);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login as a user (customer or seller)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful (returns JWT token)
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginController);

// --- Protected routes ---
router.use(authMiddleware);

/**
 * @swagger
 * /users/sellers/{id}/approve:
 *   put:
 *     summary: Approve a seller (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller approved
 *       404:
 *         description: Seller not found
 */
router.put("/sellers/:id/approve", approveSellerController);

/**
 * @swagger
 * /users/sellers/{id}/reject:
 *   put:
 *     summary: Reject a seller (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller rejected
 *       404:
 *         description: Seller not found
 */
router.put("/sellers/:id/reject", rejectSellerController);

/**
 * @swagger
 * /users/sellers/pending:
 *   get:
 *     summary: Get all pending sellers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending sellers
 */
router.get("/sellers/pending", getPendingSellersController);

/**
 * @swagger
 * /users/sellers/approved:
 *   get:
 *     summary: Get all approved sellers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved sellers
 */
router.get("/sellers/approved", getApprovedSellersController);

/**
 * @swagger
 * /users/sellers/rejected:
 *   get:
 *     summary: Get all rejected sellers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rejected sellers
 */
router.get("/sellers/rejected", getRejectedSellersController);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get("/", getAllUsersController);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", getUserByIdController);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUserController);

export default router;
