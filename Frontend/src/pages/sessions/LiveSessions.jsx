import { useEffect, useState, useCallback } from "react";
import { getLiveSessions } from "../../services/sessionService";
import { useNavigate } from "react-router-dom";
import { Radio, Users, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchSessions = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      setError(null);
      const res = await getLiveSessions();
      // Handle both { sessions: [...] } and direct array responses
      const sessionData = res?.sessions || res?.data?.sessions || res || [];
      setSessions(sessionData);
    } catch (err) {
      console.error("Failed to fetch live sessions:", err);
      if (isInitial) setError("Failed to load active sessions.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch with full loading state
    fetchSessions(true);

    // Silent background poll every 5 seconds
    const interval = setInterval(() => {
      fetchSessions(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchSessions]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Live Sessions
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time active collaborative boards.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm">Scanning for active sessions...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 flex items-center justify-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
            <p className="text-sm font-medium text-slate-600">No active live sessions</p>
            <p className="text-xs text-slate-400 mt-1">
              When users open a board, active sessions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {sessions.map((s) => {
              const activeCount = s.count ?? s.activeUsers ?? 1;
              const boardTitle = s.title || s.boardTitle || "Untitled Board";

              return (
                <div
                  key={s.boardId || s._id}
                  className="flex items-center justify-between p-4 border border-slate-200/80 rounded-xl bg-white hover:border-slate-300 hover:shadow-xs transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition">
                        {boardTitle}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {activeCount} {activeCount === 1 ? "active user" : "active users"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/board/${s.boardId || s._id}`)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}