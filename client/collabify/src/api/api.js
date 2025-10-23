// client/collabify/src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://collabify-eight.vercel.app/",
  withCredentials: true,
});

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post("/api/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Login failed";
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/user/current");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user data"
    );
  }
};

export const createBoard = async (boardData) => {
  try {
    const response = await api.post("/api/boards/", boardData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to create board"
    );
  }
};

export const updateBoard = async (boardId, boardSaveData) => {
  try {
    const response = await api.put(
      `/api/boards/save/${boardId}`,
      boardSaveData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to save board"
    );
  }
};

export const getBoard = async (boardId) => {
  try {
    const response = await api.get(`/api/boards/load/${boardId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to load board"
    );
  }
};

export const getUserBoards = async () => {
  try {
    const response = await api.get("/api/boards/");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user boards"
    );
  }
};

export const addCollaborator = async (boardId, identifier) => {
  try {
    const response = await api.post(`/api/boards/${boardId}/collaborators`, {
      identifier,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to add collaborator"
    );
  }
};

export const removeCollaborator = async (boardId, collaboratorId) => {
  try {
    const response = await api.delete(
      `/api/boards/${boardId}/collaborators/${collaboratorId}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to remove collaborator"
    );
  }
};

export const getMessages = async (boardId) => {
  try {
    const response = await api.get(`/api/messages/${boardId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch messages"
    );
  }
};

export const sendMessage = async (boardId, content) => {
  try {
    const response = await api.post(`/api/messages/${boardId}`, { content });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to send message"
    );
  }
};
