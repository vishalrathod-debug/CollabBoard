// src/pages/board/BoardRoom.jsx

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import Canvas from "../../components/board/Canvas";

export default function BoardRoom() {
  const { boardId } = useParams();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !boardId) return;

    // 🔥 JOIN BOARD
    socket.emit("join-board", {
      boardId,
      name: "User", // later dynamic
    });

    // 🔥 RECEIVE INITIAL STATE
    socket.on("yjs-init", (state) => {
      console.log("📦 Received YJS state", state);
      // 👉 later apply to Yjs
    });

    // 🔥 PRESENCE
    socket.on("presence-update", (users) => {
      console.log("👥 Users:", users);
    });

    return () => {
      socket.emit("leave-board", { boardId });
      socket.off("yjs-init");
      socket.off("presence-update");
    };
  }, [socket, boardId]);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top bar */}
      <div className="h-14 border-b flex items-center px-4">
        <h1 className="font-semibold">Board: {boardId}</h1>
      </div>

      {/* Canvas area */}
      <div className="flex-1 bg-gray-50">
        <Canvas boardId={boardId} socket={socket} />
      </div>
    </div>
  );
}