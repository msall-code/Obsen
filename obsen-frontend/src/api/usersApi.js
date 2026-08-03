import axiosClient from "./axiosClient";

export const usersApi = {
  getUsers: () => axiosClient.get("/users"),
  createUser: (userData) => axiosClient.post("/users", userData),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
};