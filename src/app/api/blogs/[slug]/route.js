// app/api/blogs/[slug]/route.js

import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug: rawSlug } = await params;

    // decode the slug in case it was encoded in the URL
    const slug = decodeURIComponent(rawSlug);

    console.log("slug:", slug);

    const blog = await Blog.findOne({ slug });

    console.log("blog:", blog);

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