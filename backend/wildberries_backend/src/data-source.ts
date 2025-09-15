import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { Category } from "./entities/category";
import { Product } from "./entities/product";
import { Order } from "./entities/order";
import { Review } from "./entities/review";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "wildberries",
  synchronize: false,
  logging: false,
  entities: [User, Category, Product, Order, Review],
});
