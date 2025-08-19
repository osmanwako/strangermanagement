import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API functions
export const authAPI = {
  Login: (data) => API.post("/login", data),
  Logout: () => API.post("/logout"),
  GetUser: () => API.get("/user"),
};

// Visitor API functions
export const visitorAPI = {
  getAll: () => API.get("/visitors"),
  create: (visitor) => API.post("/visitors", visitor),
  update: (id, visitor) => API.put(`/visitors/${id}`, visitor),
  delete: (id) => API.delete(`/visitors/${id}`),
};

// Weapon API functions
export const weaponAPI = {
  getAll: () => API.get("/weapons"),
  create: (weapon) => API.post("/weapons", weapon),
  update: (id, weapon) => API.put(`/weapons/${id}`, weapon),
  delete: (id) => API.delete(`/weapons/${id}`),
};
export const dashboardAPI = {
  stats: () => API.get("/dashboard/stats"),
};

export default API;
