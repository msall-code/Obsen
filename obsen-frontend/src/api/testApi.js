// src/api/testApi.js
import axiosClient from "./axiosClient";

export const testApi = {
  getAdminData: () => axiosClient.get("/test-access/admin"),
  getDevopsData: () => axiosClient.get("/test-access/devops"),
  getDevData: () => axiosClient.get("/test-access/dev"),
};