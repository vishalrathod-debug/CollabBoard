import { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Minus,
  Plus,
  Share2,
  UsersRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import { getBoard } from "../../services/boardService";
import Canvas from "../../components/board/Canvas";
import Toolbar from "../../components/board/Toolbar";
import UsersPanel from "../../components/board/UsersPanel";

export default function BoardRoom() {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const [board, setBoard] = useState(null);
  const [objects, setObjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [activeTool, setActiveTool] = useState("select");
  const [color, setColor] = useState("#312e81");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoom, setZoom] = useState(100);
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [messages, setMessages] = useState([]);
  const [showPanel, setShowPanel] = useState(true);
  const [notice, setNotice] = useState("");
  const visibleUsers = users.length
    ? users
    : [
        {
          userId: user?._id || user?.id || "self",
          socketId: "self",
          name: user?.name || "You",
          role: board?.role || "member",
        },
      ];

  useEffect(() => {
    getBoard(boardId)
      .then((data) => setBoard({ ...data.board, role: data.role }))
      .catch(() => setNotice("Unable to load board details"));
  }, [boardId]);

  useEffect(() => {
    if (!socket || !boardId) return;
    const handleCanvasInit = (state) =>
      setObjects(Array.isArray(state?.objects) ? state.objects : []);
    const handleCanvasUpdate = (state) => {
      setObjects(Array.isArray(state?.objects) ? state.objects : []);
      setHistory([]);
      setFuture([]);
    };
    const handlePresence = (nextUsers) => setUsers(nextUsers || []);
    const handleCursor = ({ socketId, x, y }) =>
      setCursors((previous) => ({ ...previous, [socketId]: { x, y } }));
    const handleChat = (message) =>
      setMessages((previous) => [...previous, message]);
    const handleError = (error) =>
      setNotice(error.message || "Board connection error");
    socket.on("canvas-init", handleCanvasInit);
    socket.on("canvas-update", handleCanvasUpdate);
    socket.on("presence-update", handlePresence);
    socket.on("cursor-move", handleCursor);
    socket.on("chat-message", handleChat);
    socket.on("error", handleError);
    socket.emit("join-board", { boardId, name: user?.name || "Guest" });
    return () => {
      socket.emit("leave-board", { boardId });
      socket.off("canvas-init", handleCanvasInit);
      socket.off("canvas-update", handleCanvasUpdate);
      socket.off("presence-update", handlePresence);
      socket.off("cursor-move", handleCursor);
      socket.off("chat-message", handleChat);
      socket.off("error", handleError);
    };
  }, [socket, boardId, user?.name]);

  const updateObjects = (nextObjects) => {
    setHistory((previous) => [...previous.slice(-29), objects]);
    setFuture([]);
    setObjects(nextObjects);
    socket?.emit("canvas-update", { boardId, state: { objects: nextObjects } });
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [objects, ...items]);
    setObjects(previous);
    socket?.emit("canvas-update", { boardId, state: { objects: previous } });
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setFuture((items) => items.slice(1));
    setHistory((items) => [...items, objects]);
    setObjects(next);
    socket?.emit("canvas-update", { boardId, state: { objects: next } });
  };
  const sendCursor = (point) =>
    socket?.emit("cursor-move", { boardId, ...point });
  const sendMessage = (message) => {
    const entry = {
      id: crypto.randomUUID(),
      author: user?._id || "me",
      authorName: user?.name || "You",
      message,
      createdAt: new Date().toISOString(),
    };
    setMessages((previous) => [...previous, entry]);
    socket?.emit("chat-message", { boardId, message });
  };
  const share = async () => {
    const inviteUrl = `${window.location.origin}/join?room=${encodeURIComponent(board?.roomId || "")}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice("Invite link copied to clipboard");
    } catch {
      setNotice("Copy the invite link from your browser");
    }
  };
  const copyRoomId = async () => {
    if (!board?.roomId) return;
    try {
      await navigator.clipboard.writeText(board.roomId);
      setNotice(`Room ID copied: ${board.roomId}`);
    } catch {
      setNotice(`Room ID: ${board.roomId}`);
    }
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-800">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {board?.title || "Loading board…"}
            </p>
            <p className="flex items-center gap-1 text-xs text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live collaboration
            </p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden -space-x-2 sm:flex">
            {visibleUsers.slice(0, 4).map((member, index) => (
              <span
                key={member.socketId}
                title={member.name}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-bold text-white"
              >
                {member.name?.[0]?.toUpperCase() || index + 1}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={copyRoomId}
            title="Copy room ID"
            className="hidden rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50 md:block"
          >
            {board?.roomId || "Room ID"}
          </button>
          <button
            type="button"
            onClick={() => setShowPanel((value) => !value)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <UsersRound className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={share}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>
      {notice && (
        <div
          className="absolute left-1/2 top-20 z-30 -translate-x-1/2 rounded-full bg-slate-800 px-4 py-2 text-sm text-white shadow-lg"
          onAnimationEnd={() => setNotice("")}
        >
          {notice}
        </div>
      )}
      <section className="relative flex min-h-0 flex-1">
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 md:left-4 md:translate-x-0">
          <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            color={color}
            onColorChange={setColor}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={setStrokeWidth}
            onUndo={undo}
            onRedo={redo}
            canUndo={history.length > 0}
            canRedo={future.length > 0}
          />
        </div>
        <div className="min-w-0 flex-1 pt-4 md:pl-20">
          <Canvas
            objects={objects}
            onObjectsChange={updateObjects}
            tool={activeTool}
            color={color}
            strokeWidth={strokeWidth}
            onCursorMove={sendCursor}
            cursors={cursors}
            users={visibleUsers}
            zoom={zoom}
          />
        </div>
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(50, value - 10))}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(150, value + 10))}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {showPanel && (
          <UsersPanel
            users={visibleUsers}
            messages={messages}
            onSendMessage={sendMessage}
          />
        )}
      </section>
    </main>
  );
}
