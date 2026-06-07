// app/api/blogs/[id]/route.js

import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";
import { revalidatePath } from 'next/cache';

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    // Basic validation: title, at least one image, and at least one section with heading & content
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.sections) || body.sections.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one section (with heading and content) is required",
        },
        { status: 400 }
      );
    }

    for (const sec of body.sections) {
      if (!sec || !sec.heading || !sec.content || !sec.heading.toString().trim() || !sec.content.toString().trim()) {
        return NextResponse.json(
          { success: false, message: "Each section must have a heading and content" },
          { status: 400 }
        );
      }
    }

    function slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const slug = slugify(body.title);

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

    // revalidate listing
    try {
      revalidatePath('/blog');
    } catch (e) {
      console.warn('revalidatePath failed:', e?.message || e);
    }

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

export async function DELETE(req, context) {
  try {
    await connectDB();

    // Log the whole context to help debug missing params
    console.log("DELETE context:", context);
    console.log("DELETE req.url:", req.url);

    // Try to get id from params, fall back to extracting from URL path
    const resolvedParams = context && context.params ? await context.params : null;
    const idFromParams = resolvedParams && resolvedParams.id;
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const idFromPath = parts[parts.length - 1];
    const id = idFromParams || idFromPath;

    console.log("DELETE blog id (params):", idFromParams);
    console.log("DELETE blog id (path):", idFromPath);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "No id provided in request" },
        { status: 400 }
      );
    }

    const deleted = await Blog.findByIdAndDelete(id);
    console.log("DELETE result:", deleted);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: `Blog not found for id: ${id}` },
        { status: 404 }
      );
    }

    // revalidate listing after delete
    try {
      revalidatePath('/blog');
    } catch (e) {
      console.warn('revalidatePath failed:', e?.message || e);
    }

    return NextResponse.json({
      success: true,
      message: "Blog Deleted",
      deleted,
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}