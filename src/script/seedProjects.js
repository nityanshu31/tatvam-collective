// scripts/seed-projects.js
import { connectDB } from "@/lib/db";
import Project from '../models/Project';

const sampleProjects = [
  {
    title: "Contemporary House",
    location: "Surat",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    year: "2024",
    area: "520 m²",
    type: "Residential",
    description: "A contemporary family home that balances privacy with openness...",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    order: 1
  }
  // Add more projects...
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Project.deleteMany({});
    console.log('Cleared existing projects');
    
    // Insert new data
    const projects = await Project.insertMany(sampleProjects);
    console.log(`Seeded ${projects.length} projects`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();