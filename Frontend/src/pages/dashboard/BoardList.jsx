import { LayoutTemplate, Plus } from "lucide-react";
import BoardCard from "./BoardCard";

export default function BoardList({
  boards = [],
  loading,
  onCreateClick,
  onDelete,
  onRename,
  onStar,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="h-32 rounded-xl bg-slate-100" />
            <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
            <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <button
        type="button"
        onClick={onCreateClick}
        className="group flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm transition duration-200 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <span className="mt-4 text-base font-semibold text-slate-800">Create a new board</span>
        <span className="mt-1 text-sm text-slate-500">Start collaborating in seconds</span>
      </button>

      {boards.map((board) => (
        <BoardCard
          key={board._id || board.id}
          board={board}
          onDelete={onDelete}
          onRename={onRename}
          onStar={onStar}
        />
      ))}

      {boards.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <LayoutTemplate className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-800">Your workspace is empty</h3>
          <p className="mt-1 max-w-52 text-sm leading-6 text-slate-500">Create your first board to begin sketching ideas with your team.</p>
        </div>
      )}
    </div>
  );
}
