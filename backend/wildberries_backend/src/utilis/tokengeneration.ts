import jwt from "jsonwebtoken";

export function generateToken(userId: number, role: string): string {
  const secret = process.env.JWT_SECRET || "secret123"; 

  return jwt.sign(
    { userId, role },   
    secret,
    { expiresIn: "7d" } 
  );
}
