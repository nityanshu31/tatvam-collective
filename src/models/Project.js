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
    enum: ['Residential', 'Commercial', 'Hospitality', 'Interior', 'Industrial'],
    default: 'Residential'
  },
  category: {
    type: String,
    enum: ['Contemporary', 'Modern', 'Minimalist', 'Traditional', 'Industrial'],
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

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);