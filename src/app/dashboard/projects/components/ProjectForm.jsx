// app/dashboard/projects/components/ProjectForm.jsx
"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";
import { uploadImage } from "../utils/uploadUtils";

export default function ProjectForm({ project, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    location: project?.location || "",
    year: project?.year || "",
    area: project?.area || "",
    type: project?.type || "Residential",
    category: project?.category || "Contemporary",
    status: project?.status || "Completed",
    description: project?.description || "",
    featured: project?.featured || false,
    order: project?.order || 0,
    image: project?.image || "",
    imagePublicId: project?.imagePublicId || "",
    gallery: project?.gallery || [],
    galleryPublicIds: project?.galleryPublicIds || []
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(project?.image || "");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState(project?.gallery || []);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (file, preview) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleGalleryChange = (files, previews) => {
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
      galleryPublicIds: prev.galleryPublicIds?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setUploading(true);

      // Validation
      if (!formData.title || !formData.location || !formData.description) {
        throw new Error("Please fill in all required fields");
      }

      if (!project && !imageFile) {
        throw new Error("Please select a main image");
      }

      let mainImageUrl = formData.image;
      let mainImagePublicId = formData.imagePublicId;
      let galleryUrls = [...formData.gallery];
      let galleryPublicIds = [...formData.galleryPublicIds];

      // Upload main image
      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        mainImageUrl = uploaded.url;
        mainImagePublicId = uploaded.publicId;
      }

      // Upload gallery images
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const uploaded = await uploadImage(file);
          galleryUrls.push(uploaded.url);
          galleryPublicIds.push(uploaded.publicId);
        }
      }

      const projectData = {
        ...formData,
        image: mainImageUrl,
        imagePublicId: mainImagePublicId,
        gallery: galleryUrls,
        galleryPublicIds: galleryPublicIds
      };

      const url = project 
        ? `/api/projects/${project._id}`
        : '/api/projects';
      
      const method = project ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save project");
      }

      alert(project ? "Project updated successfully!" : "Project created successfully!");
      onSuccess();
    } catch (error) {
      console.error('Save error:', error);
      alert(error.message || "Failed to save project");
    } finally {
      setUploading(false);
    }
  };

  // Prevent clicks inside modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl m-4"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex justify-between items-center rounded-t-2xl">
          <h3 className="text-xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter project title"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="City, Country"
                  required
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="2024"
                  required
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="650 m²"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Interior">Interior</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Contemporary">Contemporary</option>
                  <option value="Modern">Modern</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured Project</span>
                </label>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Enter project description..."
                  required
                />
              </div>

              {/* Main Image Uploader */}
              <div className="sm:col-span-2">
                <ImageUploader
                  currentImage={imagePreview}
                  onImageChange={handleImageChange}
                  required={!project}
                />
              </div>

              {/* Gallery Uploader */}
              <div className="sm:col-span-2">
                <GalleryUploader
                  images={galleryPreviews}
                  onImagesChange={handleGalleryChange}
                  onRemoveImage={handleRemoveGalleryImage}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                project ? 'Update Project' : 'Create Project'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}