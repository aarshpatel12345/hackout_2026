import axios from "axios";

// In development, let Vite proxy /api to the backend. This avoids browser CORS
// failures and keeps the frontend independent of localhost vs. 127.0.0.1.
// Set VITE_API_URL only when the API is hosted at a different public URL.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
	baseURL,
	timeout: 15000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to automatically add Authorization token
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

export default api;
