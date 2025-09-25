import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CartService } from "../services/cartService";

interface AuthRequest extends Request {
  userId?: number; // from authMiddleware
}

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await CartService.getCart(req.userId!);
  res.status(200).json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const cart = await CartService.addToCart(req.userId!, productId, quantity || 1);
  res.status(200).json({ success: true, data: cart });
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await CartService.updateCartItem(req.userId!, Number(productId), quantity);
  res.status(200).json({ success: true, data: cart });
});

export const removeCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const cart = await CartService.removeCartItem(req.userId!, Number(productId));
  res.status(200).json({ success: true, data: cart });
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await CartService.clearCart(req.userId!);
  res.status(200).json({ success: true, data: cart });
});
