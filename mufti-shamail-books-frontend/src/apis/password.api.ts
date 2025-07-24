import axiosInstance from "../config/axios.config";

export const forgotPassword = async (email: string) => {
	const response = await axiosInstance.post("/password/forgot-password", {
		email,
	});
	return response.data;
};

export const resetPassword = async (token: string, password: string) => {
	const response = await axiosInstance.post("/password/reset-password", {
		token,
		password,
	});
	return response.data;
};
