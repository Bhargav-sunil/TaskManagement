import axios from "axios";

const API_BASE = "http://localhost:5000/v1";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

class ApiService {
  // Auth
  async login(email, password) {
    return api.post("/auth/login", { email, password });
  }

  async register(name, email, password) {
    return api.post("/auth/register", { name, email, password });
  }

  async getMe() {
    return api.get("/auth/me");
  }

  // Task
  async getTasks(params = {}) {
    return api.get("/tasks", { params });
  }

  async getTask(id) {
    return api.get(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return api.post("/tasks", taskData);
  }

  async updateTask(id, taskData) {
    return api.put(`/tasks/${id}`, taskData);
  }

  async deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  }

  // User
  async getUsers(params = {}) {
    return api.get("/users", { params });
  }

  async createUser(userData) {
    return api.post("/users", userData);
  }

  async updateUser(id, userData) {
    return api.put(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return api.delete(`/users/${id}`);
  }

  // Task endpoints
  async getTasks(params = {}) {
    return api.get("/tasks", { params });
  }

  // User endpoints (admin only)
  async getUsers(params = {}) {
    return api.get("/users", { params });
  }
}

export default new ApiService();
