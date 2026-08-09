import API from "./api";

// 🔹 GET ALL BOARDS
export const getBoards = async () => {
  const res = await API.get("/boards");
  return res.data;
};

export const getBoard = async (boardId) => {
  const res = await API.get(`/boards/${boardId}`);
  return res.data;
};

export const joinBoard = async (roomId) => {
  const res = await API.post("/boards/join", { roomId });
  return res.data;
};

// 🔹 CREATE BOARD
export const createBoard = async (data) => {
  const res = await API.post("/boards", data);
  return res.data;
};

// 🔹 UPDATE BOARD (rename, star, etc.)
export const updateBoard = async (boardId, data) => {
  const res = await API.patch(`/boards/${boardId}`, data);
  return res.data;
};

// 🔹 DELETE BOARD
export const deleteBoard = async (boardId) => {
  const res = await API.delete(`/boards/${boardId}`);
  return res.data;
};

// 🔹 TOGGLE STAR
export const toggleStarBoard = async (boardId) => {
  const res = await API.patch(`/boards/${boardId}/star`);
  return res.data;
};
