// app/blog/page.jsx

import Link from "next/link";
import Image from "next/image";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";

async function getBlogs() {
  const res = await fetch(
    `/api/blogs`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function BlogPage() {
 await connectDB();

const blogs = await Blog.find().sort({
  createdAt: -1,
});
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
              Our Blog
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#E5E7EB] leading-relaxed">
              Insights, perspectives, and stories from our practice
            </p>
            <div className="w-20 h-1 bg-[#C6A77D] mx-auto mt-6 sm:mt-8"></div>
          </div>
        </div>
      </div>

      {/* Blog Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {blogs.length === 0 ? (
          // Empty State
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-[#6B7280] mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-[#111111] mb-2">
                No blogs yet
              </h3>
              <p className="text-[#6B7280]">
                Check back soon for new content!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Blog (First blog) */}
            {blogs.length > 0 && (
              <Link href={`/blog/${blogs[0].slug}`} className="block group mb-12 sm:mb-16">
                <div className="relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative h-64 sm:h-80 lg:h-full overflow-hidden bg-[#E5E7EB]">
                      {blogs[0].images?.[0] ? (
                        <img
                          src={blogs[0].images[0]}
                          alt={blogs[0].title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-[#6B7280]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#C6A77D] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Featured Post</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mb-4 group-hover:text-[#C6A77D] transition-colors duration-300">
                        {blogs[0].title}
                      </h2>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="text-sm text-[#6B7280] flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {blogs[0].images?.length || 0} images
                        </span>
                        <span className="text-sm text-[#6B7280] flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                          {blogs[0].sections?.length || 0} sections
                        </span>
                      </div>
                      <div className="mt-6">
                        <span className="inline-flex items-center gap-2 text-[#C6A77D] font-semibold group-hover:gap-3 transition-all duration-300">
                          Read More
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining Blogs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.slice(1).map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-52 sm:h-56 overflow-hidden bg-[#E5E7EB]">
                      {blog.images?.[0] ? (
                        <img
                          src={blog.images[0]}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-[#6B7280]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-[#111111] mb-3 line-clamp-2 group-hover:text-[#C6A77D] transition-colors duration-300">
                        {blog.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-3 text-xs text-[#6B7280] mb-4">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {blog.images?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                          {blog.sections?.length || 0}
                        </span>
                      </div>

                      <div className="mt-auto pt-4">
                        <span className="inline-flex items-center gap-1 text-[#C6A77D] text-sm font-semibold group-hover:gap-2 transition-all duration-300">
                          Read More
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

    
     
    </div>
  );
}