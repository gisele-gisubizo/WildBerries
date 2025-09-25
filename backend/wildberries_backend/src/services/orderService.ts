// src/services/orderService.ts
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/cart";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/orderItem";

export const orderService = {
  async checkout(userId: number) {
    const cartRepo = AppDataSource.getRepository(Cart);
    const orderRepo = AppDataSource.getRepository(Order);

    // 1. Get user’s cart with items
    const cart = await cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product", "user"],
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // 3. Create order
    const order = orderRepo.create({
      user: cart.user,
      totalAmount,
      status: "pending",
      items: cart.items.map((cartItem) => {
        const orderItem = new OrderItem();
        orderItem.product = cartItem.product;
        orderItem.quantity = cartItem.quantity;
        orderItem.price = cartItem.product.price;
        return orderItem;
      }),
    });

    await orderRepo.save(order);

    // 4. Clear cart after checkout
    cart.items = [];
    await cartRepo.save(cart);

    return order;
  },

  async getOrders(userId: number) {
    const orderRepo = AppDataSource.getRepository(Order);
    return orderRepo.find({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
  },
};
