import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
};

async function getPosts(): Promise<BlogPost[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const res = await fetch(`${API_URL}/blog/all`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

import BlogActions from "./BlogActions";

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
          <p>No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{post.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                {post.published ? (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Published
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    Draft
                  </span>
                )}
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Edit
                </Link>
                <BlogActions id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
