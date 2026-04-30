// data/smartSectionsData.js

export const mockSections = [
  {
    id: "hiring-frontend",
    title: "Frontend Developer Wanted",
    description: "Join our creative team! We're looking for a passionate frontend developer with React and Next.js experience. Remote work available, competitive salary, and great benefits.",
    type: "hiring",
    priority: "high",
    defaultVisible: true,
    badges: ["Urgent Hiring", "Remote", "Full-time"],
    cta: {
      text: "Apply Now →",
      link: "/careers/frontend-dev",
      onClick: () => console.log("Apply clicked")
    },
    media: {
      type: "carousel",
      images: [
        "https://picsum.photos/id/20/800/600", // Office
        "https://picsum.photos/id/26/800/600", // Team
        "https://picsum.photos/id/91/800/600"  // Work space
      ],
      autoplay: true,
      interval: 4000
    },
    stats: {
      "Openings": "3",
      "Experience": "2-5 yrs",
      "Location": "Remote"
    },
    expiryDate: "2026-06-30"
  },
  {
    id: "promotion-summer",
    title: "Summer Sale - 30% Off",
    description: "Get 30% off on all architectural consultation services. Limited time offer! Use code SUMMER30 at checkout. Don't miss out on this amazing opportunity to work with our top architects.",
    type: "promotion",
    priority: "high",
    defaultVisible: true,
    badges: ["Limited Time", "Hot Deal", "30% OFF"],
    cta: {
      text: "Claim Offer →",
      link: "/promotions/summer-sale",
      onClick: () => console.log("Promotion clicked")
    },
    media: {
      type: "carousel",
      images: [
        "https://picsum.photos/id/15/800/600",
        "https://picsum.photos/id/42/800/600",
        "https://picsum.photos/id/58/800/600"
      ],
      autoplay: true,
      interval: 3000
    },
    expiryDate: "2026-05-15"
  },
  {
    id: "notification-update",
    title: "Platform Update v3.0",
    description: "We've launched new features including 3D visualization tools, real-time collaboration, and enhanced project management. Check out what's new!",
    type: "notification",
    priority: "medium",
    defaultVisible: true,
    badges: ["New", "Feature Update"],
    cta: {
      text: "See What's New →",
      link: "/updates/v3.0",
      onClick: () => console.log("Update clicked")
    },
    media: {
      type: "image",
      images: ["https://picsum.photos/id/0/800/600"]
    },
    expandable: true
  },
  {
    id: "dashboard-stats",
    title: "Project Analytics",
    description: "Your projects are performing exceptionally well this quarter. Total leads increased by 45% compared to last month.",
    type: "dashboard",
    priority: "medium",
    defaultVisible: true,
    badges: ["Live Data", "Updated Daily"],
    stats: {
      "Projects": "24",
      "Active": "18",
      "Completed": "6",
      "Clients": "12"
    },
    media: {
      type: "image",
      images: ["https://picsum.photos/id/166/800/600"]
    }
  },
  {
    id: "event-webinar",
    title: "Free Webinar: Modern Architecture Trends",
    description: "Join our exclusive webinar with industry experts discussing sustainable design, smart homes, and future trends. Limited seats available!",
    type: "promotion",
    priority: "low",
    defaultVisible: true,
    badges: ["Free", "Limited Seats", "Expert Speakers"],
    cta: {
      text: "Register Now →",
      link: "/events/webinar",
      onClick: () => console.log("Webinar clicked")
    },
    media: {
      type: "carousel",
      images: [
        "https://picsum.photos/id/29/800/600",
        "https://picsum.photos/id/96/800/600"
      ],
      autoplay: false
    },
    expiryDate: "2026-05-20"
  },
  {
    id: "award-announcement",
    title: "We Won! Best Architecture Firm 2026",
    description: "Thank you for your continued support. We're honored to receive this recognition and will continue delivering excellence.",
    type: "notification",
    priority: "high",
    defaultVisible: true,
    badges: ["Award Winner", "Milestone"],
    media: {
      type: "carousel",
      images: [
        "https://picsum.photos/id/104/800/600",
        "https://picsum.photos/id/106/800/600",
        "https://picsum.photos/id/108/800/600"
      ],
      autoplay: true,
      interval: 5000
    }
  }
];

// Different configurations examples
export const sectionConfigs = {
  homepage: {
    allowUserToggle: true,
    defaultVisibleSections: "all",
    layoutType: "auto"
  },
  dashboard: {
    allowUserToggle: false,
    defaultVisibleSections: ["dashboard-stats", "notification-update"],
    layoutType: "priority"
  },
  marketing: {
    allowUserToggle: false,
    defaultVisibleSections: ["promotion-summer", "event-webinar"],
    layoutType: "equal"
  }
};