// app/api/sections/bulk/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";

export async function POST(request) {
  try {
    await connectDB();
    const { operations } = await request.json();

    console.log("Bulk operations:", operations);

    const results = [];

    for (const op of operations) {
      if (op.action === "updateOrder") {
        const section = await Section.findOneAndUpdate(
          { id: op.id },
          { order: Number(op.order), updatedAt: new Date() },
          { new: true }
        );
        results.push(section || { id: op.id, notFound: true });
      } else if (op.action === "delete") {
        const deleted = await Section.findOneAndDelete({ id: op.id });
        results.push(deleted ? { id: op.id, deleted: true } : { id: op.id, notFound: true });
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