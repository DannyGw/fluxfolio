import Link from "next/link";
import type { Metadata } from "next";
import { getProjects, getProfile } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on development, design, and technology.",
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  tags: string[];
  createdAt: string;
};

async function getBlogPosts(): Promise<BlogPost[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const res = await fetch(`${API_URL}/blog`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Blog</h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Thoughts on development, design, and technology.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
            <p>No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:shadow-violet-500/5 transition-all"
              >
                <div className="flex items-start gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 line-clamp-2">{post.excerpt}</p>
                <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
