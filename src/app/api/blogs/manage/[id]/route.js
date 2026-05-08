// app/api/blogs/[id]/route.js

import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const slug = body.title
      .toLowerCase()
      .replaceAll(" ", "-");

    const updatedBlog =
      await Blog.findByIdAndUpdate(
        id,
        {
          ...body,
          slug,
        },
        {
          new: true,
        }
      );

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

export async function DELETE(
  req,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Blog Deleted",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}