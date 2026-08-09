import { useEffect, useRef, useState } from "react";
import { ArrowLeft, DoorOpen, UsersRound } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { joinBoard } from "../services/boardService";

export default function JoinBoardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const [roomId, setRoomId] = useState(searchParams.get("room") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => inputRef.current?.focus(), []);

  const submit = async (event) => {
    event.preventDefault();
    if (!roomId.trim())
      return setError("Enter the room ID from your invitation.");
    setLoading(true);
    setError("");
    try {
      const response = await joinBoard(roomId.trim());
      navigate(`/board/${response.board._id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "We couldn't join that board. Check the invitation and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl items-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-indigo-200/50 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-lg font-bold">CollabBoard</p>
              <h1 className="mt-14 text-4xl font-bold leading-tight">
                Ideas are better when everyone can see them.
              </h1>
              <p className="mt-5 max-w-sm text-indigo-100">
                Join a shared whiteboard to draw, discuss, and build together in
                real time.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10">
                <UsersRound className="h-5 w-5" />
              </span>
              Secure, live collaboration
            </div>
          </div>
          <div className="p-7 sm:p-12">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to my boards
            </button>
            <span className="mt-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <DoorOpen className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              Join a board
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Paste the room ID from an invitation. You will be added as an
              editor.
            </p>
            <form onSubmit={submit} className="mt-8">
              <label className="text-sm font-semibold text-slate-700">
                Room ID
                <input
                  ref={inputRef}
                  value={roomId}
                  onChange={(event) => setRoomId(event.target.value)}
                  placeholder="Example: Ab3dEfgH"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono tracking-wider uppercase outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
              <button
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Joining board…" : "Join board"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
