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

    const updated = await AboutPage.findOneAndUpdate(
      {},
      body,
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