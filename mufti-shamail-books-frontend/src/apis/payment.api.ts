import axios from "axios";
import axiosInstance from "../config/axios.config";
import { Address } from "./addresses.api";

export interface PaymentResponse {
	success: boolean;
	redirectUrl?: string;
	error?: string;
}

export interface GuestInfo {
	name: string;
	email: string;
	phone: string;
	address: {
		addressLine1: string;
		addressLine2?: string;
		city: string;
		state: string;
		pincode: string;
		addressType?: string;
	};
}

export interface OrderResponse {
	success: boolean;
	order?: {
		_id: string;
		items: Array<{
			book: string;
			quantity: number;
			price: number;
		}>;
		contactDetails: {
			phone: string;
			email: string;
			name: string;
		};
		shippingAddress: Address;
		status: string;
		paymentStatus: string;
		orderNumber: string;
		createdAt: string;
		updatedAt: string;
	};
	error?: string;
}

export const generatePaymentUrl = async (
	totalAmount: number
): Promise<PaymentResponse> => {
	try {
		const response = await axiosInstance.post(
			"/payments/generate-payment-url",
			{
				totalAmount,
			}
		);
		console.log(response.data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to generate payment URL"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const checkPaymentStatus = async (
	merchantTransactionId: string,
	cartItems: {
		book: string;
		quantity: number;
		price: number;
	}[],
	selectedAddress: Address,
	guestInfo?: GuestInfo
): Promise<OrderResponse> => {
	try {
		console.log(cartItems);
		const response = await axiosInstance.post(
			"/payments/check-order-payment-status",
			{
				merchantTransactionId,
				cartItems,
				selectedAddress,
				guestInfo,
			}
		);
		console.log(response.data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to check payment status"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};
