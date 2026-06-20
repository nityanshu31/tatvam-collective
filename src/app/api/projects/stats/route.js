// app/api/projects/stats/route.js
import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache responses for 5 minutes
import { connectDB } from "@/lib/db";
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    
    const [totalProjects, locationStats, typeStats] = await Promise.all([
      Project.countDocuments(),
      Project.distinct('location'),
      Project.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
      ])
    ]);

    const typeCounts = { ALL: totalProjects };
    typeStats.forEach(stat => {
      if (stat._id) {
        typeCounts[stat._id] = stat.count;
      }
    });

    const types = typeStats
      .map(stat => stat._id)
      .filter(Boolean)
      .sort();
    
    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        citiesCount: locationStats.length,
        typeCounts,
        types
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