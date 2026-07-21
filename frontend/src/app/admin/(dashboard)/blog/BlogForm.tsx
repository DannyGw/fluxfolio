"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { createBlogPost, updateBlogPost } from "@/lib/api";

type Props = {
  initial?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl?: string | null;
    tags: string[];
    published: boolean;
  };
};

export default function BlogForm({ initial }: Props) {
  const router = useRouter();
  const isEditing = !!initial;

  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    imageUrl: initial?.imageUrl || "",
    tags: initial?.tags.join(", ") || "",
    published: initial?.published || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...form,
      imageUrl: form.imageUrl || null,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await updateBlogPost(initial!.id, data);
      } else {
        await createBlogPost(data);
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required placeholder="my-post" />
        </div>
      </div>

      <div>
        <Label>Excerpt</Label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          required
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>

      <div>
        <Label>Content (Markdown)</Label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={12}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>

      <div>
        <Label>Image URL</Label>
        <Input value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="https://example.com/image.jpg" />
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="Next.js, React, TypeScript" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-violet-600 focus:ring-violet-500"
        />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Published</span>
      </label>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-6 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{children}</label>;
}

function Input({ value, onChange, placeholder, required }: { value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
    />
  );
}
