// src/components/board/Canvas.jsx

import { useEffect, useRef } from "react";

export default function Canvas({ boardId, socket }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("yjs-update", (update) => {
      console.log("🟡 Update received", update);
    });

    return () => {
      socket.off("yjs-update");
    };
  }, [socket]);

  const handleClick = () => {
    if (!socket) return;

    // 🔥 fake draw event (for testing)
    socket.emit("yjs-update", {
      boardId,
      update: [1, 2, 3], // fake
    });
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div
        onClick={handleClick}
        className="w-[800px] h-[500px] bg-white border rounded-xl shadow cursor-crosshair flex items-center justify-center"
      >
        <p className="text-gray-400">
          Click to simulate drawing (YJS later)
        </p>
      </div>
    </div>
  );
}