import Link from "next/link";

export const metadata = {
  title: "Sitemap | Tattvam Collective",
  description: "Explore the sitemap of Tattvam Collective. Find links to our architectural projects, blogs, about section, and contact details.",
};

export default function SitemapPage() {
  const sections = [
    {
      title: "Main Navigation",
      description: "Access our primary pages and explore Tattvam Collective.",
      links: [
        { name: "Home", href: "/", desc: "Homepage of Tattvam Collective featuring highlights and key sections." },
        { name: "Projects", href: "/projects", desc: "Browse our architectural portfolio, projects, and design works." },
        { name: "Blog", href: "/blog", desc: "Read our latest articles, design insights, and updates." },
        { name: "About", href: "/about", desc: "Learn more about our philosophy, architectural studio, and team." },
        { name: "Contact", href: "/contactUs", desc: "Get in touch with us for inquiries, collaborations, and project discussions." },
      ],
    },
    {
      title: "Projects & Portfolio",
      description: "Explore our architectural work categorized by project classifications.",
      links: [
        { name: "All Projects", href: "/projects", desc: "View our entire design and architectural catalog." },
      ],
    },
    
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1b18] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#e8e3da] pb-10 mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif tracking-wide text-[#0f0e0c] font-light mb-4">
            Sitemap
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl font-light leading-relaxed">
            Use this directory map to navigate through Tattvam Collective's architectural portfolio, latest design publications, and studio information.
          </p>
        </div>

        {/* Content Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <div>
                <h2 className="text-xl font-serif text-[#0f0e0c] tracking-wide border-l-2 border-[#c6a77d] pl-3">
                  {section.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1 pl-3 font-light">
                  {section.description}
                </p>
              </div>

              <ul className="space-y-4 pl-3">
                {section.links.map((link) => (
                  <li key={link.href} className="group">
                    <Link
                      href={link.href}
                      className="inline-block text-[#1c1b18] hover:text-[#c6a77d] font-medium transition duration-200"
                    >
                      {link.name} →
                    </Link>
                    {link.desc && (
                      <p className="text-xs text-gray-500 mt-1 font-light group-hover:text-gray-600 transition">
                        {link.desc}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer info/meta */}
        <div className="mt-20 pt-8 border-t border-[#e8e3da] flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 font-light gap-4">
          <p>Tattvam Collective · Architectural Portfolio Sitemap</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
