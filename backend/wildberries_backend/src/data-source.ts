import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { Category } from "./entities/category";
import { Product } from "./entities/product";
import { Order } from "./entities/order";
import { Review } from "./entities/review";
import { Cart } from "./entities/cart";
import { CartItem } from "./entities/cartItem";
import { OrderItem } from "./entities/orderItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "982006hy",
  database: "wildberries",
  synchronize: true, // ⚠️ keep true for dev, false for prod
  logging: false,
  entities: [User, Category, Product, Order,OrderItem, Review, Cart, CartItem],
});
