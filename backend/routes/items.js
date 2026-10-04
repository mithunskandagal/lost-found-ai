import express from "express";
import multer from "multer";
import path from "path";
import Item from "../models/Item.js";
import { protect } from "../middleware/auth.js";
import { analyzeItem, rankMatches } from "../utils/ai.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  }
});

router.get("/", async (req, res) => {
  try {
    const { type, category, search, status = "active" } = req.query;
    const filter = { status };
    if (type && ["lost", "found"].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const items = await Item.find(filter)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("reportedBy", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { type, title, description, category, color, brand, location, date } = req.body;

    if (!type || !title || !description || !location || !date) {
      return res.status(400).json({
        message: "type, title, description, location and date are required"
      });
    }

    const item = await Item.create({
      type,
      title,
      description,
      category,
      color,
      brand,
      location,
      date,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      reportedBy: req.user._id
    });

    const ai = await analyzeItem(item, req.file?.path);
    item.category = ai.category;
    item.aiTags = ai.tags;
    item.aiSummary = ai.summary;
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/claim", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.reportedBy) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot claim your own report" });
    }

    item.claims.push({
      user: req.user._id,
      message: req.body.message || "I believe this item belongs to me."
    });

    await item.save();
    res.json({ message: "Claim submitted", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/matches", protect, async (req, res) => {
  try {
    const target = await Item.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "Item not found" });

    const opposite = target.type === "lost" ? "found" : "lost";
    const candidates = await Item.find({
      type: opposite,
      status: "active",
      _id: { $ne: target._id }
    }).sort({ createdAt: -1 }).limit(50);

    const ranking = await rankMatches(target.toObject(), candidates);

    const ids = ranking.map((x) => String(x.itemId));
    const byId = new Map(candidates.map((x) => [String(x._id), x]));

    const results = ranking
      .filter((x) => byId.has(String(x.itemId)))
      .sort((a, b) => b.score - a.score)
      .map((x) => ({
        ...byId.get(String(x.itemId)).toObject(),
        matchScore: x.score,
        matchReason: x.reason
      }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
