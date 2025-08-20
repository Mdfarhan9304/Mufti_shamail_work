import axios from "axios";
import axiosInstance from "../config/axios.config";
import { Book } from "./books.api";

export interface CartItem extends Book {
	quantity: number;
	selectedLanguage?: string;
}

// export const getCart = async () => {
// 	try {
// 		const response = await axiosInstance.get("/cart");
// 		return response.data;
// 	} catch (error) {
// 		if (axios.isAxiosError(error)) {
// 			throw new Error(
// 				error.response?.data?.error || "Failed to fetch cart"
// 			);
// 		} else {
// 			throw new Error("An unexpected error occurred");
// 		}
// 	}
// };

export const addToCart = async (
	bookId: string,
	quantity: number,
	userId: string
) => {
	try {
		const response = await axiosInstance.post("/cart/add", {
			bookId,
			quantity,
			userId,
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to add to cart"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const updateCartItem = async (
	bookId: string,
	quantity: number,
	userId: string
) => {
	try {
		const response = await axiosInstance.patch("/cart/update", {
			bookId,
			quantity,
			userId,
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to update cart item"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const removeFromCart = async (bookId: string, userId: string) => {
	try {
		const response = await axiosInstance.delete(`/cart/remove`, {
			data: {
				bookId,
				userId,
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to remove from cart"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const clearCart = async () => {
	try {
		const response = await axiosInstance.delete("/cart/clear");
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to clear cart"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};
