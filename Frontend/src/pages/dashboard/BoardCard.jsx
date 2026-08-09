import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BoardCard({
  board,
  onDelete,
  onRename,
  onStar,
}) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className="relative bg-white border rounded-xl p-4 hover:shadow-md cursor-pointer"
    >
      {/* Menu */}
      <div
        className="absolute top-3 right-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </button>

        {showMenu && (
          <div className="absolute right-0 bg-white border rounded shadow">
            <button
              onClick={() => setEditing(true)}
              className="block px-3 py-2"
            >
              Rename
            </button>

            <button
              onClick={() => onDelete(board._id)}
              className="block px-3 py-2 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStar(board._id);
        }}
        className="absolute top-3 left-3"
      >
        ⭐
      </button>

      {/* Title */}
      <div className="mt-8">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              onRename(board._id, title);
              setEditing(false);
            }}
            autoFocus
          />
        ) : (
          <h3>{board.title}</h3>
        )}
      </div>
    </div>
  );
}