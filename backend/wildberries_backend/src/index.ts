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

import { setupSwagger } from "./swagger";
import job from "./utilis/cron";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "production") job.start(); // Start cron job only in production
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Hello TypeScript + Postgres 🚀");
});

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Error handler (must be AFTER all routes)
app.use(errorHandler);

setupSwagger(app);

const { createServer } = require("http");
const httpServer = createServer(app);

// Initialize DB and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✅");
    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
    httpServer.listen(PORT, () => {
      console.log("====================================");
      console.log("    Starting server... 🚀");
      console.log("====================================");
      if (process.env.NODE_ENV === "production") {  
        console.log("Server running on https://wildberries-gtwe.onrender.com");
      } else {
        console.log(`Server running on http://localhost:${PORT}`);
      }
    });
  })
  .catch((err) => console.error("DB Error: ", err));
