import { AppDataSource } from "../data-source";
import { Cart } from "../entities/cart";
import { CartItem } from "../entities/cartItem";
import { Product } from "../entities/product";
import { User } from "../entities/user";
import { AppError } from "../utilis/errors";

const cartRepo = AppDataSource.getRepository(Cart);
const cartItemRepo = AppDataSource.getRepository(CartItem);
const productRepo = AppDataSource.getRepository(Product);
const userRepo = AppDataSource.getRepository(User);

export class CartService {
  static async getOrCreateCart(userId: number) {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    let cart = await cartRepo.findOne({ where: { user: { id: userId } } });
    if (!cart) {
      cart = cartRepo.create({ user, items: [] });
      await cartRepo.save(cart);
    }
    return cart;
  }

  static async addToCart(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);

    let item = cart.items.find((i) => i.product.id === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      item = cartItemRepo.create({ cart, product, quantity });
      cart.items.push(item);
    }

    await cartRepo.save(cart);
    return cart;
  }

  static async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return cart;
  }

  static async updateCartItem(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) throw new AppError("Cart item not found", 404);

    item.quantity = quantity;
    await cartRepo.save(cart);
    return cart;
  }

  static async removeCartItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);
    const itemIndex = cart.items.findIndex((i) => i.product.id === productId);
    if (itemIndex === -1) throw new AppError("Cart item not found", 404);

    cart.items.splice(itemIndex, 1);
    await cartRepo.save(cart);
    return cart;
  }

  static async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    await cartRepo.save(cart);
    return cart;
  }
}
