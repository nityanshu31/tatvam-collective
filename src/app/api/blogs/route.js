// app/api/blogs/route.js

import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();

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

    // create a safe slug: lowercase, replace non-alphanumerics with hyphens,
    // collapse multiple hyphens and trim leading/trailing hyphens
    function slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const slug = slugify(body.title);

    const blog = await Blog.create({
      ...body,
      slug,
    });

    // revalidate the blog listing so production prerender is refreshed
    try {
      revalidatePath('/blog');
    } catch (e) {
      console.warn('revalidatePath failed:', e?.message || e);
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}