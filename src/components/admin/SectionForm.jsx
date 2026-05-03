// components/admin/SectionForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Upload, Plus, Trash2 } from "lucide-react";

const SectionForm = ({ section, onSave, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [badgeInput, setBadgeInput] = useState("");
  const [statsEntries, setStatsEntries] = useState([]);
  const [previousType, setPreviousType] = useState("");
  const [isManualEdit, setIsManualEdit] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
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
      backgroundColor: "var(--white)",
      order: 0
    }
  });

  const watchMediaType = watch("media.type");
  const watchType = watch("type");

  // Get default values based on section type
  const getTypeDefaults = (type) => {
    const presets = {
      hiring: {
        title: "Frontend Developer Wanted",
        description: "Join our creative team! We're looking for a passionate frontend developer with React and Next.js experience. Remote work available, competitive salary, and great benefits.",
        priority: "high",
        badges: ["Urgent Hiring", "Remote", "Full-time"],
        cta: { text: "Apply Now →", link: "/careers/frontend-dev", openInNewTab: false },
        stats: { "Openings": "3", "Experience": "2-5 yrs", "Location": "Remote" },
        expandable: false,
        collapsible: false,
        media: { type: "carousel", autoplay: true, interval: 4000 }
      },
      promotion: {
        title: "Summer Sale - 30% Off",
        description: "Get 30% off on all architectural consultation services. Limited time offer! Use code SUMMER30 at checkout. Don't miss out on this amazing opportunity to work with our top architects.",
        priority: "high",
        badges: ["Limited Time", "Hot Deal", "30% OFF"],
        cta: { text: "Claim Offer →", link: "/promotions/summer-sale", openInNewTab: false },
        stats: {},
        expandable: false,
        collapsible: false,
        media: { type: "carousel", autoplay: true, interval: 3000 }
      },
      notification: {
        title: "Platform Update v3.0",
        description: "We've launched new features including 3D visualization tools, real-time collaboration, and enhanced project management. Check out what's new!",
        priority: "medium",
        badges: ["New", "Feature Update"],
        cta: { text: "See What's New →", link: "/updates/v3.0", openInNewTab: false },
        stats: {},
        expandable: true,
        collapsible: false,
        media: { type: "image" }
      },
      dashboard: {
        title: "Project Analytics",
        description: "Your projects are performing exceptionally well this quarter. Total leads increased by 45% compared to last month.",
        priority: "medium",
        badges: ["Live Data", "Updated Daily"],
        cta: { text: "", link: "", openInNewTab: false },
        stats: { "Projects": "24", "Active": "18", "Completed": "6", "Clients": "12" },
        expandable: false,
        collapsible: false,
        media: { type: "image" }
      },
      default: {
        title: "",
        description: "",
        priority: "medium",
        badges: [],
        cta: { text: "", link: "", openInNewTab: false },
        stats: {},
        expandable: false,
        collapsible: false,
        media: { type: "none" }
      }
    };
    return presets[type] || presets.default;
  };

  // Function to populate fields based on type
  const populateFieldsByType = (type) => {
    const typeDefaults = getTypeDefaults(type);
    
    setValue("title", typeDefaults.title);
    setValue("description", typeDefaults.description);
    setValue("priority", typeDefaults.priority);
    setValue("badges", typeDefaults.badges);
    setValue("cta.text", typeDefaults.cta.text);
    setValue("cta.link", typeDefaults.cta.link);
    setValue("cta.openInNewTab", typeDefaults.cta.openInNewTab);
    setValue("expandable", typeDefaults.expandable);
    setValue("collapsible", typeDefaults.collapsible);
    
    if (typeDefaults.media) {
      setValue("media.type", typeDefaults.media.type);
      setValue("media.autoplay", typeDefaults.media.autoplay || false);
      setValue("media.interval", typeDefaults.media.interval || 3000);
    }
    
    // Set stats
    if (typeDefaults.stats && Object.keys(typeDefaults.stats).length > 0) {
      const entries = Object.entries(typeDefaults.stats).map(([key, value]) => ({ key, value }));
      setStatsEntries(entries);
    } else {
      setStatsEntries([]);
    }
  };

  // Auto-load fields when type changes (for new sections)
  useEffect(() => {
    if (!section && watchType && watchType !== previousType) {
      // Ask for confirmation if fields are not empty and user has made changes
      const hasContent = getValues("title") || getValues("description") || 
                        (getValues("badges") && getValues("badges").length > 0);
      
      if (hasContent && !isManualEdit) {
        const confirmChange = window.confirm(
          `Changing type to "${watchType}" will overwrite current form data. Are you sure?`
        );
        if (confirmChange) {
          populateFieldsByType(watchType);
          setIsManualEdit(false);
        } else {
          // Revert to previous type
          setValue("type", previousType);
          return;
        }
      } else {
        populateFieldsByType(watchType);
        setIsManualEdit(false);
      }
      
      setPreviousType(watchType);
    }
  }, [watchType, section, previousType, getValues, setValue, isManualEdit]);

  // Detect manual edits
  useEffect(() => {
    if (!section && previousType) {
      const subscription = watch((value, { name }) => {
        if (name && name !== "type") {
          setIsManualEdit(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, section, previousType]);

  // Load existing section data when editing
  useEffect(() => {
    if (section) {
      // Load basic fields
      Object.keys(section).forEach(key => {
        if (key !== "stats" && key !== "media" && key !== "badges" && key !== "cta") {
          setValue(key, section[key]);
        }
      });

      // Load CTA
      if (section.cta) {
        setValue("cta.text", section.cta.text || "");
        setValue("cta.link", section.cta.link || "");
        setValue("cta.openInNewTab", section.cta.openInNewTab || false);
      }

      // Load badges
      if (section.badges && Array.isArray(section.badges)) {
        setValue("badges", section.badges);
      }

      // Load media
      if (section.media) {
        setValue("media", {
          type: section.media.type || "none",
          images: section.media.images || [],
          videoUrl: section.media.videoUrl || "",
          autoplay: section.media.autoplay || false,
          interval: section.media.interval || 3000
        });
      }

      // Load stats (convert from object to array for form)
      if (section.stats) {
        let statsObj = section.stats;
        if (section.stats instanceof Map) {
          statsObj = Object.fromEntries(section.stats);
        }
        const entries = Object.entries(statsObj).map(([key, value]) => ({ key, value }));
        setStatsEntries(entries);
      }

      // Handle expiry date
      if (section.expiryDate) {
        const date = new Date(section.expiryDate);
        if (!isNaN(date.getTime())) {
          setValue("expiryDate", date.toISOString().split("T")[0]);
        }
      }
      
      setPreviousType(section.type);
    }
  }, [section, setValue]);

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB");
      return;
    }
    
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const base64String = event.target.result;
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64String })
        });
        
        clearInterval(progressInterval);
        
        if (!res.ok) {
          throw new Error(`Upload failed: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
          setUploadProgress(100);
          
          const currentImages = getValues("media.images") || [];
          const newImage = {
            url: data.imageUrl,
            alt: "",
            order: currentImages.length,
            publicId: data.publicId
          };
          
          setValue("media.images", [...currentImages, newImage]);
          setTimeout(() => setUploadProgress(0), 500);
        } else {
          throw new Error(data.message || "Upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(`Error uploading image: ${error.message}`);
      } finally {
        setUploading(false);
      }
    };
    
    reader.onerror = () => {
      console.error("FileReader error");
      alert("Error reading file");
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const currentImages = getValues("media.images");
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("media.images", newImages);
    
    // Update order
    newImages.forEach((img, idx) => {
      img.order = idx;
    });
  };

  const addBadgeHandler = () => {
    if (badgeInput.trim()) {
      const currentBadges = getValues("badges") || [];
      if (!currentBadges.includes(badgeInput.trim())) {
        setValue("badges", [...currentBadges, badgeInput.trim()]);
        setBadgeInput("");
      }
    }
  };

  const removeBadgeHandler = (index) => {
    const currentBadges = getValues("badges");
    const newBadges = currentBadges.filter((_, i) => i !== index);
    setValue("badges", newBadges);
  };

  const addStatHandler = () => {
    const keyInput = document.getElementById("statKey");
    const valueInput = document.getElementById("statValue");
    
    if (keyInput && valueInput && keyInput.value.trim() && valueInput.value.trim()) {
      setStatsEntries([
        ...statsEntries,
        { key: keyInput.value.trim(), value: valueInput.value.trim() }
      ]);
      keyInput.value = "";
      valueInput.value = "";
    }
  };

  const removeStatHandler = (index) => {
    setStatsEntries(statsEntries.filter((_, i) => i !== index));
  };

  const updateStat = (index, field, value) => {
    const updated = [...statsEntries];
    updated[index][field] = value;
    setStatsEntries(updated);
  };

  const onSubmit = async (data) => {
    // Convert stats entries to object (matching mock data format)
    const statsObject = {};
    statsEntries.forEach(stat => {
      if (stat.key && stat.value) {
        statsObject[stat.key] = stat.value;
      }
    });

    // Prepare final data
    const submitData = {
      ...data,
      stats: statsObject,
      media: {
        ...data.media,
        images: data.media.images?.map((img, idx) => ({
          url: img.url,
          alt: img.alt || "",
          order: idx,
          publicId: img.publicId
        })) || []
      }
    };

    // Remove empty strings from CTA if not provided
    if (!submitData.cta.text) delete submitData.cta.text;
    if (!submitData.cta.link) delete submitData.cta.link;

    // Remove empty expiry date
    if (!submitData.expiryDate) delete submitData.expiryDate;

    await onSave(submitData);
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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[var(--black)]">
            {section ? "Edit Section" : "Create New Section"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", { 
                    required: "Title is required",
                    minLength: { value: 3, message: "Title must be at least 3 characters" }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                    errors.title ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("type", { required: "Type is required" })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="default">Default</option>
                  <option value="notification">Notification</option>
                  <option value="hiring">Hiring</option>
                  <option value="promotion">Promotion</option>
                  <option value="dashboard">Dashboard</option>
                </select>
                {!section && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Changing type will auto-fill all fields with preset values
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--black)] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register("description", { 
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  errors.description ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Priority</label>
                <select {...register("priority")} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Expiry Date</label>
                <input
                  type="date"
                  {...register("expiryDate")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("defaultVisible")} className="w-4 h-4" />
                <span className="text-sm">Visible by default</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("isActive")} className="w-4 h-4" />
                <span className="text-sm">Active</span>
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
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBadgeHandler())}
                placeholder="Enter badge text"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="button"
                onClick={addBadgeHandler}
                className="px-4 py-2 bg-[var(--black)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(getValues("badges") || []).map((badge, idx) => (
                <span key={idx} className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm flex items-center gap-2">
                  {badge}
                  <button type="button" onClick={() => removeBadgeHandler(idx)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
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
                  {...register("cta.text")}
                  placeholder="Learn More"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Button Link</label>
                <input
                  type="text"
                  {...register("cta.link")}
                  placeholder="/careers or https://"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>
            
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("cta.openInNewTab")} className="w-4 h-4" />
              <span className="text-sm">Open link in new tab</span>
            </label>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--black)]">Media</h3>
            
            <div>
              <label className="block text-sm font-medium text-[var(--black)] mb-1">Media Type</label>
              <select {...register("media.type")} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
                <option value="none">None</option>
                <option value="image">Single Image</option>
                <option value="carousel">Carousel</option>
                <option value="video">Video</option>
              </select>
            </div>

            {(watchMediaType === "image" || watchMediaType === "carousel") && (
              <div>
                <div className="mb-4">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                  {uploading && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-1">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>

                {getValues("media.images")?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {getValues("media.images").map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img.url} alt={img.alt || `Image ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Alt text"
                          value={img.alt || ""}
                          onChange={(e) => {
                            const images = getValues("media.images");
                            images[idx].alt = e.target.value;
                            setValue("media.images", images);
                          }}
                          className="absolute bottom-2 left-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {watchMediaType === "carousel" && (
                  <div className="mt-3 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" {...register("media.autoplay")} />
                      <span className="text-sm">Autoplay</span>
                    </label>
                    
                    {watch("media.autoplay") && (
                      <div>
                        <label className="text-sm">Interval (ms)</label>
                        <input type="number" {...register("media.interval")} className="ml-2 px-2 py-1 border rounded w-24" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {watchMediaType === "video" && (
              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-1">Video URL</label>
                <input type="text" {...register("media.videoUrl")} placeholder="https://..." className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
            )}
          </div>

          {/* Stats - Show for dashboard type or when stats exist */}
          {(watchType === "dashboard" || statsEntries.length > 0) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--black)]">Statistics (Key-Value pairs)</h3>
              
              <div className="flex gap-2">
                <input id="statKey" type="text" placeholder="Label (e.g., Projects)" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                <input id="statValue" type="text" placeholder="Value (e.g., 24)" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                <button type="button" onClick={addStatHandler} className="px-4 py-2 bg-[var(--black)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {statsEntries.length > 0 && (
                <div className="space-y-2">
                  {statsEntries.map((stat, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={stat.key}
                        onChange={(e) => updateStat(idx, "key", e.target.value)}
                        placeholder="Key"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(idx, "value", e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                      <button type="button" onClick={() => removeStatHandler(idx)} className="p-2 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
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
            
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("expandable")} />
                <span className="text-sm">Expandable (Read more)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("collapsible")} />
                <span className="text-sm">Collapsible (Can minimize)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order (display priority)</label>
                <input type="number" {...register("order")} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[var(--black)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Saving..." : (section ? "Update Section" : "Create Section")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SectionForm;