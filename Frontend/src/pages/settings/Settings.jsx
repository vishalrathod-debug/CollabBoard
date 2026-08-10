import { useState, useEffect } from "react";
import { updateProfile, getProfile } from "../../services/userService";

export default function Settings() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    avatar: "",
    theme: "light",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        const data = res.user || res;
        
        // Use fallback empty strings to prevent controlled/uncontrolled warnings
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          theme: data.theme || "light",
        });
      } catch (err) {
        console.log("error in setting component ",err)
        setStatus({ type: "error", text: "Failed to load profile data." });
      } finally {
        setPageLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", text: "" });

    try {
      await updateProfile(form);
      setStatus({ type: "success", text: "Settings saved successfully!" });
    } catch (err) {
      setStatus({ type: "error", text: "Error saving settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      {/* Status Banner */}
      {status.text && (
        <div
          className={`p-3 rounded-lg text-sm mb-5 ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar Preview & Input */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-lg">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              form.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
              Avatar Image URL
            </label>
            <input
              id="avatar"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Bio Textarea */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us a little bit about yourself..."
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Theme Select */}
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
            Theme Preference
          </label>
          <select
            id="theme"
            name="theme"
            value={form.theme}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}