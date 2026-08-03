import axiosClient from "./axiosClient";

export const usersApi = {
  getUsers: () => axiosClient.get("/api/users"),
  createUser: (userData) => axiosClient.post("/api/users", userData),
  deleteUser: (id) => axiosClient.delete(`/api/users/${id}`),
};