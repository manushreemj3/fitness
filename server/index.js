import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI); // Atlas connection string
app.use("/api/workout", workoutRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cycle", cycleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

app.listen(process.env.PORT || 4000);
