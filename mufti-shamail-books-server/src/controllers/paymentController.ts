// Import necessary modules
import axios from "axios";
import { Buffer } from "node:buffer"; // Buffer for encoding/decoding data
import { generateChecksum, generateTransactionId } from "../utils/helper";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types";
import { Order } from "../models/Order";

const PAYMENT_SALT_KEY = process.env.PAYMENT_SALT_KEY; // Salt key used for checksum generation
const MERCHANT_ID = process.env.MERCHANT_ID; // Merchant ID provided by PhonePe
const MERCHANT_BASE_URL = process.env.MERCHANT_BASE_URL; // Base URL for payment initiation
const MERCHANT_STATUS_URL = process.env.MERCHANT_STATUS_URL; // URL to check payment status

interface GuestInfo {
	name: string;
	email: string;
	phone: string;
	address: {
		addressLine1: string;
		addressLine2?: string;
		city: string;
		state: string;
		pincode: string;
	};
}

export const generatePaymentUrl = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const { totalAmount } = req.body;
	const txnId = generateTransactionId();
	const userId = req.user?._id;
	// Convert the total amount to paise (as PhonePe API expects the amount in paise)
	const amountInPaise = parseFloat(totalAmount) * 100;

	const paymentPayload = {
		merchantId: MERCHANT_ID, // Merchant ID for identification
		merchantTransactionId: txnId, // Unique transaction ID for the order
		merchantUserId: userId || "GUEST_USER", // User ID to identify the customer
		amount: amountInPaise, // Total amount in paise (multiplied by 100)
		redirectUrl: `${process.env.FRONTEND_URL}/payment/${txnId}`, // URL to redirect the user after payment
		callbackUrl: `${process.env.API}`, // Callback URL for the status of the payment
		paymentInstrument: { type: "PAY_PAGE" }, // Payment method type (pay page for PhonePe)
	};

	const payloadBase64 = Buffer.from(
		JSON.stringify(paymentPayload),
		"utf8"
	).toString("base64");

	const checksum = await generateChecksum(
		payloadBase64,
		"/pg/v1/pay",
		PAYMENT_SALT_KEY || ""
	);

	const options = {
		method: "POST",
		url: MERCHANT_BASE_URL,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": checksum,
		},
		data: { request: payloadBase64 },
	};

	try {
		const response = await axios.request(options);
		if (
			response.data &&
			response.data.data &&
			response.data.data.instrumentResponse
		) {
			res.status(200).json({
				success: true,
				redirectUrl:
					response.data.data.instrumentResponse.redirectInfo.url, // Redirect URL for the user to complete payment
			});
		}
	} catch (error) {
		next(error);
	}
};

export const checkOrderPaymentStatus = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const { merchantTransactionId, cartItems, selectedAddress, guestInfo } =
		req.body;
	const checksum = await generateChecksum(
		`/pg/v1/status/${MERCHANT_ID}/`,
		merchantTransactionId,
		PAYMENT_SALT_KEY!
	);

	console.log(cartItems);

	const options = {
		method: "GET",
		url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": checksum,
		},
	};

	try {
		const response = await axios.request(options);
		const payRes = response.data.data;
		const amountInRs = payRes.amount / 100; // Convert paise to rupees
		if (response.data.success) {
			// Check if the order already exists
			const existingOrder = await Order.findOne({
				txnId: merchantTransactionId,
			});
			if (existingOrder) {
				res.status(200).json({
					success: true,
					order: existingOrder,
				});
				return;
			}

			// Create a new order
			const orderData = {
				user: req.user?._id || null, // Null for guest users
				orderNumber: `ORD${Date.now()}${Math.floor(
					Math.random() * 1000
				)}`,
				items: cartItems,
				contactDetails: req.user
					? {
							phone: "9875639258", // Hardcoded for now
							email: req.user?.email || "",
							name: req.user?.name || "",
					  }
					: {
							phone: guestInfo?.phone || "",
							email: guestInfo?.email || "",
							name: guestInfo?.name || "",
					  },
				shippingAddress: guestInfo?.address || selectedAddress || "",
				notes: `Payment Transaction ID: ${merchantTransactionId}`,
				txnId: merchantTransactionId,
				isGuestOrder: !req.user,
				amount: amountInRs,
			};

			const order = new Order(orderData);
			await order.save();

			res.status(200).json({
				success: true,
				order: order,
			});
		} else {
			res.status(400).json({
				success: false,
				error: "Payment failed. Please try again.",
			});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};
