import { useEffect, useState, useCallback } from "react";
import {
  getMembers,
  inviteMember,
  updateRole,
  removeMember,
} from "../../services/teamService";

export default function TeamMembers({ boardId }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!boardId) return;
    try {
      setLoading(true);
      const res = await getMembers(boardId);
      // Safely access response structure
      const memberList = res?.data?.members || res?.members || [];
      setMembers(memberList);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubmitting(true);
      await inviteMember(boardId, { email, role: inviteRole });
      setEmail("");
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to invite member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      // Optimistic state update
      setMembers((prev) =>
        prev.map((m) =>
          (m.userId?._id || m.userId) === userId ? { ...m, role } : m
        )
      );
      await updateRole(boardId, userId, role);
    } catch (err) {
      console.error("Failed to update role:", err);
      fetchMembers(); // Revert on error
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      // Optimistic state delete
      setMembers((prev) =>
        prev.filter((m) => (m.userId?._id || m.userId) !== userId)
      );
      await removeMember(boardId, userId);
    } catch (err) {
      console.error("Failed to remove member:", err);
      fetchMembers(); // Revert on error
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Team Members</h1>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email..."
          required
          className="flex-1 border border-slate-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          className="border border-slate-300 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {submitting ? "Inviting..." : "Invite"}
        </button>
      </form>

      {/* Member List */}
      {loading ? (
        <div className="py-8 text-center text-slate-400">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="py-8 text-center text-slate-400">No members found for this board.</div>
      ) : (
        <div className="space-y-3">
          {members.map((m) => {
            const user = m.userId || {};
            const userId = user._id || user;
            const name = user.name || "Unknown User";
            const userEmail = user.email || "No email available";

            return (
              <div
                key={userId || m._id}
                className="flex items-center justify-between p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(userId, e.target.value)}
                    className="border border-slate-200 bg-white text-xs font-medium text-slate-700 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                  </select>

                  <button
                    onClick={() => handleRemove(userId)}
                    className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}