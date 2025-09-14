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

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
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

export interface RazorpayOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  key?: string;
  txnId?: string;
  error?: string;
}

export const createRazorpayOrder = async (
  cartItems: {
    book: string;
    quantity: number;
  }[]
): Promise<RazorpayOrderResponse> => {
  try {
    const response = await axiosInstance.post(
      "/payments/create-razorpay-order",
      {
        cartItems,
      }
    );
    console.log("Razorpay order created:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to create Razorpay order"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const verifyRazorpayPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  cartItems: {
    book: string;
    quantity: number;
  }[],
  selectedAddress: Address,
  guestInfo?: GuestInfo
): Promise<OrderResponse> => {
  try {
    console.log("Verifying Razorpay payment:", {
      razorpay_order_id,
      razorpay_payment_id,
      cartItems
    });
    
    const response = await axiosInstance.post(
      "/payments/verify-razorpay-payment",
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        cartItems,
        selectedAddress,
        guestInfo,
      }
    );
    console.log("Payment verification response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to verify Razorpay payment"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
