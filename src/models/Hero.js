import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    imageUrl: String,
    imagePublicId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);