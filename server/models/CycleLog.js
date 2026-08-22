import mongoose from "mongoose";

const cycleLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastPeriodStart: String,
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
});

export default mongoose.model("CycleLog", cycleLogSchema);
