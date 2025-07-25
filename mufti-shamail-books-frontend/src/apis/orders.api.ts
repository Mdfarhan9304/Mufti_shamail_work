import axios from "axios";
import axiosInstance from "../config/axios.config";

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface OrdersResponse {
    success: boolean;
    data: {
        orders: any[];
        pagination: PaginationInfo;
        stats?: {
            totalOrders: number;
            totalRevenue: number;
            ordersByStatus: Record<string, number>;
        };
    };
}

export const getOrders = async (userId: string, page: number = 1): Promise<OrdersResponse> => {
	try {
		const response = await axiosInstance.get(`/orders/${userId}?page=${page}`);
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

export const getAdminOrders = async (
    page: number = 1,
    filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
    }
): Promise<OrdersResponse> => {
	try {
        let url = `/orders/admin/all?page=${page}`;
        if (filters?.status) url += `&status=${filters.status}`;
        if (filters?.startDate) url += `&startDate=${filters.startDate}`;
        if (filters?.endDate) url += `&endDate=${filters.endDate}`;

		const response = await axiosInstance.get(url, {
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