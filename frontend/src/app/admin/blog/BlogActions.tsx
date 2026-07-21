"use client";

import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/lib/api";

export default function BlogActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteBlogPost(id);
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
