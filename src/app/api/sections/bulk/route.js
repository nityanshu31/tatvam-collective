// app/api/sections/bulk/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";

// POST /api/sections/bulk - Bulk operations
export async function POST(request) {
  try {
    await connectDB();
    const { operations } = await request.json();
    
    const results = [];
    
    for (const op of operations) {
      if (op.action === "updateOrder") {
        const section = await Section.findOneAndUpdate(
          { id: op.id },
          { order: op.order, updatedAt: Date.now() },
          { new: true }
        );
        results.push(section);
      } else if (op.action === "delete") {
        await Section.findOneAndDelete({ id: op.id });
        results.push({ id: op.id, deleted: true });
      } else if (op.action === "toggleVisibility") {
        const section = await Section.findOneAndUpdate(
          { id: op.id },
          { defaultVisible: op.value, updatedAt: Date.now() },
          { new: true }
        );
        results.push(section);
      }
    }
    
    return NextResponse.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error("Error in bulk operation:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}