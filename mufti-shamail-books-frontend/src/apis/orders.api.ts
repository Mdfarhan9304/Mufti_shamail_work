import axios from "axios";
import axiosInstance from "../config/axios.config";

export const getOrders = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/orders/${userId}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to get orders"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const getAdminOrders = async () => {
	try {
		const response = await axiosInstance.get("/orders/admin/all", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		});
		return response.data;
	} catch (error) {
		throw new Error("Failed to get admin orders");
	}
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
	try {
		const response = await axiosInstance.patch(`/orders/admin/${orderId}/status`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
			status: newStatus,
		});
		return response.data;
	} catch (error) {
		throw new Error("Failed to update order status");
	}
};