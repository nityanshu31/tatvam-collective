// app/dashboard/projects/components/GalleryUploader.jsx
"use client";

export default function GalleryUploader({ images, onImagesChange, onRemoveImage }) {
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];
    const newPreviews = [];
    
    let loadedCount = 0;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newFiles.push(file);
        newPreviews.push(e.target.result);
        loadedCount++;
        
        if (loadedCount === files.length) {
          onImagesChange(newFiles, newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gallery Images
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
      />
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}