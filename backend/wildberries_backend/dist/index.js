"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/users", userRoutes_1.default);
// Health check
app.get("/", (req, res) => {
    res.send("Hello TypeScript + Postgres 🚀");
});
// ❌ Add errorHandler AFTER all routes
app.use(errorHandler_1.errorHandler);
// Initialize DB and start server
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected ✅");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => console.error("DB Error: ", err));
