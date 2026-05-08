// app/admin/blogs/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function AdminBlogs() {
  const [title, setTitle] = useState("");

  const [images, setImages] = useState([]);

  const [uploading, setUploading] =
    useState(false);

  const [blogs, setBlogs] = useState([]);

  const [editId, setEditId] =
    useState(null);

  const [sections, setSections] = useState([
    {
      heading: "",
      content: "",
    },
  ]);

  // FETCH BLOGS
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");

    const data = await res.json();

    setBlogs(data.blogs || []);
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    setUploading(true);

    try {
      const uploadedImages = [];

      for (const file of files) {
        const base64 =
          await convertToBase64(file);

        const res = await fetch(
          "/api/upload",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              image: base64,
            }),
          }
        );

        const data = await res.json();

        uploadedImages.push(
          data.imageUrl
        );
      }

      setImages((prev) => [
        ...prev,
        ...uploadedImages,
      ]);
    } catch (error) {
      console.log(error);

      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // CONVERT TO BASE64
  const convertToBase64 = (file) => {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () =>
          resolve(reader.result);

        reader.onerror = reject;
      }
    );
  };

  // RESET FORM
  const resetForm = () => {
    setTitle("");

    setImages([]);

    setSections([
      {
        heading: "",
        content: "",
      },
    ]);

    setEditId(null);
  };

  // SUBMIT BLOG
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `/api/blogs/manage/${editId}`
      : "/api/blogs/manage";

    const method = editId
      ? "PUT"
      : "POST";

    const res = await fetch(url, {
      method,

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        title,
        images,
        sections,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert(
        editId
          ? "Blog Updated"
          : "Blog Added"
      );

      resetForm();

      fetchBlogs();
    }
  };

  // EDIT BLOG
  const editBlog = (blog) => {
    setEditId(blog._id);

    setTitle(blog.title);

    setImages(blog.images || []);

    setSections(
      blog.sections || []
    );
  };

  // DELETE BLOG
  const deleteBlog = async (id) => {
    const confirmDelete = confirm(
      "Delete this blog?"
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `/api/blogs/manage/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Blog Deleted");

      fetchBlogs();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-10">
        {editId
          ? "Update Blog"
          : "Add Blog"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* TITLE */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        {/* IMAGE UPLOAD */}
        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-4 rounded-xl"
          />

          {uploading && (
            <p>Uploading images...</p>
          )}

          {/* IMAGE PREVIEW */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-32 object-cover rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => {
                    const updated =
                      [...images];

                    updated.splice(
                      index,
                      1
                    );

                    setImages(updated);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTIONS */}
        {sections.map(
          (section, index) => (
            <div
              key={index}
              className="border p-5 rounded-2xl space-y-4"
            >
              <input
                type="text"
                placeholder="Section Heading"
                value={
                  section.heading
                }
                onChange={(e) => {
                  const updated =
                    [...sections];

                  updated[
                    index
                  ].heading =
                    e.target.value;

                  setSections(
                    updated
                  );
                }}
                className="w-full border p-4 rounded-xl"
              />

              <textarea
                placeholder="Section Content"
                value={
                  section.content
                }
                onChange={(e) => {
                  const updated =
                    [...sections];

                  updated[
                    index
                  ].content =
                    e.target.value;

                  setSections(
                    updated
                  );
                }}
                className="w-full border p-4 rounded-xl h-40"
              />

              <button
                type="button"
                onClick={() => {
                  const updated =
                    [...sections];

                  updated.splice(
                    index,
                    1
                  );

                  setSections(
                    updated
                  );
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Remove Section
              </button>
            </div>
          )
        )}

        {/* ADD SECTION */}
        <button
          type="button"
          onClick={() =>
            setSections([
              ...sections,
              {
                heading: "",
                content: "",
              },
            ])
          }
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Add Section
        </button>

        <br />

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl"
        >
          {editId
            ? "Update Blog"
            : "Publish Blog"}
        </button>
      </form>

      {/* BLOG LIST */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          All Blogs
        </h2>

        <div className="space-y-5">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border p-5 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {blog.images?.[0] && (
                  <img
                    src={blog.images[0]}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                )}

                <div>
                  <h3 className="text-xl font-semibold">
                    {blog.title}
                  </h3>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    editBlog(blog)
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteBlog(
                      blog._id
                    )
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}