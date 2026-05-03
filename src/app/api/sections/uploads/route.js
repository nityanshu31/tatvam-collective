// app/api/sections/upload/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "smart-sections",
      transformation: [
        { width: 800, height: 600, crop: "fill" }
      ]
    });
    
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
    
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/sections/upload - Delete image from Cloudinary
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Try query first
    let publicId = searchParams.get("publicId");

    // If not in query, try JSON body (some clients send JSON in DELETE)
    if (!publicId) {
      try {
        const body = await request.json().catch(() => null);
        publicId = body?.publicId || body?.public_id;
      } catch (e) {
        // ignore
      }
    }

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "No publicId provided" },
        { status: 400 }
      );
    }
    
    await cloudinary.uploader.destroy(publicId);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}