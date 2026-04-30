// models/Section.js (Simplified version without pre-save middleware)
import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["notification", "hiring", "promotion", "dashboard", "default"],
    default: "default"
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium"
  },
  defaultVisible: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  badges: [String],
  cta: {
    text: { type: String, default: "" },
    link: { type: String, default: "" },
    openInNewTab: { type: Boolean, default: false }
  },
  media: {
    type: {
      type: String,
      enum: ["carousel", "image", "video", "none"],
      default: "none"
    },
    images: [{
      url: String,
      alt: String,
      order: Number,
      publicId: String
    }],
    videoUrl: { type: String, default: "" },
    autoplay: { type: Boolean, default: false },
    interval: { type: Number, default: 3000 }
  },
  stats: {
    type: Map,
    of: String,
    default: {}
  },
  expandable: {
    type: Boolean,
    default: false
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  accentColor: {
    type: String,
    default: "var(--accent)"
  },
  backgroundColor: {
    type: String,
    default: "var(--white)"
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: "admin"
  }
}, {
  timestamps: true // This handles createdAt and updatedAt automatically
});

// Export the model
const Section = mongoose.models.Section || mongoose.model("Section", SectionSchema);
export default Section;