import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "Other", trim: true },
    color: { type: String, default: "", trim: true },
    brand: { type: String, default: "", trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, default: "" },
    aiTags: [{ type: String }],
    aiSummary: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "claimed", "resolved", "rejected"],
      default: "active"
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    claims: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        createdAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending"
        }
      }
    ]
  },
  { timestamps: true }
);

itemSchema.index({
  title: "text",
  description: "text",
  category: "text",
  brand: "text",
  color: "text",
  location: "text"
});

export default mongoose.model("Item", itemSchema);
