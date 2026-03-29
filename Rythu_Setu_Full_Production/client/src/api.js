import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000"
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
  }
});

export const register = (data) => API.post("/api/auth/register", data);
export const login = (data) => API.post("/api/auth/login", data);
export const me = () => API.get("/api/auth/me", authHeader());

export const getProducts = (params = {}) => API.get("/api/products", { params });
export const getProduct = (id) => API.get(`/api/products/${id}`);
export const getMyProducts = () => API.get("/api/products/mine", authHeader());
export const getProductInsights = () => API.get("/api/products/insights", authHeader());
export const addProduct = (data) => API.post("/api/products", data, {
  ...authHeader(),
  headers: { ...authHeader().headers, "Content-Type": "multipart/form-data" }
});

export const checkout = (data) => API.post("/api/orders/checkout", data, authHeader());
export const getMyOrders = () => API.get("/api/orders/mine", authHeader());
export const getAllOrders = () => API.get("/api/orders", authHeader());
export const updateOrderStatus = (id, data) => API.patch(`/api/orders/${id}/status`, data, authHeader());
export const submitFeedback = (id, data) => API.post(`/api/orders/${id}/feedback`, data, authHeader());

export const getAdminAnalytics = () => API.get("/api/admin/analytics", authHeader());
export const getAdminInsights = () => API.get("/api/admin/insights", authHeader());
export const getPendingFarmers = () => API.get("/api/admin/farmers/pending", authHeader());
export const verifyFarmer = (id) => API.post(`/api/admin/farmers/${id}/verify`, {}, authHeader());
export const optimizeRoute = (data) => API.post("/api/admin/route-optimize", data, authHeader());

export const sendChatMessage = (message) => API.post("/api/chatbot/message", { message }, authHeader());

export default API;
