import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import FoodLog from "../models/FoodLog.js";
import Hydration from "../models/Hydration.js";

const router = Router();
router.use(requireAuth);
const today = () => new Date().toISOString().slice(0, 10);

router.get("/logs", async (req, res) => {
  res.json(await FoodLog.find({ userId: req.userId, date: today() }));
});

router.post("/logs", async (req, res) => {
  res.json(await FoodLog.create({ ...req.body, userId: req.userId, date: today() }));
});

router.get("/hydration", async (req, res) => {
  const doc = await Hydration.findOneAndUpdate(
    { userId: req.userId, date: today() },
    { $setOnInsert: { glasses: 0, goal: 8 } },
    { upsert: true, new: true }
  );
  res.json(doc);
});

router.post("/hydration/add", async (req, res) => {
  const doc = await Hydration.findOneAndUpdate(
    { userId: req.userId, date: today() },
    [{ $set: { glasses: { $min: ["$goal", { $add: ["$glasses", 1] }] } } }],
    { upsert: true, new: true }
  );
  res.json(doc);
});

export default router;
