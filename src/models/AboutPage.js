import mongoose from "mongoose";

const FounderSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  image: String,

  social: {
    linkedin: String,
    email: String,
    twitter: String,
  },

  achievements: [String],
});

const AboutPageSchema = new mongoose.Schema(
  {
    hero: {
      establishedYear: String,
      recognizedYear: String,
      title: String,
      subtitle: String,
      description: String,
    },

    philosophy: {
      tagline: String,
      quote: String,
      description: String,
    },

    studio: {
      tagline: String,
      title: String,
      description: String,

      stats: [
        {
          value: String,
          label: String,
        },
      ],

      testimonial: {
        quote: String,
        author: String,
      },
    },

    workScope: {
      sectors: {
        title: String,
        items: [String],
      },

      approach: {
        title: String,
        items: [String],
      },

      commitment: {
        title: String,
        description: String,
      },
    },

    founders: {
      title: String,
      subtitle: String,
      founders: [FounderSchema],
    },

    cta: {
      title: String,
      subtitle: String,

      buttons: [
        {
          label: String,
          primary: Boolean,
        },
      ],
    },

    visibility: {
      philosophy: {
        type: Boolean,
        default: true,
      },

      studio: {
        type: Boolean,
        default: true,
      },

      founders: {
        type: Boolean,
        default: true,
      },

      cta: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AboutPage ||
  mongoose.model("AboutPage", AboutPageSchema);