import { getContactMessages } from "@/lib/api";
import MessageActions from "./MessageActions";

export default async function AdminMessagesPage() {
  let messages: any[] = [];
  try {
    messages = await getContactMessages();
  } catch (error) {
    console.error("Failed to fetch messages:", error);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Messages</h1>

      {messages.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border ${
                msg.read
                  ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  : "border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{msg.name}</p>
                    {!msg.read && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{msg.email}</p>
                  {msg.subject && (
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1">{msg.subject}</p>
                  )}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <MessageActions id={msg.id} read={msg.read} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
