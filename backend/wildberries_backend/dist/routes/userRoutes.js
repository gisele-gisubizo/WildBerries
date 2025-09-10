"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Ensure uploads folder exists
const uploadDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// Multer config
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = (0, multer_1.default)({ storage });
// ✅ Register seller with specific fields
const uploadFields = upload.fields([
    { name: "idCopy", maxCount: 1 },
    { name: "licenseDoc", maxCount: 1 },
]);
// --- Public routes (no token required) ---
router.post("/register-seller", uploadFields, userController_1.registerSellerController);
router.post("/register", userController_1.registerCustomerController);
router.post("/verify-otp", userController_1.verifyOtpController);
router.post("/login", userController_1.loginController);
// --- Protected routes (token required) ---
router.use(authMiddleware_1.authMiddleware);
// Admin routes
router.put("/sellers/:id/approve", userController_1.approveSellerController);
router.put("/sellers/:id/reject", userController_1.rejectSellerController);
// Seller management
router.get("/sellers/pending", userController_1.getPendingSellersController);
router.get("/sellers/approved", userController_1.getApprovedSellersController);
router.get("/sellers/rejected", userController_1.getRejectedSellersController);
// User management
router.get("/", userController_1.getAllUsersController);
router.get("/:id", userController_1.getUserByIdController);
router.delete("/:id", userController_1.deleteUserController);
router.put("/me", userController_1.updateOwnAccountController);
router.delete("/me", userController_1.deleteOwnAccountController);
exports.default = router;
