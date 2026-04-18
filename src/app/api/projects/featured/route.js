// app/api/projects/featured/route.js
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    
    const projects = await Project.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6)
      .lean();
    
    return NextResponse.json({
      success: true,
      projects
    });
    
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured projects' },
      { status: 500 }
    );
  }
}