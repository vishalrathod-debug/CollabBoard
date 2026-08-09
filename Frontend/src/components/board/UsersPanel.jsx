import { MessageCircle, Send, Users } from "lucide-react";
import { useState } from "react";

const avatarStyle = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
];

export default function UsersPanel({ users, messages, onSendMessage }) {
  const [tab, setTab] = useState("users");
  const [message, setMessage] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex gap-1 border-b border-slate-100 p-3">
        <button
          type="button"
          onClick={() => setTab("users")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${tab === "users" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
        >
          <Users className="h-4 w-4" />
          People ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${tab === "chat" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </button>
      </div>
      {tab === "users" ? (
        <div className="space-y-1 p-3">
          {users.map((user, index) => (
            <div
              key={user.socketId || user.userId}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${avatarStyle[index % avatarStyle.length]}`}
              >
                {user.name?.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {user.name || "Guest"}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {user.role || "editor"}
                </p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </div>
          ))}
          {users.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-slate-500">
              Waiting for collaborators…
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length ? (
              messages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-50 p-2.5 text-sm text-slate-700"
                >
                  <p>{item.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.authorName || "Collaborator"}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">
                No messages yet.
              </p>
            )}
          </div>
          <form
            onSubmit={submit}
            className="flex gap-2 border-t border-slate-100 p-3"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              placeholder="Message everyone"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 p-2 text-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
