// app/api/sections/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";

// GET /api/sections/:id
export async function GET(request, { params }) {
  try {
    await connectDB();
    const section = await Section.findOne({ id: params.id });
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, section });
    
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/sections/:id
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    
    const section = await Section.findOneAndUpdate(
      { id: params.id },
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, section });
    
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/sections/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const section = await Section.findOneAndDelete({ id: params.id });
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/sections/:id - Update specific fields
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { action, value } = await request.json();
    
    let updateData = {};
    
    if (action === "toggleVisibility") {
      updateData = { defaultVisible: value };
    } else if (action === "updateOrder") {
      updateData = { order: value };
    } else if (action === "toggleActive") {
      updateData = { isActive: value };
    }
    
    const section = await Section.findOneAndUpdate(
      { id: params.id },
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, section });
    
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}