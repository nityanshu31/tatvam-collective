// app/blog/[slug]/InteractiveBlog.jsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InteractiveBlog({ blog }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  // Get all images except the first one (which is the cover)
  const galleryImages = blog.images?.slice(1) || [];

  return (
    <>
      {/* Hero Section - Modern Minimal */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {blog.images?.[0] && (
          <>
            <div className="absolute inset-0">
              <img
                src={blog.images[0]}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white"></div>
            </div>
          </>
        )}
        
        {/* Hero Content */}
        <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm uppercase tracking-wider mb-8 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blogs
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.2] tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{blog.images?.length || 0} Images</span>
            </div>
            <span className="w-1 h-1 bg-[#C6A77D] rounded-full"></span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <article className="bg-white">
        {/* Image Gallery - Modern Grid Layout */}
        {galleryImages.length > 0 && (
          <div className="border-b border-[#E5E7EB]">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
              {galleryImages.length === 1 ? (
                // Single image - full width
                <div className="max-w-4xl mx-auto">
                  <div className="relative group overflow-hidden rounded-2xl">
                    <img
                      src={galleryImages[0]}
                      alt="Gallery image"
                      className="w-full h-auto rounded-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ) : galleryImages.length === 2 ? (
                // Two images - side by side
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                  {galleryImages.map((image, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-2xl">
                      <img
                        src={image}
                        alt={`Gallery image ${idx + 1}`}
                        className="w-full h-[400px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              ) : (
                // Three or more images - masonry style grid
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image, idx) => (
                      <div key={idx} className={`relative group overflow-hidden rounded-2xl ${
                        idx === 0 ? 'lg:row-span-2' : ''
                      }`}>
                        <img
                          src={image}
                          alt={`Gallery image ${idx + 1}`}
                          className={`w-full ${idx === 0 ? 'h-[500px]' : 'h-[300px]'} object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Sections - Clean Typography */}
        <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-[#C6A77D] z-50" 
               style={{ width: `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%` }} />
          
          <div className="space-y-12 lg:space-y-16">
            {blog.sections?.map((section, index) => (
              <section key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Section Heading */}
                {section.heading && (
                  <div className="mb-6 lg:mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-px bg-[#C6A77D]"></div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#111111] leading-tight tracking-tight">
                      {section.heading}
                    </h2>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg prose-gray max-w-none">
                  {section.content.split('\n').map((paragraph, paraIndex) => (
                    paragraph.trim() && (
                      <p key={paraIndex} className="text-[#374151] leading-relaxed mb-6 text-lg font-light">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>

                {/* Elegant Divider */}
                {index < blog.sections.length - 1 && (
                  <div className="my-12 lg:my-16">
                    <div className="flex justify-center">
                      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C6A77D] to-transparent"></div>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Signature Line */}
          <div className="mt-16 pt-8 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#C6A77D]"></div>
              <p className="text-sm text-[#6B7280] italic">Thank you for reading</p>
            </div>
          </div>
        </div>

        {/* Footer Actions - Modern Minimal */}
        <div className="border-t border-[#E5E7EB] bg-[#FAFAFA]">
          <div className="max-w-3xl mx-auto px-6 py-8 lg:py-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              {/* Share Section */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#6B7280] font-medium">Share</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-full hover:bg-black/5 transition-all duration-300 text-[#6B7280] hover:text-[#111111]"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.38.1-.78.16-1.2.16-.3 0-.58-.03-.87-.08.58 1.82 2.27 3.15 4.28 3.18-1.56 1.22-3.54 1.95-5.68 1.95-.37 0-.74-.02-1.1-.06 2.04 1.3 4.46 2.06 7.06 2.06 8.47 0 13.1-7 13.1-13.1 0-.2 0-.4-.02-.6.9-.63 1.68-1.42 2.3-2.32z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="p-2 rounded-full hover:bg-black/5 transition-all duration-300 text-[#6B7280] hover:text-[#111111]"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.98 0 1.771-.773 1.771-1.729V1.729C24 .774 23.203 0 22.225 0z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Back to Top */}
              <button 
                onClick={scrollToTop}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#C6A77D] transition-colors group"
              >
                <span>Back to top</span>
                <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Browse More Articles */}
        <div className="bg-[#111111] text-white">
          <div className="max-w-3xl mx-auto px-6 py-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-3 group"
            >
              <span className="text-sm uppercase tracking-wider">Browse All Articles</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}