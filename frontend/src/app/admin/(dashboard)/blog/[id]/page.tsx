"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPost, BlogPost } from "@/lib/api";
import BlogForm from "../BlogForm";

export default function EditBlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Edit &quot;{post.title}&quot;</h1>
      <BlogForm initial={post} />
    </div>
  );
}
