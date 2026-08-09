import { useState, useEffect, useRef } from "react";
import { createBoard } from "../../services/boardService";
import { useNavigate } from "react-router-dom";

export default function CreateBoardModal({ onClose, onCreated }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  // 🔥 autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createBoard({ title });
      const newBoard = res.board || res;

      onCreated(newBoard);
      onClose();


      // 🔥 navigate immediately
      navigate(`/board/${newBoard._id}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white w-[350px] p-6 rounded-xl shadow-lg">

        <h2 className="text-lg font-bold mb-4">Create New Board</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter board title"
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}