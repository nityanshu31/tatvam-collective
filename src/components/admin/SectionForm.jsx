// components/admin/SectionForm.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SectionForm = ({ section, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "default",
    priority: "medium",
    defaultVisible: true,
    isActive: true,
    expiryDate: "",
    badges: [],
    cta: {
      text: "",
      link: "",
      openInNewTab: false
    },
    media: {
      type: "none",
      images: [],
      videoUrl: "",
      autoplay: false,
      interval: 3000
    },
    stats: {},
    expandable: false,
    collapsible: false,
    accentColor: "var(--accent)",
    backgroundColor: "var(--white)"
  });

  const [badgeInput, setBadgeInput] = useState("");
  const [statInput, setStatInput] = useState({ key: "", value: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (section) {
      // Handle stats conversion from Map to plain object
      let statsObj = {};
      if (section.stats) {
        if (section.stats instanceof Map) {
          statsObj = Object.fromEntries(section.stats);
        } else {
          statsObj = section.stats;
        }
      }

      setFormData({
        ...section,
        expiryDate: section.expiryDate ? new Date(section.expiryDate).toISOString().split("T")[0] : "",
        stats: statsObj,
        media: {
          ...section.media,
          images: section.media?.images || []
        }
      });
    }
  }, [section]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCTAChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  };

  const handleMediaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      media: { ...prev.media, [field]: value }
    }));
  };

  const addBadge = () => {
    if (badgeInput.trim() && !formData.badges.includes(badgeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        badges: [...prev.badges, badgeInput.trim()]
      }));
      setBadgeInput("");
    }
  };

  const removeBadge = (badge) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.filter(b => b !== badge)
    }));
  };

  // Cloudinary image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    
    // Simulate progress (since fetch doesn't support progress easily)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      const res = await fetch("/api/sections/upload", {
        method: "POST",
        body: formDataUpload
      });
      
      clearInterval(progressInterval);
      
      const data = await res.json();
      
      if (data.success) {
        setUploadProgress(100);
        
        // Add the uploaded image to the images array
        const newImage = {
          url: data.url,
          alt: "",
          order: formData.media.images.length,
          publicId: data.publicId
        };
        
        setFormData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            images: [...prev.media.images, newImage]
          }
        }));
        
        // Reset progress after showing 100%
        setTimeout(() => setUploadProgress(0), 500);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = formData.media.images[index];
    
    // Delete from Cloudinary if it has a publicId
    if (imageToRemove.publicId) {
      try {
        await fetch(`/api/sections/upload?publicId=${imageToRemove.publicId}`, {
          method: "DELETE"
        });
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        images: prev.media.images.filter((_, i) => i !== index)
      }
    }));
  };

  const addStat = () => {
    if (statInput.key.trim() && statInput.value.trim()) {
      setFormData(prev => ({
        ...prev,
        stats: { ...prev.stats, [statInput.key.trim()]: statInput.value.trim() }
      }));
      setStatInput({ key: "", value: "" });
    }
  };

  const removeStat = (key) => {
    setFormData(prev => {
      const newStats = { ...prev.stats };
      delete newStats[key];
      return { ...prev, stats: newStats };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }
    
    // Clean up data before sending
    const submitData = {
      ...formData,
      // Ensure stats is a plain object
      stats: formData.stats || {},
      // Ensure images have proper structure
      media: {
        ...formData.media,
        images: formData.media.images.map((img, idx) => ({
          ...img,
          order: idx
        }))
      }
    };
    
    onSave(submitData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[var(--border)] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[var(--black)]">
            {section ? "Edit Section" : "Create New Section"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="default">Default</option>
                  <option value="notification">Notification</option>
                  <option value="hiring">Hiring</option>
                  <option value="promotion">Promotion</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--black)] mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="defaultVisible"
                  checked={formData.defaultVisible}
                  onChange={handleChange}
                  className="w-4 h-4 text-[var(--accent)]"
                />
                <span className="text-sm text-[var(--black)]">Visible by default</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[var(--accent)]"
                />
                <span className="text-sm text-[var(--black)]">Active</span>
              </label>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Badges</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())}
                placeholder="Enter badge text"
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="button"
                onClick={addBadge}
                className="px-4 py-2 bg-[var(--black)] text-white rounded-lg hover:bg-[var(--accent)]"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm flex items-center gap-2"
                >
                  {badge}
                  <button
                    type="button"
                    onClick={() => removeBadge(badge)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Call to Action</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.cta.text}
                  onChange={(e) => handleCTAChange("text", e.target.value)}
                  placeholder="Learn More"
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Button Link</label>
                <input
                  type="text"
                  value={formData.cta.link}
                  onChange={(e) => handleCTAChange("link", e.target.value)}
                  placeholder="/careers or https://"
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                />
              </div>
            </div>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.cta.openInNewTab}
                onChange={(e) => handleCTAChange("openInNewTab", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Open link in new tab</span>
            </label>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Media</h3>
            
            <div>
              <label className="block text-sm font-medium text-[var(--black)] mb-1">Media Type</label>
              <select
                value={formData.media.type}
                onChange={(e) => handleMediaChange("type", e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
              >
                <option value="none">None</option>
                <option value="image">Single Image</option>
                <option value="carousel">Carousel</option>
                <option value="video">Video</option>
              </select>
            </div>

            {(formData.media.type === "image" || formData.media.type === "carousel") && (
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Images</label>
                
                {/* Cloudinary Upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--black)] file:text-white hover:file:bg-[var(--accent)]"
                  />
                  {uploading && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--accent)] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-1">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>

                {/* Or add image URL manually */}
                <div className="text-center text-sm text-[var(--muted)] my-2">OR</div>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={imageInput.url}
                    onChange={(e) => setImageInput({ ...imageInput, url: e.target.value })}
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={imageInput.alt}
                    onChange={(e) => setImageInput({ ...imageInput, alt: e.target.value })}
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-[var(--black)] text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                
                {/* Image Gallery Grid */}
                {formData.media.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {formData.media.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url}
                          alt={img.alt || `Image ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                          <input
                            type="text"
                            placeholder="Alt text"
                            value={img.alt}
                            onChange={(e) => {
                              const newImages = [...formData.media.images];
                              newImages[idx].alt = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                media: { ...prev.media, images: newImages }
                              }));
                            }}
                            className="w-full px-2 py-1 text-sm rounded bg-white text-black"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.media.type === "carousel" && (
                  <div className="mt-3 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.media.autoplay}
                        onChange={(e) => handleMediaChange("autoplay", e.target.checked)}
                      />
                      <span className="text-sm">Autoplay</span>
                    </label>
                    
                    {formData.media.autoplay && (
                      <div>
                        <label className="text-sm">Interval (ms)</label>
                        <input
                          type="number"
                          value={formData.media.interval}
                          onChange={(e) => handleMediaChange("interval", parseInt(e.target.value))}
                          className="ml-2 px-2 py-1 border rounded w-24"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {formData.media.type === "video" && (
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Video URL</label>
                <input
                  type="text"
                  value={formData.media.videoUrl}
                  onChange={(e) => handleMediaChange("videoUrl", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://..."
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                />
                <p className="text-xs text-[var(--muted)] mt-1">
                  Supports YouTube, Vimeo, or direct video URLs
                </p>
              </div>
            )}
          </div>

          {/* Stats (for dashboard type) */}
          {formData.type === "dashboard" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--black)]">Statistics</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g., Projects)"
                  value={statInput.key}
                  onChange={(e) => setStatInput({ ...statInput, key: e.target.value })}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Value (e.g., 24)"
                  value={statInput.value}
                  onChange={(e) => setStatInput({ ...statInput, value: e.target.value })}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                />
                <button
                  type="button"
                  onClick={addStat}
                  className="px-4 py-2 bg-[var(--black)] text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              
              {Object.keys(formData.stats).length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(formData.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm">{key}:</span>
                      <span className="text-sm">{value}</span>
                      <button
                        type="button"
                        onClick={() => removeStat(key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Display Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Display Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="expandable"
                  checked={formData.expandable}
                  onChange={handleChange}
                />
                <span className="text-sm">Expandable (Read more button)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="collapsible"
                  checked={formData.collapsible}
                  onChange={handleChange}
                />
                <span className="text-sm">Collapsible (Can be minimized)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Accent Color</label>
                <input
                  type="text"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
                  placeholder="var(--accent) or #C6A77D"
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Background Color</label>
                <input
                  type="text"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  placeholder="var(--white) or #FFFFFF"
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white border-t border-[var(--border)] pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--black)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors"
            >
              {section ? "Update Section" : "Create Section"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SectionForm;