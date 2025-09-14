// Import necessary modules
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateTransactionId, calculateDeliveryCharges } from "../utils/helper";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types";
import { Order } from "../models/Order";
import  Book  from "../models/Book";

import { sendOrderConfirmationEmail } from "../services/emailService";

// Razorpay configuration
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RGzlyeeN462lzV",
	key_secret: process.env.RAZORPAY_KEY_SECRET || "KZ49E5ESf21loQOAtJvmTqYX",
});

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
		addressType?: string;
	};
}

export const createRazorpayOrder = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { cartItems } = req.body;
	const userId = req.user?._id;
		
		// Security: Calculate amount on server side from cart items
		if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
			return res.status(400).json({
				success: false,
				error: "Cart items are required",
			});
		}

		// Calculate total amount from cart items on server side for security
		// Fetch actual prices from database instead of trusting frontend
		let totalAmount = 0;
		let totalQuantity = 0;
		const processedItems: Array<{book: string; quantity: number; price: number}> = [];

		// Validate cart items first
		for (const item of cartItems) {
			if (!item.book || !item.quantity) {
				return res.status(400).json({
					success: false,
					error: "Invalid cart item format - missing book ID or quantity",
				});
			}
		}

		// Fetch all books in one query for better performance and memory usage
		const bookIds = cartItems.map((item: {book: string; quantity: number}) => item.book);
		const books = await Book.find({ _id: { $in: bookIds } }).lean();
		
		for (const item of cartItems) {
			const bookData = books.find(book => book._id.toString() === item.book);
			if (!bookData) {
				return res.status(400).json({
					success: false,
					error: `Book with ID ${item.book} not found`,
				});
			}

			const actualPrice = parseFloat(bookData.price.toString());
			const itemTotal = actualPrice * parseInt(item.quantity);
			totalAmount += itemTotal;
			totalQuantity += parseInt(item.quantity);
			
			processedItems.push({
				book: item.book,
				quantity: parseInt(item.quantity),
				price: actualPrice, // Use actual price from database
			});
		}
		
		// Clear books array to help garbage collection
		books.length = 0;

		// Add delivery charges based on total quantity, not amount
		const deliveryCharges = calculateDeliveryCharges(totalQuantity);
		totalAmount += deliveryCharges;

		console.log("Order calculation:", {
			cartItems: cartItems.length,
			totalQuantity,
			subtotal: totalAmount - deliveryCharges,
			deliveryCharges,
			totalAmount
		});

		// Convert to paise (Razorpay expects amount in smallest currency unit)
		const amountInPaise = Math.round(totalAmount * 100);

		const txnId = generateTransactionId();

		// Create Razorpay order
		const razorpayOrder = await razorpay.orders.create({
			amount: amountInPaise,
			currency: "INR",
			receipt: txnId,
			// payment_capture: 1, // Auto capture payment (removed for correct typing)
		});

		res.status(200).json({
			success: true,
			orderId: razorpayOrder.id,
			amount: amountInPaise,
			currency: "INR",
			txnId: txnId,
			key: process.env.RAZORPAY_KEY_ID || "rzp_test_RGzlyeeN462lzV",
		});
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		next(error);
	}
};

