import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
};

async function getPost(slug: string): Promise<BlogPost | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{post.title}</h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none border-t border-zinc-200 dark:border-zinc-800 pt-8">
          {post.content.split("\n").map((line, i) => {
            const t = line.trim();
            if (!t) return <br key={i} />;
            if (t.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold mt-8 mb-3 text-zinc-900 dark:text-zinc-100">{t.replace("### ", "")}</h3>;
            if (t.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-zinc-900 dark:text-zinc-100">{t.replace("## ", "")}</h2>;
            if (t.startsWith("1. ") || t.startsWith("2. ") || t.startsWith("3. ")) return <li key={i} className="text-zinc-600 dark:text-zinc-400 ml-4 list-decimal">{t.replace(/^\d+\.\s/, "")}</li>;
            if (t.startsWith("- ")) return <li key={i} className="text-zinc-600 dark:text-zinc-400 ml-4 list-disc">{t.replace("- ", "")}</li>;
            if (t.startsWith("**") && t.endsWith("**")) return <p key={i} className="font-semibold text-zinc-900 dark:text-zinc-100 mt-4">{t.replace(/\*\*/g, "")}</p>;
            return <p key={i} className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">{t}</p>;
          })}
        </div>
      </div>
    </article>
  );
}
