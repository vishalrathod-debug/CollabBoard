import { useEffect, useState } from "react";
import { getActivity } from "../../services/activityService";


export default function BoardActivity({ boardId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActivity = async () => {
      // Reset state for new board fetch
      setLoading(true);
      setError(null);

      try {
        const res = await getActivity(boardId);
        if (isMounted) {
          // Safely handle different API response structures
          setActivities(res?.activities || res?.data?.activities || res || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load activity:", err);
          setError("Failed to load activity history.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (boardId) {
      fetchActivity();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false; // Prevent state updates if component unmounts mid-request
    };
  }, [boardId]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Board Activity</h2>

      {loading ? (
        <div className="py-8 text-center text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading activity...</p>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 py-4 text-center">{error}</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No recent activity recorded for this board.</p>
      ) : (
        <div className="relative border-l-2 border-slate-100 ml-3 pl-5 space-y-4">
          {activities.map((a) => {
            const userName = a.userId?.name || "User";
            const initial = userName.charAt(0).toUpperCase();

            return (
              <div key={a._id || a.id} className="relative group">
                {/* Timeline Dot / Avatar */}
                <div className="absolute -left-[29px] top-0.5 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold text-xs flex items-center justify-center">
                  {initial}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{userName}</span>{" "}
                    <span className="text-slate-600">{a.action}</span>
                  </p>

                  <time className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}