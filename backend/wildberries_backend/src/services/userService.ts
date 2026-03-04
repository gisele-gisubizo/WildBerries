// src/services/userService.ts
import { AppDataSource } from "../data-source";
import { AppError } from "../utilis/errors";
import { generateOTP } from "../utilis/otp";
import { sendEmail } from "../utilis/nodemailer";
import { Users, UserRole } from "../entities/user";
import { Category } from  "../entities/category"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userRepo = AppDataSource.getRepository(Users);
const categoryRepo = AppDataSource.getRepository(Category);
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

  // Temporarily allow multiple admins for testing
  // if (role === "admin") {
  //   const existingAdmin = await userRepo.findOneBy({ role: "admin" });
  //   if (existingAdmin) throw new AppError("Admin already exists", 400);
  // }

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

const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
      <h2 style="color: #6B2C91; text-align: center;">WildBerries Company</h2>
      <p style="font-size: 16px;">Hello dear <strong>${user.name || user.email}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6;">
        Thank you for registering with <strong>WildBerries Company</strong>. 
        To complete your verification, please use the One-Time Password (OTP) below:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="background-color: #6B2C91; color: white; padding: 12px 24px; border-radius: 6px; font-size: 20px; letter-spacing: 2px; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555;">
        This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone for your security.
      </p>
      <p style="margin-top: 25px; font-size: 14px; color: #777;">Kind regards,<br>
        <strong>WildBerries Support Team</strong><br>
        <a href="https://wildberries.com" style="color: #6B2C91; text-decoration: none;">www.wildberries.com</a>
      </p>
    </div>
  </div>
`;

await sendEmail(
  email,
  "Your WildBerries OTP Verification Code",
  htmlMessage
);

return user;

};

// =============================
// Register Seller
// =============================
export const registerSeller = async (
  name: string,
  email: string,
  phone: string,
  password: string,
  idCopy: string,
  licenseDoc: string,
  // category: string,
  address: string
) => {
  const existingEmail = await userRepo.findOneBy({ email });
  if (existingEmail) throw new AppError("Email is already registered", 400);

  const existingPhone = await userRepo.findOneBy({ phone });
  if (existingPhone) throw new AppError("Phone number is already registered", 400);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const otp = generateOTP();

  const seller = userRepo.create({
    name,
    email,
    phone,
    password: hashedPassword,
    otp,
    idCopy,
    licenseDoc,
    // category,
    address,
    role: "seller",
    isVerified: false,
    status: "pending",
  });

await userRepo.save(seller);

const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
      <h2 style="color: #6B2C91; text-align: center;">WildBerries Company</h2>
      <p style="font-size: 16px;">Hello dear <strong>${seller.name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6;">
        Thank you for registering with <strong>WildBerries Company</strong>. 
        To complete your verification, please use the One-Time Password (OTP) below:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="background-color: #6B2C91; color: white; padding: 12px 24px; border-radius: 6px; font-size: 20px; letter-spacing: 2px; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555;">
        This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone for your security.
      </p>
      <p style="margin-top: 25px; font-size: 14px; color: #777;">Kind regards,<br>
        <strong>WildBerries Support Team</strong><br>
        <a href="https://wildberries.com" style="color: #6B2C91; text-decoration: none;">www.wildberries.com</a>
      </p>
    </div>
  </div>
`;

await sendEmail(
  email,
  "Your WildBerries OTP Verification Code",
  htmlMessage
);

return seller;

};

// =============================
// Verify OTP
// =============================
export const verifyOTP = async (email: string, otp: string) => {
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new AppError("User not found", 404);

  // Compare with the real generated OTP
  if (user.otp !== otp) throw new AppError("Invalid OTP", 400);

  user.isVerified = true;
  user.otp = null;
  await userRepo.save(user);

  return user;
};


