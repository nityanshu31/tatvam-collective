// app/blog/[slug]/page.jsx

import { notFound } from "next/navigation";
import InteractiveBlog from "./InteractiveBlog";

async function getBlog(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`,
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
  const data = await getBlog(slug);
  const blog = data?.blog;

  if (!blog) {
    notFound();
  }

  return <InteractiveBlog blog={blog} />;
}