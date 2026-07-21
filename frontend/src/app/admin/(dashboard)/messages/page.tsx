"use client";

import { useEffect, useState } from "react";
import { getContactMessages, markMessageRead, replyToMessage, ContactMessage } from "@/lib/api";

type Conversation = ContactMessage & { replies: ContactMessage[] };

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = () => {
    getContactMessages()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  };

  useEffect(fetchMessages, []);

  const selected = conversations.find((c) => c.id === selectedId);

  const handleSelect = async (conv: Conversation) => {
    setSelectedId(conv.id);
    if (!conv.read) {
      try {
        await markMessageRead(conv.id);
        setConversations((prev) =>
          prev.map((c) => (c.id === conv.id ? { ...c, read: true } : c))
        );
      } catch {}
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId) return;
    setSending(true);
    try {
      const reply = await replyToMessage(selectedId, replyText);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, replies: [...c.replies, reply] }
            : c
        )
      );
      setReplyText("");
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Selected conversation view
  if (selected) {
    const allMessages: any[] = [
      selected,
      ...selected.replies,
    ];

    return (
      <div>
        <button
          onClick={() => setSelectedId(null)}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to conversations
        </button>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{selected.subject || "Message"}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {selected.name} &lt;{selected.email}&gt;
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {allMessages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.isAdmin
                    ? "bg-violet-600 text-white rounded-br-md"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.isAdmin ? "text-violet-200" : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleString()}
                  {msg.isAdmin && " · Admin"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleReply} className="flex gap-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows={2}
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
          />
          <button
            type="submit"
            disabled={sending || !replyText.trim()}
            className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 self-end"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    );
  }

  // Conversation list view
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const replyCount = conv.replies?.length || 0;
            return (
              <button
                key={conv.id}
                onClick={() => handleSelect(conv)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  conv.read
                    ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    : "border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{conv.name}</p>
                      {!conv.read && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                          New
                        </span>
                      )}
                      {replyCount > 0 && (
                        <span className="text-xs text-zinc-400">
                          · {replyCount} reply{replyCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{conv.email}</p>
                    {conv.subject && (
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1 truncate">
                        {conv.subject}
                      </p>
                    )}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 truncate">
                      {conv.message}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                      {new Date(conv.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
