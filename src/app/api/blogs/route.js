// app/api/blogs/route.js

import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import {connectDB} from "@/lib/db";

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

    const slug = body.title
      .toLowerCase()
      .replaceAll(" ", "-");

    const blog = await Blog.create({
      ...body,
      slug,
    });

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