import axios from "axios";
import Cookies from "js-cookie";

// ✅ Environment variable theke BASE_URL nicchi
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COOKIE_NAME = "token";

// ✅ Axios instance create
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// ✅ Request interceptor for Authorization header
instance.interceptors.request.use(
  (config) => {
    try {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Failed to get token from cookies:", e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ GET request
export const getData = async (endpoint, id = null, params = {}) => {
  try {
    const url = id ? `${endpoint}/${id}` : `${endpoint}`;
    const response = await instance.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`GET Error [/${endpoint}]:`, error);
    throw error;
  }
};

// ✅ POST request
export const postData = async (endpoint, payload) => {
  try {
    const response = await instance.post(`${endpoint}`, payload);
    return response.data;
  } catch (error) {
    console.error(`POST Error [/${endpoint}]:`, error);
    throw error;
  }
};

// ✅ PUT (update) request
export const updateData = async (endpoint, id, payload) => {
  try {
    const response = await instance.put(`${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`PUT Error [/${endpoint}/${id}]:`, error);
    throw error;
  }
};

// ✅ DELETE request
export const deleteData = async (endpoint, id) => {
  try {
    const response = await instance.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`DELETE Error [/${endpoint}/${id}]:`, error);
    throw error;
  }
};

// ✅ Export axios instance
export default instance;
