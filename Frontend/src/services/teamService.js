import API from "./api";

export const getMembers = (boardId) =>
  API.get(`/team/${boardId}/members`);

export const inviteMember = (boardId, data) =>
  API.post(`/team/${boardId}/invite`, data);

export const updateRole = (boardId, userId, role) =>
  API.patch(`/team/${boardId}/member/${userId}`, { role });

export const removeMember = (boardId, userId) =>
  API.delete(`/team/${boardId}/member/${userId}`);