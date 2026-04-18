// app/api/projects/stats/route.js
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    
    const [totalProjects, locationStats] = await Promise.all([
      Project.countDocuments(),
      Project.distinct('location')
    ]);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        citiesCount: locationStats.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}