// app/dashboard/projects/utils/uploadUtils.js
export const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
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
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file) => {
  const compressedBase64 = await resizeImage(file);
  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: compressedBase64 }),
  });
  const uploadData = await uploadRes.json();
  if (!uploadData.success) {
    throw new Error(uploadData.message || "Image upload failed");
  }
  return {
    url: uploadData.imageUrl,
    publicId: uploadData.publicId
  };
};