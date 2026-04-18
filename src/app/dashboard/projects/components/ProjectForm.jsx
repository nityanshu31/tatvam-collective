// app/dashboard/projects/components/ProjectForm.jsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";
import { uploadImage } from "../utils/uploadUtils";

// Custom Yup transformer for area with m²
const areaWithUnit = yup
  .string()
  .required("Area is required")
  .test("valid-area", "Please enter a valid number", (value) => {
    if (!value) return false;
    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return !isNaN(numericValue) && numericValue > 0 && numericValue <= 1000000;
  })
  .transform((value, originalValue) => {
    // When getting from form, ensure it has m²
    if (originalValue && !String(originalValue).includes('m²')) {
      const num = parseFloat(originalValue);
      return isNaN(num) ? originalValue : `${num} m²`;
    }
    return originalValue;
  });

// Validation schema
const projectSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  
  location: yup
    .string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .trim(),
  
  year: yup
    .number()
    .typeError("Please select a valid year")
    .required("Year is required")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), `Year cannot be later than ${new Date().getFullYear()}`),
  
  area: areaWithUnit,
  
  type: yup
    .string()
    .default("Residential"),
  
  category: yup
    .string()
    .default("Contemporary"),
  
  status: yup
    .string()
    .default("Completed"),
  
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),
  
  order: yup
    .number()
    .typeError("Order must be a number")
    .min(0, "Order must be 0 or greater")
    .default(0),
  
  featured: yup
    .boolean()
    .default(false)
});

export default function ProjectForm({ project, onClose, onSuccess }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(project?.image || "");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState(project?.gallery || []);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Helper function to extract numeric value from area string
  const extractAreaNumber = (areaValue) => {
    if (!areaValue) return "";
    // Convert to string if it's a number
    const areaString = String(areaValue);
    const match = areaString.match(/^([\d.]+)/);
    return match ? match[1] : "";
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      location: project?.location || "",
      year: project?.year ? parseInt(project.year) : "",
      area: project?.area ? String(project.area) : "",
      type: project?.type || "Residential",
      category: project?.category || "Contemporary",
      status: project?.status || "Completed",
      description: project?.description || "",
      featured: project?.featured || false,
      order: project?.order || 0
    }
  });

  // Watch description length for character count
  const descriptionValue = watch("description", "");
  const descriptionLength = descriptionValue?.length || 0;

  // Generate year options from 1900 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const handleImageChange = (file, preview) => {
    setImageFile(file);
    setImagePreview(preview);
    setImageError("");
  };

  const handleGalleryChange = (files, previews) => {
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      // Validate main image for new projects
      if (!project && !imageFile) {
        setImageError("Main image is required");
        return;
      }

      setUploading(true);

      let mainImageUrl = project?.image || "";
      let mainImagePublicId = project?.imagePublicId || "";
      let galleryUrls = project?.gallery || [];
      let galleryPublicIds = project?.galleryPublicIds || [];

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

      // Ensure area has m² suffix
      const areaWithUnit = String(data.area).includes('m²') 
        ? data.area 
        : `${data.area} m²`;

      const projectData = {
        ...data,
        area: areaWithUnit, // Store with m² suffix
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

      const responseData = await res.json();

      if (!responseData.success) {
        throw new Error(responseData.error || "Failed to save project");
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
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6" noValidate>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City, Country"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("year")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>

              {/* Area with m² suffix - User only enters number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => {
                    const numericValue = extractAreaNumber(field.value);
                    
                    return (
                      <div className="relative">
                        <input
                          type="text"
                          value={numericValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers and decimal point
                            const cleaned = value.replace(/[^0-9.]/g, '');
                            // Prevent multiple decimal points
                            const parts = cleaned.split('.');
                            const sanitized = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
                            
                            // Update form value with m² suffix
                            field.onChange(sanitized ? `${sanitized} m²` : '');
                          }}
                          onBlur={field.onBlur}
                          className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                            errors.area ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter area"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          m²
                        </span>
                      </div>
                    );
                  }}
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  {...register("type")}
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
                  {...register("category")}
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
                  {...register("status")}
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
                <Controller
                  name="order"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 0 : parseInt(value));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.order ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                  )}
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
                )}
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("featured")}
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
                  {...register("description")}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project description..."
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {descriptionLength}/2000 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Main Image Uploader */}
              <div className="sm:col-span-2">
                <ImageUploader
                  currentImage={imagePreview}
                  onImageChange={handleImageChange}
                  required={!project}
                  error={imageError}
                />
                {imageError && (
                  <p className="mt-1 text-sm text-red-600">{imageError}</p>
                )}
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
              disabled={uploading || isSubmitting}
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