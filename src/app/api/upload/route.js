import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();

    const { image } = body;

    if (!image) {
      return Response.json(
        { success: false, message: "No image provided" },
        { status: 400 }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "tatvam-collective",
    });

    return Response.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}