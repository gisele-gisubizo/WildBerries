// src/controllers/orderController.ts
import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import asyncHandler from "express-async-handler";

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId; // ✅ from auth middleware
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const order = await orderService.checkout(Number(userId));
  res.status(201).json({ success: true, data: order });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId; // ✅ from auth middleware
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const orders = await orderService.getOrders(Number(userId));
  res.json({ success: true, data: orders });
});
