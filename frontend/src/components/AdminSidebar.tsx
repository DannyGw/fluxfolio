"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getContactMessages } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/projects", label: "Projects", icon: "project" },
  { href: "/admin/blog", label: "Blog", icon: "blog" },
  { href: "/admin/messages", label: "Messages", icon: "message", badge: true },
  { href: "/admin/profile", label: "Profile", icon: "profile" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Play notification sound using Web Audio API
  const playNotification = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not available — silently skip
    }
  };

  // Show browser notification
  const showNotification = (count: number) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("FluxFolio", {
        body: `${count} new message${count > 1 ? "s" : ""} received`,
        icon: "/favicon.ico",
      });
    }
  };

  useEffect(() => {
    // Request notification permission on mount
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    let prevCount = 0;

    const fetchUnread = async () => {
      try {
        const messages = await getContactMessages();
        const count = messages.filter((m: any) => !m.read).length;
        setUnreadCount(count);

        if (count > prevCount && prevCount > 0) {
          playNotification();
          showNotification(count - prevCount);
        }
        prevCount = count;
      } catch {
        // Not authenticated yet — ignore
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="hidden sm:flex flex-col w-64 min-h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sticky top-0">
      <Link href="/admin" className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent mb-8">
        FluxFolio Admin
      </Link>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              {item.icon === "home" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )}
              {item.icon === "project" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )}
              {item.icon === "blog" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              )}
              {item.icon === "message" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {item.icon === "profile" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {item.label}
              {item.badge && unreadCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 text-xs font-bold rounded-full bg-violet-600 text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to site
        </Link>
      </div>
    </aside>
  );
}
