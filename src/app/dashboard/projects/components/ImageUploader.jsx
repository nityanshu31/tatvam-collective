// app/dashboard/projects/components/ImageUploader.jsx
"use client";

export default function ImageUploader({ currentImage, onImageChange, required = false }) {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(file, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Main Image {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
      />
      {currentImage && (
        <div className="mt-3">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full max-w-xs h-auto object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}