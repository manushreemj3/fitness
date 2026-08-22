import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  planId: String,
  dayId: String,
  exercises: [{ id: String, name: String, sets: Number, reps: Number, rest: String }],
  progress: {
    exercises: { type: Map, of: Boolean, default: {} },
    completed: { type: Boolean, default: false },
  },
}, { timestamps: true });

export default mongoose.model("Workout", workoutSchema);