// =============================
// Resend OTP
// =============================
export const resendOTP = async (email: string) => {
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new AppError("User not found", 404);

  if (user.isVerified) {
    throw new AppError("User is already verified", 400);
  }

  const newOtp = generateOTP();
  user.otp = newOtp;
  await userRepo.save(user);

const htmlMessage = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
      <h2 style="color: #6B2C91; text-align: center;">WildBerries Company</h2>
      <p style="font-size: 16px;">Hello dear <strong>${user.name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6;">
        You requested a new One-Time Password (OTP) from <strong>WildBerries Company</strong>. 
        Please use the code below to complete your verification:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="background-color: #6B2C91; color: white; padding: 12px 24px; border-radius: 6px; font-size: 20px; letter-spacing: 2px; display: inline-block;">
          ${newOtp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555;">
        This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone for your account’s safety.
      </p>
      <p style="margin-top: 25px; font-size: 14px; color: #777;">Kind regards,<br>
        <strong>WildBerries Support Team</strong><br>
        <a href="https://wildberries.com" style="color: #6B2C91; text-decoration: none;">www.wildberries.com</a>
      </p>
    </div>
  </div>
`;

await sendEmail(
  email,
  "Your New WildBerries OTP Verification Code",
  htmlMessage
);

return { message: "A new OTP has been sent to your email" };

};


// =============================
// Login
// =============================
export const loginUser = async (phone: string, password: string) => {
  const user = await userRepo.findOneBy({ phone });
  if (!user) throw new AppError("Phone number not found", 404);

  const isMatch = user ? await bcrypt.compare(password, user.password) : false;
  if (!isMatch) throw new AppError("Incorrect password", 401);

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
  sellerId: Number,
  status: "approved" | "rejected"
) => {
  const id = Number(sellerId); // convert string to number
  const seller = await userRepo.findOneBy({ id });
  if (!seller) throw new AppError("Seller not found", 404);

  if (seller.role !== "seller") throw new AppError("User is not a seller", 400);

  if (seller.status !== "pending") throw new AppError("Seller has already been reviewed", 400);

  seller.status = status;
  await userRepo.save(seller);

await userRepo.save(seller);

let subject, htmlMessage;

if (status === "approved") {
  subject = "Seller Account Approved - WildBerries Company";
  htmlMessage = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
        <h2 style="color: #6B2C91; text-align: center;">WildBerries Company</h2>
        <p style="font-size: 16px;">Hello dear <strong>${seller.name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #333;">
          🎉 Congratulations! We’re pleased to inform you that your <strong>seller account</strong> has been
          <span style="color: #28A745; font-weight: bold;">approved</span>.
        </p>
        <p style="font-size: 15px; color: #555;">
          You can now log in to your WildBerries Seller Dashboard and start managing your products.
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://wildberries.com/seller-dashboard" style="background-color: #6B2C91; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
        </div>
        <p style="font-size: 14px; color: #777;">Best regards,<br>
          <strong>WildBerries Support Team</strong><br>
          <a href="https://wildberries.com" style="color: #6B2C91; text-decoration: none;">www.wildberries.com</a>
        </p>
      </div>
    </div>
  `;
} else {
  subject = "Seller Account Rejection - WildBerries Company";
  htmlMessage = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
        <h2 style="color: #6B2C91; text-align: center;">WildBerries Company</h2>
        <p style="font-size: 16px;">Hello dear <strong>${seller.name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #333;">
          We appreciate your interest in becoming a <strong>seller</strong> with <strong>WildBerries Company</strong>. 
          Unfortunately, your account has been <span style="color: #E53935; font-weight: bold;">rejected</span> at this time.
        </p>
        <p style="font-size: 15px; color: #555;">
          You are welcome to review your submission and reapply once you’ve made the necessary improvements.
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 25px;">Kind regards,<br>
          <strong>WildBerries Support Team</strong><br>
          <a href="https://wildberries.com" style="color: #6B2C91; text-decoration: none;">www.wildberries.com</a>
        </p>
      </div>
    </div>
  `;
}

await sendEmail(seller.email, subject, htmlMessage);

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
export const generateToken = (user: Users) => {
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



// =============================
// Get all users
// =============================
export const getAllUsers = async () => {
  return userRepo.find();
};

// =============================
// Get user by ID
// =============================
export const getUserById = async (id: number) => {
  const user = await userRepo.findOneBy({ id });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// =============================
// Get users by filter (role, status)
// =============================
interface UserFilter {
  role?: UserRole;
  status?: "pending" | "approved" | "rejected";
}
export const getUsersByFilter = async (filter: UserFilter) => {
  return userRepo.find({ where: filter });
};

// =============================
// Update user
// =============================
export const updateUser = async (id: number, data: Partial<Users>) => {
  const user = await userRepo.findOneBy({ id });
  if (!user) throw new AppError("User not found", 404);

  Object.assign(user, data);
  await userRepo.save(user);
  return user;
};

// =============================
// Delete user
// =============================
export const deleteUser = async (id: number) => {
  const user = await userRepo.findOneBy({ id });
  if (!user) throw new AppError("User not found", 404);

  await userRepo.remove(user);
  return user;
};




// =============================
// Get all sellers (regardless of status)
// =============================
export const getAllSellers = async () => {
  return userRepo.find({
    where: { role: "seller" },
  });
};


// =============================
// Count all users by role or status
// =============================
export const countSellers = async () => {
  return userRepo.count({ where: { role: "seller" } });
};

export const countCustomers = async () => {
  return userRepo.count({ where: { role: "customer" } });
};

export const countPendingSellers = async () => {
  return userRepo.count({ where: { role: "seller", status: "pending" } });
};

export const countApprovedSellers = async () => {
  return userRepo.count({ where: { role: "seller", status: "approved" } });
};

export const countRejectedSellers = async () => {
  return userRepo.count({ where: { role: "seller", status: "rejected" } });
};

// Optional: overall summary
export const getUserStats = async () => {
  const sellers = await countSellers();
  const customers = await countCustomers();
  const pending = await countPendingSellers();
  const approved = await countApprovedSellers();
  const rejected = await countRejectedSellers();

  return {
    totalSellers: sellers,
    totalCustomers: customers,
    pendingSellers: pending,
    approvedSellers: approved,
    rejectedSellers: rejected,
  };
};





// =============================
// Update user status (approve/reject) - admin only
// =============================


export const updateUserStatus = async (
  adminId: number, 
  userId: number,
  status: "approved" | "rejected"
) => {
  // Optional: you can verify that adminId belongs to an admin user
  const admin = await userRepo.findOneBy({ id: adminId });
  if (!admin || admin.role !== "admin") throw new AppError("Only admins can update user status", 403);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("User not found", 404);

  // Only allow changing status if it’s different
  if (user.status === status) throw new AppError(`User is already ${status}`, 400);

  user.status = status;
  await userRepo.save(user);

  // Optionally, notify user by email
  const subject = status === "approved" ? "Account Approved" : "Account Rejected";
  const message =
    status === "approved"
      ? "Congratulations! Your account has been approved."
      : "Sorry, your account has been rejected.";

  await sendEmail(user.email, subject, message);

  return user;
};



export const updateOwnProfile = async (userId: number, data: Partial<User>): Promise<User> => {
  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new AppError("User not found", 404);

  // Only allow updating safe fields
  const updatableFields: (keyof User)[] = ["email", "phone", "name", "address"];

  updatableFields.forEach((field) => {
    if (data[field] !== undefined) {
      // ✅ Cast user to any to bypass TypeScript complaint
      (user as any)[field] = data[field];
    }
  });

  await userRepo.save(user);
  return user;
};