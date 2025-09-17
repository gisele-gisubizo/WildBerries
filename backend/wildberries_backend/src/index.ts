                                                                                                                                                                                                                                                      import { AppDataSource } from "./data-source";
import "reflect-metadata";
import express from "express";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Hello TypeScript + Postgres 🚀");
});

// ❌ Add errorHandler AFTER all routes
app.use(errorHandler);

// Initialize DB and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("DB Error: ", err));
