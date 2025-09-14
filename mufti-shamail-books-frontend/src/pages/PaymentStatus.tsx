import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Home, Package } from "lucide-react";
import { formatCurrency } from "../utils/priceUtils";


interface Order {
	_id: string;
	orderNumber: string;
	amount: number;
	isGuestOrder?: boolean;
	contactDetails: {
		name: string;
		email: string;
		phone: string;
	};
	items: Array<{
		book: {
			name: string;
			price: number;
		};
		quantity: number;
		price: number;
	}>;
	createdAt: string;
}

const PaymentStatus = () => {
	const { txnId } = useParams();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		// Check if this is a Razorpay payment success (from localStorage)
		const successOrder = localStorage.getItem("successOrder");
		if (successOrder) {
			const orderData = JSON.parse(successOrder);
			console.log("Order data from localStorage:", orderData);
			setOrder(orderData);
				setLoading(false);
			// Don't automatically clear order data - let user clear it manually
				return;
			}

		// For old PhonePe flow, show migration message
		if (txnId && txnId !== "success") {
			setTimeout(() => {
				window.location.href = "/cart";
			}, 3000);
		}
					setLoading(false);
	}, [txnId]);

	const clearOrderData = () => {
		localStorage.removeItem("successOrder");
	};

	if (loading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-md mx-auto bg-[#1a1d16] rounded-lg p-8 text-center">
						<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin mx-auto mb-4" />
						<p className="text-gray-400">Loading payment status...</p>
					</div>
				</div>
			</main>
		);
	}

	// Show success page if order exists
	if (order) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24">
				<div className="container mx-auto px-4 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="max-w-2xl mx-auto"
					>
						{/* Success Header */}
						<div className="bg-[#1a1d16] rounded-lg p-8 text-center mb-6">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring" }}
							>
								<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
							</motion.div>
							
							<h1 className="text-2xl font-bold text-white mb-2">
								Payment Successful! 🎉
							</h1>
							<p className="text-gray-400 mb-4">
								Thank you for your order. We'll send you a confirmation email shortly.
							</p>
							
							<div className="bg-[#24271b] rounded-lg p-4 mb-6">
								<div className="flex items-center justify-center gap-2 text-[#c3e5a5] mb-2">
									<Package className="w-5 h-5" />
									<span className="font-medium">Order #{order.orderNumber}</span>
								</div>
								<p className="text-2xl font-bold text-white">
									{formatCurrency(order.amount || 0)}
								</p>
							</div>
						</div>

						{/* Order Summary */}
						<div className="bg-[#1a1d16] rounded-lg p-6 mb-6">
							<h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
							
							<div className="space-y-3 mb-4">
								{order.items.map((item, index) => {
									// Use item.price if available, otherwise calculate from book.price
									const itemPrice = item.price || (item.book?.price || 0);
									const itemTotal = itemPrice * item.quantity;
									
									return (
										<div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
											<div>
												<p className="text-white font-medium">{item.book?.name || 'Book'}</p>
											<p className="text-gray-400 text-sm">
												Qty: {item.quantity}
											</p>
											</div>
											<p className="text-[#c3e5a5] font-medium">
												{formatCurrency(itemTotal)}
											</p>
										</div>
									);
								})}
							</div>

							{/* Calculate subtotal and delivery charges */}
							{(() => {
								const subtotal = order.items.reduce((total, item) => {
									const itemPrice = item.price || (item.book?.price || 0);
									return total + (itemPrice * item.quantity);
								}, 0);
								
								const totalQuantity = order.items.reduce((total, item) => total + item.quantity, 0);
								const deliveryCharges = Math.ceil(totalQuantity / 2) * 50;
								const calculatedTotal = subtotal + deliveryCharges;
								
								return (
									<div className="border-t border-gray-700 pt-4 space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-gray-400">Subtotal</span>
											<span className="text-gray-400">{formatCurrency(subtotal)}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-400">Delivery Charges</span>
											<span className="text-gray-400">{formatCurrency(deliveryCharges)}</span>
										</div>
										<div className="flex justify-between items-center pt-2 border-t border-gray-600">
											<span className="text-lg font-semibold text-white">Total</span>
											<span className="text-lg font-bold text-[#c3e5a5]">
												{formatCurrency(calculatedTotal)}
											</span>
										</div>
									</div>
								);
							})()}
						</div>

						{/* Customer Details */}
						<div className="bg-[#1a1d16] rounded-lg p-6 mb-6">
							<h2 className="text-lg font-semibold text-white mb-4">Delivery Details</h2>
							<div className="space-y-2">
								<p className="text-gray-400">
									<span className="text-white font-medium">{order.contactDetails.name}</span>
								</p>
								<p className="text-gray-400">{order.contactDetails.email}</p>
								<p className="text-gray-400">{order.contactDetails.phone}</p>
							</div>
						</div>

						{/* Action Button */}
						<div className="flex justify-center">
							<Link
								to="/"
								onClick={clearOrderData}
								className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-colors font-medium"
							>
								<Home className="w-5 h-5" />
								Continue Shopping
							</Link>
						</div>

						{/* Email Confirmation Note */}
						<div className="mt-6 text-center">
							<p className="text-gray-400 text-sm">
								A confirmation email has been sent to <span className="text-[#c3e5a5]">{order.contactDetails.email}</span>
							</p>
						</div>
					</motion.div>
				</div>
			</main>
		);
	}

	// Show migration message for old PhonePe flow
	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-md mx-auto bg-[#1a1d16] rounded-lg p-8 text-center"
				>
					<CheckCircle className="w-12 h-12 text-[#c3e5a5] mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-white mb-2">
						Payment System Updated
					</h2>
					<p className="text-gray-400 mb-6">
						We have updated our payment system. Please try placing your order again from the cart.
					</p>
					<div className="flex items-center justify-center gap-2 text-gray-400">
						<Loader2 className="w-4 h-4 animate-spin" />
						<span>Redirecting to cart...</span>
					</div>
				</motion.div>
			</div>
		</main>
	);
};

export default PaymentStatus;