// app/blog/[slug]/page.jsx

import { notFound } from "next/navigation";
import InteractiveBlog from "./InteractiveBlog";
import Blog from "@/models/Blog";

import { connectDB } from "@/lib/db";

async function getBlog(slug) {
  const res = await fetch(
    `/api/blogs/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;
    await connectDB();

  const blog = await Blog.findOne({
    slug,
  });
  if (!blog) {
    notFound();
  }

  const plainBlog = JSON.parse(
  JSON.stringify(blog)
);

  return <InteractiveBlog blog={plainBlog} />;
}