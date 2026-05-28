import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import AboutPage from "@/models/AboutPage";

export async function GET() {
  try {
    await connectDB();

    const data = await AboutPage.findOne();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Find existing document
    const existing = await AboutPage.findOne();

    // Merge nested visibility safely
    const mergedData = {
      ...(existing?.toObject() || {}),
      ...body,

      // Ensure we preserve existing visibility and studio nested fields
      visibility: {
        ...(existing?.visibility || {}),
        ...(body?.visibility || {}),
      },

      studio: {
        ...(existing?.studio || {}),
        ...(body?.studio || {}),

        // Always ensure yearsExperience exists (prevent accidental removal)
        yearsExperience:
          (body?.studio && body.studio.yearsExperience) ||
          existing?.studio?.yearsExperience ||
          "15+",
      },
    };

    const updated = await AboutPage.findOneAndUpdate(
      {},
      mergedData,
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}