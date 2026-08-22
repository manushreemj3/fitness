import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String, // "YYYY-MM-DD"
  calories: Number,
  protein: Number,
  carbohydrates: Number,
  fat: Number,
  imageName: String,
}, { timestamps: true });

export default mongoose.model("FoodLog", foodLogSchema);
