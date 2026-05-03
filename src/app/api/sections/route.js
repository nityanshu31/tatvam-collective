// app/api/sections/route.js 
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";

// GET /api/sections
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const showExpired = searchParams.get("showExpired") === "true";
    const adminView = searchParams.get("admin") === "true";
    
    let query = {};
    
    if (!adminView) {
      query.isActive = true;
    }
    
    if (type && type !== "ALL") {
      query.type = type;
    }
    
    if (!showExpired && !adminView) {
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ];
    }
    
    const sections = await Section.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      sections: sections,
      total: sections.length
    });
    
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        sections: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

// POST /api/sections
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const lastSection = await Section.findOne().sort({ order: -1 });
    const newOrder = lastSection ? lastSection.order + 1 : 0;
    
    const section = new Section({
      ...body,
      order: newOrder,
      isActive: body.isActive !== undefined ? body.isActive : true,
      defaultVisible: body.defaultVisible !== undefined ? body.defaultVisible : true
    });
    
    await section.save();
    
    return NextResponse.json({
      success: true,
      section
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/sections - Delete by query parameter
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    console.log("DELETE - Received ID from query:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "No section ID provided" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const deletedSection = await Section.findOneAndDelete({ id: id });
    
    if (!deletedSection) {
      return NextResponse.json(
        { success: false, error: `Section not found with id: ${id}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Section deleted successfully"
    });
    
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/sections - Update by query parameter
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    console.log("PATCH - Received ID from query:", id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "No section ID provided" },
        { status: 400 }
      );
    }
    
    await connectDB();
    const body = await request.json();
    const { action, value } = body;
    
    let updateData = { updatedAt: new Date() };
    
    if (action === "toggleVisibility") {
      updateData.defaultVisible = value;
    } else if (action === "toggleActive") {
      updateData.isActive = value;
    } else if (action === "updateOrder") {
      updateData.order = value;
    } else {
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

// PUT /api/sections - Update by query parameter
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    console.log("PUT - Received ID from query:", id);
    
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