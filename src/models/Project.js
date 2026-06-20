// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  year: {
    type: String,
    default: () => new Date().getFullYear().toString()
  },
  area: {
    type: String,
    default: 'N/A'
  },
  type: {
    type: String,
    enum: [
    "Residential",
    "Commercial",
    "Institutional",
    "Hospitality",
    "Interior",
    "Industrial",
    "Health Care",
    "PMC / Construction",
    "Furnishing",
    "City and Urban Planning",
    "Design Curated"
  ],
    default: 'Residential'
  },
  category: {
    type: String,
    enum: [
    "Contemporary",
    "Conceptual",
    "Design Curated",
    "Modern",
    "Minimalist",
    "Traditional",
    "Vernacular"
  ],
    default: 'Contemporary'
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Upcoming'],
    default: 'Completed'
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  gallery: {
    type: [String],
    default: []
  },
  galleryPublicIds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Indexes for query performance and sorting
ProjectSchema.index({ order: 1, createdAt: -1 });
ProjectSchema.index({ type: 1 });
ProjectSchema.index({ featured: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);