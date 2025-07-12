import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    profilePhoto: { type: String },// Optional field for profile photo
    skillsOffered: [{ type: String }],
    skillsWanted: [{ type: String }],
    availability: { type: String },
    isPublic: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
