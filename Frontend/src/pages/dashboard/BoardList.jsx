import BoardCard from "./BoardCard";

export default function BoardList({
  boards = [],
  loading,
  onCreateClick,
  onDelete,
  onRename,
  onStar,
}) {
  // ✅ Loading state
  if (loading) {
    return (
      <p className="text-gray-500 text-sm">Loading boards...</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

      {/* 🔥 CREATE BOARD CARD */}
      <div
        key="create-board"
        onClick={onCreateClick}
        className="h-60 flex flex-col items-center justify-center bg-white border rounded-xl cursor-pointer hover:shadow-md transition"
      >
        <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
          +
        </div>
        <p className="mt-3 text-sm font-medium text-gray-600">
          Create Board
        </p>
      </div>

      {/* 🔥 EMPTY STATE */}
      {boards.length === 0 ? (
        <p className="col-span-full text-gray-400 text-center">
          No boards found
        </p>
      ) : (
        boards.map((board) => (
          <BoardCard
            key={board._id || board.id} // ✅ safe key
            board={board}
            onDelete={onDelete}
            onRename={onRename}
            onStar={onStar}
          />
        ))
      )}
    </div>
  );
}