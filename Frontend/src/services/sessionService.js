import API from "./api";

export const getLiveSessions = async () => {
  const res = await API.get("/sessions");
  return res.data;
};