import api from "./api";

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (error) {
    console.error("Error in login function:", error);
    throw error; // Re-throw so calling components can handle UI error messages
  }
};

export const signUp = async (data) => {
  try {
    const res = await api.post("/auth/signup", data); // Fixed typo: /signup
    return res.data;
  } catch (error) {
    console.error("Error in signUp function:", error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error in getMe function:", error);
    throw error;
  }
};