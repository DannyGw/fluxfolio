"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { updateProfile, uploadImage, uploadResume } from "@/lib/api";

type Props = {
  initial: {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatarUrl: string | null;
    resumeUrl: string | null;
    email: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    website: string | null;
    skills: string[];
  };
};

export default function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name,
    title: initial.title,
    bio: initial.bio,
    avatarUrl: initial.avatarUrl || "",
    resumeUrl: initial.resumeUrl || "",
    email: initial.email || "",
    github: initial.github || "",
    linkedin: initial.linkedin || "",
    twitter: initial.twitter || "",
    website: initial.website || "",
    skills: initial.skills.join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(initial.id, {
        ...form,
        avatarUrl: form.avatarUrl || null,
        resumeUrl: form.resumeUrl || null,
        email: form.email || null,
        github: form.github || null,
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
        website: form.website || null,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      router.refresh();
      alert("Profile updated!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const [resumeUploading, setResumeUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setForm({ ...form, avatarUrl: result.url });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    try {
      const result = await uploadResume(file);
      setForm({ ...form, resumeUrl: result.url });
    } catch (error) {
      console.error("Resume upload failed:", error);
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        </div>
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        </div>
      </div>

      <div>
        <Label>Bio (Markdown)</Label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={8}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />
      </div>

      <div>
        <Label>Skills (comma separated)</Label>
        <Input value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} placeholder="React, Node.js, TypeScript" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Avatar URL</Label>
          <Input value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />
        </div>
        <div>
          <Label>Or Upload Avatar</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
          />
          {uploading && <p className="text-sm text-violet-600 mt-1">Uploading...</p>}
        </div>
        <div>
          <Label>Resume URL</Label>
          <Input value={form.resumeUrl} onChange={(v) => setForm({ ...form, resumeUrl: v })} placeholder="https://..." />
        </div>
        <div>
          <Label>Or Upload Resume (PDF)</Label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
          />
          {resumeUploading && <p className="text-sm text-violet-600 mt-1">Uploading...</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        </div>
        <div>
          <Label>Website</Label>
          <Input value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
        </div>
        <div>
          <Label>GitHub</Label>
          <Input value={form.github} onChange={(v) => setForm({ ...form, github: v })} placeholder="https://github.com/username" />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <Input value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
        </div>
        <div>
          <Label>Twitter</Label>
          <Input value={form.twitter} onChange={(v) => setForm({ ...form, twitter: v })} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
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
