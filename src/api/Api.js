import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Token management
const getToken = () => {
  return localStorage.getItem('auth_token');
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Request interceptor
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

  // Add token to headers if available
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor for token handling
API.interceptors.response.use(
  (response) => {
    // Store token if provided in response
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },
  (error) => {
    // Clear token on 401 errors
    if (error.response?.status === 401) {
      setToken(null);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  Login: (data) => API.post("/login", data),
  Logout: () => {
    setToken(null);
    return API.post("/logout");
  },
  GetUser: () => API.get("/user"),
  CreateUser: (data) => API.post("/users", data),
  GetUsers: () => API.get("/users"),
  DeleteUser: (id) => API.delete(`/users/${id}`),
};

// Visitor API functions
export const visitorAPI = {
  getAll: (params) => API.get("/visitors", { params }),
  create: (visitor) => API.post("/visitors", visitor),
  show: (id) => API.get(`/visitors/${id}`),
  update: (id, visitor) => API.put(`/visitors/${id}`, visitor),
  delete: (id) => API.delete(`/visitors/${id}`),
  archive: (id) => API.post(`/visitors/${id}/archive`),
  export: (params) => API.get("/visitors/export", { params }),
  returnWeapon: (visitorId, weaponId) => API.post(`/visitors/${visitorId}/weapons/${weaponId}/return`),
};

// Weapon API functions
export const weaponAPI = {
  getAll: () => API.get("/weapons"),
  create: (weapon) => API.post("/weapons", weapon),
  show: (id) => API.get(`/weapons/${id}`),
  update: (id, weapon) => API.put(`/weapons/${id}`, weapon),
  delete: (id) => API.delete(`/weapons/${id}`),
  return: (id) => API.post(`/weapons/${id}/return`),
};

// Appointment API functions
export const appointmentAPI = {
  getAll: (params) => API.get("/appointments", { params }),
  create: (appointment) => API.post("/appointments", appointment),
  show: (id) => API.get(`/appointments/${id}`),
  update: (id, appointment) => API.put(`/appointments/${id}`, appointment),
  delete: (id) => API.delete(`/appointments/${id}`),
  postpone: (id, data) => API.post(`/appointments/${id}/postpone`, data),
};

export const dashboardAPI = {
  stats: () => API.get("/dashboard/stats"),
};

export default API;