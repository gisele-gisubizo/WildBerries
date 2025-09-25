"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_1 = require("./entities/user");
const category_1 = require("./entities/category");
const product_1 = require("./entities/product");
const order_1 = require("./entities/order");
const review_1 = require("./entities/review");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "wildberries",
    synchronize: true,
    logging: false,
    entities: [user_1.User, category_1.Category, product_1.Product, order_1.Order, review_1.Review],
});
