import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workout.js";
import chatRoutes from "./routes/chat.js";
import foodRoutes from "./routes/food.js";
import cycleRoutes from "./routes/cycle.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((value) => value.trim()).filter(Boolean);

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI is not set. The API will not be able to persist data.");
}
if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Authentication endpoints will fail until it is configured.");
}

app.disable("x-powered-by");
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cycle", cycleRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
    }
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
