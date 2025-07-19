import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "https://petstore.swagger.io/v2",
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	config => {
	  if (typeof window !== 'undefined') {
		const token = localStorage.getItem('token');
		if (token) {
		  config.headers['Authorization'] = `Bearer ${token}`;
		}
	  }
	  return config;
	},
	error => Promise.reject(error)
  );

// Response interceptor: Handle global errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			console.warn("Unauthorized request. Redirecting to login...");
			// window.location.href = '/login';
		}
		return Promise.reject(error); 
	}
);
