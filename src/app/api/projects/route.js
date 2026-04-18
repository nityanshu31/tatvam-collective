// app/api/projects/route.js
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Project from '@/models/Project';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const featured = searchParams.get('featured');
    
    if (type) query.type = type;
    if (location) query.location = location;
    if (featured) query.featured = featured === 'true';
    
    // Execute query
    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Project.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasMore: skip + projects.length < total
      }
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('Creating project with data:', body);
    
    // Validate required fields
    const requiredFields = ['title', 'location', 'image', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create project with all fields
    const projectData = {
      title: body.title,
      location: body.location,
      image: body.image,
      year: body.year || new Date().getFullYear().toString(),
      area: body.area || 'N/A',
      type: body.type || 'Residential',
      category: body.category || 'Contemporary',
      status: body.status || 'Completed',
      description: body.description,
      featured: body.featured || false,
      order: body.order || 0,
      imagePublicId: body.imagePublicId || '',
      gallery: body.gallery || [],
      galleryPublicIds: body.galleryPublicIds || []
    };
    
    const project = await Project.create(projectData);
    
    console.log('Project created successfully:', project._id);
    
    return NextResponse.json({
      success: true,
      project
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A project with this title already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}