// app/admin/blogs/page.jsx

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";

export default function AdminBlogs() {
  // Form state
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sections, setSections] = useState([{ heading: "", content: "" }]);
  const [errors, setErrors] = useState({ title: "", images: "", sections: [] });

  // Drag state for image upload
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: ""
  });
  const [deleting, setDeleting] = useState(false);

  // FETCH BLOGS
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // CONVERT TO BASE64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages = [];
      const fileArray = Array.from(files);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);
          continue;
        }

        const base64 = await convertToBase64(file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        if (data.imageUrl) {
          uploadedImages.push(data.imageUrl);
        }
        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }

      if (uploadedImages.length > 0) {
        setImages((prev) => [...prev, ...uploadedImages]);
        // clear image error when we have images
        setErrors((prev) => ({ ...prev, images: "" }));
        toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onFileSelect = (e) => {
    handleImageUpload(e.target.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleImageUpload(files);
    }
  };

  // RESET FORM
  const resetForm = () => {
    setTitle("");
    setImages([]);
    setSections([{ heading: "", content: "" }]);
    setEditingBlog(null);
    setErrors({ title: "", images: "", sections: [] });
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setImages(blog.images || []);
    setSections(blog.sections?.length ? blog.sections : [{ heading: "", content: "" }]);
    setShowForm(true);
    // clear errors when loading existing blog
    setErrors({ title: "", images: "", sections: [] });
  };

  // SUBMIT BLOG
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate on submit
    if (!validateForm()) return;

    const url = editingBlog ? `/api/blogs/manage/${editingBlog._id}` : "/api/blogs";
    const method = editingBlog ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, images, sections }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingBlog ? "Blog updated successfully!" : "Blog published successfully!");
        resetForm();
        setShowForm(false);
        fetchBlogs();
      } else {
        toast.error(data.message || data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save blog");
    }
  };

  // Client-side validation
  const validateForm = () => {
    let ok = true;
    const newErrors = { title: "", images: "", sections: [] };

    if (!title || !title.trim()) {
      newErrors.title = "Title is required";
      ok = false;
    }

    if (!Array.isArray(images) || images.length === 0) {
      newErrors.images = "At least one image is required";
      ok = false;
    }

    if (!Array.isArray(sections) || sections.length === 0) {
      newErrors.sections = sections.map(() => "Section heading and content are required");
      ok = false;
    } else {
      newErrors.sections = sections.map((sec) => {
        if (!sec || !sec.heading?.toString().trim() || !sec.content?.toString().trim()) {
          ok = false;
          return "Heading and content are required";
        }
        return "";
      });
    }

    setErrors(newErrors);
    // show a toast summary if invalid
    if (!ok) {
      if (newErrors.title) toast.error(newErrors.title);
      else if (newErrors.images) toast.error(newErrors.images);
      else toast.error("Please fix the errors in the form");
    }

    return ok;
  };

  // DELETE BLOG
  const handleDeleteClick = (blogId, blogTitle) => {
    setDeleteDialog({
      isOpen: true,
      blogId,
      blogTitle
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/blogs/manage/${deleteDialog.blogId}`, {
        method: "DELETE"
      });
      let data;
      try {
        data = await res.json();
      } catch (err) {
        const text = await res.text();
        console.error('Delete failed, non-json response:', res.status, text);
        throw new Error(`Delete failed: ${res.status} ${text}`);
      }

      if (data.success) {
        console.log('Delete response:', data);
        toast.success("Blog deleted successfully");
        fetchBlogs();
        setDeleteDialog({ isOpen: false, blogId: null, blogTitle: "" });
      } else {
        throw new Error(data.message || data.error || "Delete failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const removeImage = (indexToRemove) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setImages(images.filter((_, idx) => idx !== indexToRemove));
      toast.info("Image removed");
      // clear image error if we still have images
      setErrors((prev) => ({ ...prev, images: images.length - 1 > 0 ? "" : prev.images }));
    }
  };

  const updateSection = (index, field, value) => {
    setSections((prev) =>
      prev.map((sec, idx) =>
        idx === index ? { ...sec, [field]: value } : sec
      )
    );
    // clear section-specific error when user edits
    setErrors((prev) => {
      const newSections = [...(prev.sections || [])];
      if (!newSections[index]) newSections[index] = "";
      newSections[index] = "";
      return { ...prev, sections: newSections };
    });
  };

  const removeSection = (indexToRemove) => {
    if (sections.length === 1) {
      toast.warning("Blog must have at least one section");
      return;
    }
    setSections(sections.filter((_, idx) => idx !== indexToRemove));
    setErrors((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const addSection = () => {
    setSections([...sections, { heading: "", content: "" }]);
    setErrors((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), ""],
    }));
  };

  // Stats Component
  const BlogStats = () => {
    const totalImages = blogs.reduce((sum, blog) => sum + (blog.images?.length || 0), 0);
    const totalSections = blogs.reduce((sum, blog) => sum + (blog.sections?.length || 0), 0);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <line x1="22" y1="6" x2="2" y2="6"></line>
              </svg>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-black">{blogs.length}</p>
              <p className="text-xs sm:text-sm text-gray-500">Total Blogs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#C6A77D] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <circle cx="15.5" cy="8.5" r="1.5"></circle>
                <circle cx="8.5" cy="15.5" r="1.5"></circle>
                <circle cx="15.5" cy="15.5" r="1.5"></circle>
              </svg>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-black">{totalImages}</p>
              <p className="text-xs sm:text-sm text-gray-500">Total Images</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#6B7280] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-black">{totalSections}</p>
              <p className="text-xs sm:text-sm text-gray-500">Total Sections</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Dialog Component
  const DeleteConfirmDialog = () => {
    if (!deleteDialog.isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl animate-slide-in overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black">Delete Blog</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold text-black">"{deleteDialog.blogTitle}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteDialog({ isOpen: false, blogId: null, blogTitle: "" })}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Blog Card Component (Mobile)
  const BlogCard = ({ blog }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {blog.images?.[0] && (
          <img
            src={blog.images[0]}
            alt={blog.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-black text-lg truncate">{blog.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {blog.sections?.length || 0} sections · {blog.images?.length || 0} images
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleEdit(blog)}
          className="flex-1 px-3 py-2 rounded-lg text-[#C6A77D] border border-[#C6A77D] hover:bg-[#C6A77D] hover:text-white transition-all duration-200 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(blog._id, blog.title)}
          className="flex-1 px-3 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );

  // Blog Table Component (Desktop)
  const BlogTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">Image</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">Title</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">Sections</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">Images</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {blog.images?.[0] ? (
                    <img src={blog.images[0]} alt={blog.title} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="2.18"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-black truncate max-w-xs">{blog.title}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{blog.sections?.length || 0}</td>
                <td className="px-6 py-4 text-gray-600">{blog.images?.length || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-3 py-1.5 rounded-lg text-[#C6A77D] border border-[#C6A77D] hover:bg-[#C6A77D] hover:text-white transition-all duration-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog._id, blog.title)}
                      className="px-3 py-1.5 rounded-lg text-red-500 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
                  Blogs Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Create, edit, and manage your blog posts
                </p>
              </div>

              <button
                onClick={handleAdd}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-sm sm:text-base rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Blog
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <BlogStats />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 && !showForm ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No blog posts yet</p>
              <button
                onClick={handleAdd}
                className="mt-4 text-[#C6A77D] font-medium hover:underline"
              >
                Create your first blog post
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <BlogTable />
              </div>
            </>
          )}
        </div>

        {/* Blog Form Modal - Translucent Background */}
        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 backdrop-blur-sm animate-fade-in">
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-in shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-black">
                    {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* TITLE */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Blog Title *</label>
                    <input
                      type="text"
                      placeholder="Enter an engaging title..."
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }}
                      className={`w-full border rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A77D] focus:border-transparent transition ${errors.title ? 'border-red-500 focus:ring-red-300' : 'border-gray-200'}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-2">{errors.title}</p>
                    )}
                  </div>

                  {/* IMAGE UPLOAD */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Images</label>

                    {/* Dropzone */}
                    <div
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${isDragging ? "border-[#C6A77D] bg-[#C6A77D] bg-opacity-5" : "hover:border-[#C6A77D]"} ${errors.images ? 'border-red-500' : 'border-gray-200'}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFileSelect}
                        className="hidden"
                      />
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-black font-medium">Click or drag images to upload</p>
                      <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>

                    {errors.images && (
                      <p className="text-sm text-red-600 mt-2">{errors.images}</p>
                    )}

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C6A77D] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* IMAGE PREVIEW */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTIONS */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-medium text-black">Content Sections *</label>
                      <button
                        type="button"
                        onClick={addSection}
                        className="text-[#C6A77D] hover:text-[#b8956a] text-sm font-medium transition"
                      >
                        + Add Section
                      </button>
                    </div>

                    <div className="space-y-4">
                      {sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium text-gray-500">Section {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="text-red-500 text-sm hover:text-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Section Heading"
                              value={section.heading}
                              onChange={(e) => updateSection(index, "heading", e.target.value)}
                              className={`w-full border rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A77D] ${errors.sections?.[index] ? 'border-red-500 focus:ring-red-300' : 'border-gray-200'}`}
                            />
                            <textarea
                              placeholder="Write your content here..."
                              value={section.content}
                              onChange={(e) => updateSection(index, "content", e.target.value)}
                              className={`w-full border rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6A77D] min-h-[100px] resize-y ${errors.sections?.[index] ? 'border-red-500 focus:ring-red-300' : 'border-gray-200'}`}
                            />
                            {errors.sections?.[index] && (
                              <p className="text-sm text-red-600 mt-2">{errors.sections[index]}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SUBMIT BUTTONS */}
                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-md"
                    >
                      {editingBlog ? "Update Blog Post" : "Publish Blog Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog - Translucent Background */}
        <DeleteConfirmDialog />
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}