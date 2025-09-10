// src/middleware/upload.ts
import multer from "multer";

// ✅ Use memory storage instead of disk storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: limit file size to 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Optional: allow only image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});
