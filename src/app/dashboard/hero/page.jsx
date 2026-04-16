"use client";

import { useEffect, useState } from "react";

export default function HeroTestPage() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    imagePublicId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Existing Hero
  useEffect(() => {
    const fetchHero = async () => {
      const res = await fetch("/api/hero");
      const data = await res.json();

      if (data) {
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          imageUrl: data.imageUrl || "",
          imagePublicId: data.imagePublicId || "",
        });
      }
    };

    fetchHero();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Resize + Compress Image Before Upload
  const resizeImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxWidth = 1600;

        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

        resolve(compressedBase64);
      };

      reader.readAsDataURL(file);
    });

  const handleSave = async () => {
    try {
      setLoading(true);

      let imageUrl = formData.imageUrl;
      let imagePublicId = formData.imagePublicId;

      // Upload New Image If Selected
      if (imageFile) {
        const compressedBase64 = await resizeImage(imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: compressedBase64,
          }),
        });

        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          throw new Error(uploadData.message || "Image upload failed");
        }

        imageUrl = uploadData.imageUrl;
        imagePublicId = uploadData.publicId;
      }

      // Save Hero Data
      const saveRes = await fetch("/api/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          subtitle: formData.subtitle,
          imageUrl,
          imagePublicId,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveData.success) {
        throw new Error(saveData.error || "Failed to save hero");
      }

      alert("Hero updated successfully!");

      setFormData((prev) => ({
        ...prev,
        imageUrl,
        imagePublicId,
      }));

      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Hero CMS Test</h1>

      <input
        type="text"
        name="title"
        placeholder="Hero Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <textarea
        name="subtitle"
        placeholder="Hero Subtitle"
        value={formData.subtitle}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      {formData.imageUrl && (
        <img
          src={formData.imageUrl}
          alt="Hero Preview"
          className="w-full max-h-[400px] object-cover rounded"
        />
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Hero"}
      </button>
    </div>
  );
}
