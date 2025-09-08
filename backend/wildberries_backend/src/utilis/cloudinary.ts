import { v2 as cloudinary } from "cloudinary";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// Use require for CloudinaryStorage
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "your-cloud-name",
  api_key: process.env.CLOUDINARY_API_KEY || "your-api-key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "your-api-secret",
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "book_covers",
    public_id: `${Date.now()}-${file.originalname}`,
    transformation: [{ width: 600, height: 800, crop: "limit" }],
    resource_type: "image",
  }),
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

// Multer upload
const upload = multer({ storage, fileFilter });

export { cloudinary, upload };
