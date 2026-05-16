import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import AboutPage from "@/models/AboutPage";

export async function GET() {
  try {
    await connectDB();

    const existing = await AboutPage.findOne();

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "About page already seeded",
      });
    }

    const data = {
      hero: {
        establishedYear: "2025",
        recognizedYear: "2017",
        title: "About Us",
        subtitle: "TATTVAM COLLECTIVE",
        description:
          "Multidisciplinary design and consulting practice based in Vadodara, working across architecture, interior design, urban planning, and construction.",
      },

      philosophy: {
        tagline: "OUR PHILOSOPHY",
        quote:
          "Every space holds a Tatva — an intrinsic essence that defines its purpose, experience, and identity.",
        description:
          "At Tatvam Collective, design is a deliberate synthesis of space, function, material, and human experience.",
      },

      studio: {
        tagline: "The Studio",
        title: "Led by a duo of architects",
        description:
          "The studio delivers context-driven solutions that balance aesthetic clarity with technical precision.",

        stats: [
          { value: "50+", label: "Projects Delivered" },
          { value: "8+", label: "Years of Excellence" },
          { value: "Pan-India", label: "Presence" },
          { value: "24/7", label: "Client Support" },
        ],

        testimonial: {
          quote:
            "We aim to craft spaces that resonate with the people who inhabit them.",
          author: "— Founding Principals, Tattvam Collective",
        },
      },

      workScope: {
        sectors: {
          title: "Fields of Practice",

          items: [
            "Residential Architecture",
            "Commercial Architecture",
            "Institutional Design",
          ],
        },

        approach: {
          title: "How We Work",

          items: [
            "Context-driven solutions",
            "Technical precision",
            "Integrated consultancy",
          ],
        },

        commitment: {
          title: "Studio Ethos",

          description:
            "Seamless concept-to-key experience built on clarity and integrity.",
        },
      },

      founders: {
        title: "Meet the Founders",

        subtitle:
          "A visionary duo shaping spaces with purpose and precision.",

        founders: [
          {
            name: "Founder 1",
            role: "Principal Architect",

            bio: "Founder bio here",

            image: "/founder-1.jpg",

            social: {
              linkedin: "",
              email: "",
              twitter: "",
            },

            achievements: [
              "Award 1",
              "Award 2",
            ],
          },
        ],
      },

      cta: {
        title: "Ready to craft your Tatva?",

        subtitle:
          "Let's collaborate to create spaces that inspire.",

        buttons: [
          {
            label: "Start a Project",
            primary: true,
          },
        ],
      },

      visibility: {
        philosophy: true,
        studio: true,
        founders: true,
        cta: true,
      },
    };

    await AboutPage.create(data);

    return NextResponse.json({
      success: true,
      message: "About page seeded successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}