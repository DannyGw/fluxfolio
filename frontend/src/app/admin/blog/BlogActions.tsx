"use client";

import { useRouter } from "next/navigation";

export default function BlogActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const token = localStorage.getItem("fluxfolio-token");
    try {
      await fetch(`${API_URL}/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
    >
      Delete
    </button>
  );
}
