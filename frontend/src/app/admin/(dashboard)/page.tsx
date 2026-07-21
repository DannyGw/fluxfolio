"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProjects, getProfile, getContactMessages } from "@/lib/api";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects().catch(() => []),
      getProfile().catch(() => null),
      getContactMessages().catch(() => []),
    ])
      .then(([p, pr, m]) => {
        setProjects(p);
        setProfile(pr);
        setMessages(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadMessages = messages.filter((m: any) => !m.read).length;

  const stats = [
    { label: "Projects", value: loading ? "..." : projects.length, href: "/admin/projects", color: "text-violet-600" },
    { label: "Unread Messages", value: loading ? "..." : unreadMessages, href: "/admin/messages", color: "text-amber-600" },
    { label: "Skills", value: loading ? "..." : profile?.skills?.length || 0, href: "/admin/profile", color: "text-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg hover:shadow-violet-500/5 transition-all"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard href="/admin/projects/new" label="New Project" desc="Add a project to showcase" />
        <ActionCard href="/admin/projects" label="Manage Projects" desc="Edit or delete projects" />
        <ActionCard href="/admin/blog" label="Blog Posts" desc="Write and manage posts" />
        <ActionCard href="/admin/messages" label="View Messages" desc={`${unreadMessages} unread`} />
        <ActionCard href="/admin/profile" label="Edit Profile" desc="Update your info and skills" />
      </div>
    </div>
  );
}

function ActionCard({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-violet-300 dark:hover:border-violet-700 transition-all group"
    >
      <p className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
        {label}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{desc}</p>
    </Link>
  );
}
