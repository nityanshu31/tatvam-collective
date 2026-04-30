// app/api/sections/route.js (updated with better error handling)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log("Received data:", body); // Debug log
    
    // Get the highest order number
    const lastSection = await Section.findOne().sort({ order: -1 });
    const newOrder = lastSection ? lastSection.order + 1 : 0;
    
    // Create section without the _id field (MongoDB will handle it)
    const sectionData = {
      ...body,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const section = new Section(sectionData);
    await section.save();
    
    return NextResponse.json({
      success: true,
      section
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}