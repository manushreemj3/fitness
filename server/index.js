import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workout.js";
import chatRoutes from "./routes/chat.js";
import foodRoutes from "./routes/food.js";
import cycleRoutes from "./routes/cycle.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cycle", cycleRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
