import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import FoodLog from "../models/FoodLog.js";
import Hydration from "../models/Hydration.js";

const router = Router();
router.use(requireAuth);

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

router.get("/logs", async (req, res) => {
  res.json(await FoodLog.find({ userId: req.userId, date: today() }).sort({ createdAt: -1 }));
});

router.post("/logs", async (req, res) => {
  const allowed = ["name", "calories", "protein", "carbohydrates", "fat", "imageName"];
  const payload = Object.fromEntries(
    allowed.filter((key) => Object.prototype.hasOwnProperty.call(req.body || {}, key))
      .map((key) => [key, req.body[key]])
  );
  res.status(201).json(await FoodLog.create({ ...payload, userId: req.userId, date: today() }));
});

router.get("/hydration", async (req, res) => {
  const doc = await Hydration.findOneAndUpdate(
    { userId: req.userId, date: today() },
    { $setOnInsert: { glasses: 0, goal: 8 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(doc);
});

router.post("/hydration/add", async (req, res) => {
  const doc = await Hydration.findOneAndUpdate(
    { userId: req.userId, date: today() },
    { $inc: { glasses: 1 }, $setOnInsert: { goal: 8 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (doc.glasses > doc.goal) {
    doc.glasses = doc.goal;
    await doc.save();
  }
  res.json(doc);
});

export default router;
