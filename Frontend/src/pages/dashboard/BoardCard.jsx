import { useState } from "react";
import { Clock3, MoreHorizontal, Pencil, Star, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const coverStyles = [
  "from-violet-600 via-indigo-600 to-blue-500",
  "from-cyan-500 via-sky-500 to-indigo-500",
  "from-fuchsia-500 via-purple-500 to-indigo-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
];

const getCoverStyle = (title = "") => {
  const total = [...title].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return coverStyles[total % coverStyles.length];
};

export default function BoardCard({ board, onDelete, onRename, onStar }) {
  const navigate = useNavigate();
  const boardId = board._id || board.id;
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title || "Untitled board");

  const saveTitle = () => {
    const nextTitle = title.trim();
    if (nextTitle && nextTitle !== board.title) onRename(boardId, nextTitle);
    else setTitle(board.title || "Untitled board");
    setEditing(false);
  };

  const updatedLabel = board.lastViewedAt
    ? `Viewed ${new Date(board.lastViewedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
    : "Open board";

  return (
    <article
      onClick={() => navigate(`/board/${boardId}`)}
      className="group relative min-h-64 cursor-pointer overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div className={`relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br ${getCoverStyle(board.title)}`}>
        <div className="absolute -right-5 -top-9 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -bottom-12 left-12 h-28 w-52 rotate-12 rounded-full bg-white/10" />
        <span className="absolute bottom-4 left-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-lg font-bold text-white backdrop-blur-sm">
          {(board.title || "B").trim().charAt(0).toUpperCase()}
        </span>
      </div>

      <button
        type="button"
        aria-label={board.isStarred ? "Remove from starred boards" : "Add to starred boards"}
        onClick={(event) => {
          event.stopPropagation();
          onStar(boardId);
        }}
        className={`absolute left-4 top-4 rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-white/80 ${board.isStarred ? "bg-amber-300 text-amber-950" : "bg-white/15 text-white hover:bg-white/30"}`}
      >
        <Star className="h-4 w-4" fill={board.isStarred ? "currentColor" : "none"} />
      </button>

      <div className="absolute right-4 top-4" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          aria-label="Board actions"
          onClick={() => setShowMenu((open) => !open)}
          className="rounded-lg bg-white/15 p-2 text-white transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/80"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 z-10 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-300/40">
            <button type="button" onClick={() => { setEditing(true); setShowMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
              <Pencil className="h-3.5 w-3.5" /> Rename
            </button>
            <button type="button" onClick={() => onDelete(boardId)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {editing ? (
          <input
            value={title}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") { setTitle(board.title || "Untitled board"); setEditing(false); }
            }}
            autoFocus
            maxLength={100}
            className="w-full rounded-lg border border-indigo-300 px-2.5 py-1.5 text-base font-semibold text-slate-900 outline-none ring-indigo-100 focus:ring-4"
          />
        ) : (
          <h3 className="truncate text-base font-semibold text-slate-900">{board.title || "Untitled board"}</h3>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{updatedLabel}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{board.role || "Member"}</span>
        </div>
      </div>
    </article>
  );
}
