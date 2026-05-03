// app/api/sections/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";

// DELETE - Delete a section
export async function DELETE(request, { params }) {
  try {
    // IMPORTANT: The folder name [id] makes the parameter available as params.id
    const id = params.id;
    
    console.log("DELETE - Received ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "No section ID provided" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Delete by the custom 'id' field
    const deletedSection = await Section.findOneAndDelete({ id: id });
    
    if (!deletedSection) {
      return NextResponse.json(
        { success: false, error: `Section not found with id: ${id}` },
        { status: 404 }
      );
    }
    
    console.log("DELETE - Successfully deleted:", deletedSection.title);
    
    return NextResponse.json({ 
      success: true, 
      message: "Section deleted successfully",
      section: deletedSection
    });
    
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (for toggling visibility)
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    
    console.log("PATCH - Received ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "No section ID provided" },
        { status: 400 }
      );
    }
    
    await connectDB();
    const body = await request.json();
    const { action, value } = body;
    
    console.log("PATCH - Action:", action, "Value:", value);
    
    let updateData = { updatedAt: new Date() };
    
    if (action === "toggleVisibility") {
      updateData.defaultVisible = value;
    } else if (action === "toggleActive") {
      updateData.isActive = value;
    } else if (action === "updateOrder") {
      updateData.order = value;
    } else {
      // If no specific action, update with the entire body
      Object.assign(updateData, body);
    }
    
    const updatedSection = await Section.findOneAndUpdate(
      { id: id },
      updateData,
      { new: true }
    );
    
    if (!updatedSection) {
      return NextResponse.json(
        { success: false, error: `Section not found with id: ${id}` },
        { status: 404 }
      );
    }
    
    console.log("PATCH - Successfully updated:", updatedSection.title);
    
    return NextResponse.json({ 
      success: true, 
      section: updatedSection 
    });
    
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Full update
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    
    console.log("PUT - Received ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "No section ID provided" },
        { status: 400 }
      );
    }
    
    await connectDB();
    const body = await request.json();
    
    const updatedSection = await Section.findOneAndUpdate(
      { id: id },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedSection) {
      return NextResponse.json(
        { success: false, error: `Section not found with id: ${id}` },
        { status: 404 }
      );
    }
    
    console.log("PUT - Successfully updated:", updatedSection.title);
    
    return NextResponse.json({ 
      success: true, 
      section: updatedSection 
    });
    
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Get a single section
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "No section ID provided" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const section = await Section.findOne({ id: id });
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: `Section not found with id: ${id}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, section });
    
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}