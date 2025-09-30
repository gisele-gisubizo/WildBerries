import { AppDataSource } from "./data-source";
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes"; 
import orderRoutes from "./routes/orderRoutes";
import { errorHandler } from "./middlewares/errorHandler";

import {setupSwagger} from "./swagger"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes); 
app.use("/orders",orderRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Hello TypeScript + Postgres 🚀");
});

// Error handler (must be AFTER all routes)
app.use(errorHandler);

setupSwagger(app);

// Initialize DB and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("DB Error: ", err));
 