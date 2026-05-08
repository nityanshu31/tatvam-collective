// models/Blog.js

import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  heading: String,
  content: String,
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    images: [String],

    sections: [sectionSchema],
  },
  {
    timestamps: true,
  }
);

const Blog =
  mongoose.models.Blog ||
  mongoose.model("Blog", blogSchema);

export default Blog;