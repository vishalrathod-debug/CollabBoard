import API from "./api";

export const getActivity = async (boardId) => {
  const res = await API.get(`/activity/${boardId}`);
  return res.data;
};