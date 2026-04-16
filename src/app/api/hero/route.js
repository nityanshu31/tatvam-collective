import { connectDB } from "@/lib/db";
import Hero from "@/models/Hero";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  await connectDB();

  const hero = await Hero.findOne();

  return Response.json(hero);
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { title, subtitle, imageUrl, imagePublicId } = body;

    const existingHero = await Hero.findOne();

    // Delete old Cloudinary image if replacing
    if (
      existingHero?.imagePublicId &&
      existingHero.imagePublicId !== imagePublicId
    ) {
      await cloudinary.uploader.destroy(existingHero.imagePublicId);
    }

    const updatedHero = await Hero.findOneAndUpdate(
      {},
      {
        title,
        subtitle,
        imageUrl,
        imagePublicId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return Response.json({
      success: true,
      hero: updatedHero,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}