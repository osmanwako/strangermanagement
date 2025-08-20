import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Get CSRF token before making requests
API.interceptors.request.use(async (config) => {
  // Get CSRF cookie for state-changing requests
  if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
    try {
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
    } catch (error) {
      console.warn('Failed to get CSRF cookie:', error);
    }
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
