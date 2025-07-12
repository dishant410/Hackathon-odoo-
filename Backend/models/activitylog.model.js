import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true }, // e.g., "swap_created", "user_banned"
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: String }, // optional description
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
