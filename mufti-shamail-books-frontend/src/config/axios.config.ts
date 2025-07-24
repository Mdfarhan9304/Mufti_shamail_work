import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL, // Use Vite's environment variable for the API URL
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
	(config) => {
		// Retrieve access token from localStorage or a secure place
		const accessToken = localStorage.getItem("accessToken");

		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

// Add response interceptor for token expiration handling
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = localStorage.getItem("refreshToken");
				if (refreshToken) {
					const { data } = await axios.post(
						`${import.meta.env.VITE_API_URL}/auth/refresh-token`,
						{ refreshToken }
					);
					const { accessToken, refreshToken: newRefreshToken } =
						data.data;
					localStorage.setItem("accessToken", accessToken);
					localStorage.setItem("refreshToken", newRefreshToken);
					originalRequest.headers[
						"Authorization"
					] = `Bearer ${accessToken}`;
					return axiosInstance(originalRequest);
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (refreshError) {
				// Redirect to login page if refresh token fails
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
