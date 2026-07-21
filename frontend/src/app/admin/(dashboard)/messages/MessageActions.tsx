"use client";

import { useRouter } from "next/navigation";
import { markMessageRead, deleteMessage } from "@/lib/api";

export default function MessageActions({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();

  const handleMarkRead = async () => {
    try {
      await markMessageRead(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      {!read && (
        <button
          onClick={handleMarkRead}
          className="px-3 py-1.5 text-sm font-medium rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
        >
          Mark read
        </button>
      )}
      <button
        onClick={handleDelete}
        className="px-3 py-1.5 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
