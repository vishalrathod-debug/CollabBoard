import API from "./api";

export const getProfile = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (err) {
    console.error("Get profile error:", err.response?.data || err.message);
    throw err;
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await API.put("/users/profile", {
      name: data.name,
      bio: data.bio,
      avatar: data.avatar,
      theme: data.theme, // 🔥 important
    });

    return res.data;
  } catch (err) {
    console.error("Update profile error:", err.response?.data || err.message);
    throw err;
  }
};