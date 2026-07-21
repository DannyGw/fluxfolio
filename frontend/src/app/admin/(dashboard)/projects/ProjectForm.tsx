"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { createProject, updateProject, uploadImage } from "@/lib/api";

type Props = {
  initial?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    techStack: string[];
    imageUrl: string;
    liveUrl: string;
    repoUrl: string;
    featured: boolean;
    order: number;
  };
};

export default function ProjectForm({ initial }: Props) {
  const router = useRouter();
  const isEditing = !!initial;

  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    content: initial?.content || "",
    techStack: initial?.techStack.join(", ") || "",
    imageUrl: initial?.imageUrl || "",
    liveUrl: initial?.liveUrl || "",
    repoUrl: initial?.repoUrl || "",
    featured: initial?.featured || false,
    order: initial?.order || 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...form,
      techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      order: Number(form.order),
    };

    try {
      if (isEditing) {
        await updateProject(initial!.id, data);
      } else {
        await createProject(data);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setForm({ ...form, imageUrl: result.url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
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
          <Input value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required placeholder="my-project" />
        </div>
        <div>
          <Label>Order</Label>
          <Input type="number" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) })} />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>

      <div>
        <Label>Content (Markdown)</Label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={8}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>

      <div>
        <Label>Tech Stack (comma separated)</Label>
        <Input value={form.techStack} onChange={(v) => setForm({ ...form, techStack: v })} placeholder="React, Node.js, PostgreSQL" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Image URL</Label>
          <Input value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="https://..." />
        </div>
        <div>
          <Label>Or Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
          />
          {uploading && <p className="text-sm text-violet-600 mt-1">Uploading...</p>}
        </div>
        <div>
          <Label>Live URL</Label>
          <Input value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} />
        </div>
        <div>
          <Label>Repo URL</Label>
          <Input value={form.repoUrl} onChange={(v) => setForm({ ...form, repoUrl: v })} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-violet-600 focus:ring-violet-500"
        />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Featured project</span>
      </label>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
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

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
    />
  );
}