export const verifyRazorpayPayment = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { 
			razorpay_order_id, 
			razorpay_payment_id, 
			razorpay_signature,
			cartItems, 
			selectedAddress, 
			guestInfo 
		} = req.body;

		console.log("=== RAZORPAY PAYMENT VERIFICATION ===");
		console.log("Order ID:", razorpay_order_id);
		console.log("Payment ID:", razorpay_payment_id);
	console.log("Cart Items:", JSON.stringify(cartItems, null, 2));
	console.log("Guest Info:", JSON.stringify(guestInfo, null, 2));
	console.log("Selected Address:", JSON.stringify(selectedAddress, null, 2));
	console.log("User:", req.user ? req.user._id : "GUEST");

		// Validate required fields
		if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cartItems || !selectedAddress) {
			console.log("Missing required fields for payment verification");
			return res.status(400).json({
				success: false,
				error: "Missing required fields for payment verification",
			});
		}

		// Verify payment signature
		const body = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "KZ49E5ESf21loQOAtJvmTqYX")
			.update(body.toString())
			.digest("hex");

		const isAuthentic = expectedSignature === razorpay_signature;

		if (!isAuthentic) {
			console.log("Payment signature verification failed");
			return res.status(400).json({
				success: false,
				error: "Payment verification failed",
			});
		}

		console.log("Payment signature verified successfully");

			// Check if the order already exists
			const existingOrder = await Order.findOne({
			razorpayPaymentId: razorpay_payment_id,
			}).populate('items.book');
			
			if (existingOrder) {
				console.log("Found existing order:", existingOrder._id);
				
				// Send order confirmation email if it's a recent order (within last 5 minutes)
				const orderAge = Date.now() - existingOrder.createdAt.getTime();
				const fiveMinutes = 5 * 60 * 1000;
				
				if (orderAge < fiveMinutes) {
					try {
						await sendOrderConfirmationEmail(existingOrder);
						console.log("Order confirmation email sent for existing order");
					} catch (emailError) {
						console.error("Failed to send order confirmation email for existing order:", emailError);
					}
				}
				
				const orderResponse = {
					success: true,
					order: {
						_id: (existingOrder._id as any).toString(),
						orderNumber: existingOrder.orderNumber,
						items: existingOrder.items,
						contactDetails: existingOrder.contactDetails,
						shippingAddress: existingOrder.shippingAddress,
					amount: existingOrder.amount,
						status: existingOrder.status,
						paymentStatus: "paid",
						createdAt: existingOrder.createdAt.toISOString(),
						updatedAt: existingOrder.updatedAt.toISOString(),
					},
				};
				console.log("Sending existing order response:", JSON.stringify(orderResponse, null, 2));
				res.status(200).json(orderResponse);
				return;
			}

		// Fetch payment details from Razorpay
		const payment = await razorpay.payments.fetch(razorpay_payment_id);
		
		if (payment.status !== 'captured') {
			console.log("Payment not captured:", payment.status);
			return res.status(400).json({
				success: false,
				error: "Payment not completed",
			});
		}

		console.log("Payment completed successfully");

		// Payment is successful, create order
		const amountInPaise = Number(payment.amount);
		const amountInRs = amountInPaise / 100;

		console.log("Amount:", { amountInPaise, amountInRs });

		// Recalculate items with actual prices from database for order creation
		let processedItems: Array<{book: string; quantity: number; price: number}> = [];
		const bookIds = cartItems.map((item: {book: string; quantity: number}) => item.book);
		const books = await Book.find({ _id: { $in: bookIds } }).lean(); // Use lean() for better memory efficiency
		
		for (const item of cartItems) {
			const bookData = books.find(book => book._id.toString() === item.book);
			if (!bookData) {
				return res.status(400).json({
					success: false,
					error: `Book with ID ${item.book} not found`,
				});
			}

			processedItems.push({
				book: item.book,
				quantity: parseInt(item.quantity),
				price: parseFloat(bookData.price.toString()), // Use actual price from database
			});
		}
		
		// Clear references to help garbage collection
		books.length = 0;

			// Prepare shipping address based on whether it's a guest order or not
			const shippingAddress = guestInfo ? {
				...guestInfo.address,
				addressType: guestInfo.address.addressType || "Home",
				isDefault: false
			} : selectedAddress;

			console.log("Prepared shipping address:", JSON.stringify(shippingAddress, null, 2));

			// Create a new order
			const orderData = {
				user: req.user?._id || null, // Null for guest users
			orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
				items: processedItems, // Use processed items with actual prices
				contactDetails: req.user
					? {
						phone: req.user?.phone || "",
							email: req.user?.email || "",
							name: req.user?.name || "",
					  }
					: {
							phone: guestInfo?.phone || "",
							email: guestInfo?.email || "",
							name: guestInfo?.name || "",
					  },
				shippingAddress,
			txnId: generateTransactionId(), // Use unique transaction ID to avoid duplicates
			razorpayOrderId: razorpay_order_id,
			razorpayPaymentId: razorpay_payment_id,
				isGuestOrder: !req.user,
				amount: amountInRs,
				status: "pending",
				paymentStatus: "paid"
			};

			console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

			const order = new Order(orderData);
			await order.save();
			const populatedOrder = await order.populate('items.book');

			console.log("Order created successfully:", populatedOrder._id);

			// Send order confirmation email
			try {
				await sendOrderConfirmationEmail(populatedOrder);
				console.log("Order confirmation email sent successfully");
			} catch (emailError) {
				console.error("Failed to send order confirmation email:", emailError);
				// Don't fail the order creation if email fails
			}

			const orderResponse = {
				success: true,
				order: {
					_id: (populatedOrder._id as any).toString(),
					orderNumber: populatedOrder.orderNumber,
					items: populatedOrder.items,
					contactDetails: populatedOrder.contactDetails,
					shippingAddress: populatedOrder.shippingAddress,
				amount: populatedOrder.amount,
					status: populatedOrder.status,
					paymentStatus: "paid",
					createdAt: populatedOrder.createdAt.toISOString(),
					updatedAt: populatedOrder.updatedAt.toISOString(),
				},
			};

		console.log("Sending order response:", JSON.stringify(orderResponse, null, 2));
			res.status(200).json(orderResponse);
	} catch (error) {
		console.error("Error in verifyRazorpayPayment:", error);
		next(error);
	}
};