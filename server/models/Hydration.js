// FoodLog.js — same as before, already covered

// Hydration.js
import mongoose from "mongoose";

const hydrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String, // "YYYY-MM-DD"
  glasses: { type: Number, default: 0 },
  goal: { type: Number, default: 8 },
});

export default mongoose.model("Hydration", hydrationSchema);
