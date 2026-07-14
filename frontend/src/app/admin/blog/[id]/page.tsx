import BlogForm from "../BlogForm";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
};

type Props = { params: Promise<{ id: string }> };

async function getPost(id: string): Promise<BlogPost | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const res = await fetch(`${API_URL}/blog/all`, { cache: "no-store" });
    if (!res.ok) return null;
    const posts: BlogPost[] = await res.json();
    return posts.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

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
