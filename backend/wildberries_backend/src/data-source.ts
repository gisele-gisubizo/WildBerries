import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entities/user";
import { Category } from "./entities/category";
import { Product } from "./entities/product";
import { Order } from "./entities/order";
import { Review } from "./entities/review";
import { Cart } from "./entities/cart";
import { CartItem } from "./entities/cartItem";
import { OrderItem } from "./entities/orderItem";

// Load environment variables from .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || "", // must be a string
  database: process.env.DB_NAME,
  synchronize: false, // always false in production
  logging: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false } // required for Aiven
      : false,
  entities: [User, Category, Product, Order, OrderItem, Review, Cart, CartItem],
  migrations: ["src/migrations/*.ts"],
});
