import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { checkPaymentStatus, OrderResponse } from "../apis/payment.api";
import {
	Loader2,
	CheckCircle2,
	XCircle,
	ShoppingBag,
	HomeIcon,
	PackageCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAddressIcon } from "../components/user/Addresses";
import { useAuth } from "../contexts/AuthContext";

const PaymentStatus = () => {
	const { txnId } = useParams();
	const { user, isLoading: authLoading } = useAuth();
	const [loading, setLoading] = useState(true);
	const [order, setOrder] = useState<OrderResponse["order"]>();
	const [error, setError] = useState<string>();
	const [verificationAttempted, setVerificationAttempted] = useState(false);

	useEffect(() => {
		const verifyPayment = async () => {
			if (!txnId) {
				setError("Invalid transaction ID");
				setLoading(false);
				return;
			}

			try {
				// Get cart and address from localStorage
				const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
				const selectedAddress = JSON.parse(localStorage.getItem("selectedAddress") || "{}");
				const guestInfo = JSON.parse(localStorage.getItem("guestInfo") || "null");

				console.log("Payment verification - localCart:", localCart);
				console.log("Payment verification - selectedAddress:", selectedAddress);
				console.log("Payment verification - guestInfo:", guestInfo);
				console.log("Current user:", user);

				if (!localCart.length) {
					setError("No order details found");
					setLoading(false);
					return;
				}

				// Wait for user state to be properly initialized
				if (authLoading) {
					console.log("Waiting for auth state...");
					return;
				}

				// if (!user && !guestInfo) {
				// 	setError(`Guest information not found ${user}`);
				// 	setLoading(false);
				// 	return;
				// }

				interface CartItem {
					_id: string;
					quantity: number;
					price: number;
				}

				const orderItems = localCart.map((item: CartItem) => ({
					book: item._id,
					quantity: item.quantity,
					price: item.price,
				}));

				console.log("Calling checkPaymentStatus with:", {
					txnId,
					orderItems,
					selectedAddress,
					guestInfo
				});

				const response = await checkPaymentStatus(
					txnId,
					orderItems,
					selectedAddress,
					guestInfo,
				);

				console.log("Payment verification response:", response);

				if (response.success) {
					setOrder(response.order);
					// Clear local storage after successful order
					localStorage.removeItem("selectedAddress");
					localStorage.removeItem("localCart");
					localStorage.removeItem("guestInfo");
					console.log("Order set successfully:", response.order);
				} else {
					setError(response.error || "Payment verification failed");
				}
			} catch (error) {
				console.error("Payment verification error:", error);
				const errorMessage = error instanceof Error ? error.message : "Something went wrong";
				setError(errorMessage);
				toast.error(errorMessage);
			} finally {
				setLoading(false);
				setVerificationAttempted(true);
			}
		};

		// Only verify if we haven't attempted verification yet and auth is not loading
		if (!verificationAttempted && !authLoading) {
			verifyPayment();
		}
	}, [txnId, authLoading, verificationAttempted, user]);

	// Show loading while auth is being checked
	if (authLoading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-[#c3e5a5] animate-spin mx-auto" />
					<p className="text-gray-400">Loading...</p>
				</div>
			</main>
		);
	}

	// Check if this is a guest order in progress or user is authenticated
	const hasGuestInfo = localStorage.getItem("guestInfo");
	const hasLocalCart = localStorage.getItem("localCart");

	// Only redirect if user is not authenticated AND there's no guest order data
	if (!user && !hasGuestInfo && !hasLocalCart && !order) {
		return <Navigate to="/login" replace />;
	}

	if (loading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<div className="text-center space-y-4">
					<Loader2 className="w-12 h-12 text-[#c3e5a5] animate-spin mx-auto" />
					<p className="text-gray-400">Verifying payment...</p>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24">
				<div className="max-w-2xl mx-auto px-6 py-16">
					<motion.div
						className="bg-[#191b14] rounded-2xl p-8 text-center space-y-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<XCircle className="w-20 h-20 text-red-500 mx-auto" />
						<h1 className="text-3xl font-bold text-white">
							Payment Failed
						</h1>
						<p className="text-gray-400">{error}</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
							<Link
								to="/cart"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#24271b] text-[#c3e5a5] rounded-full hover:bg-[#2f332a] transition-all"
							>
								<ShoppingBag className="w-5 h-5" />
								Return to Cart
							</Link>
							<Link
								to="/"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full hover:bg-[#a1c780] transition-all"
							>
								<HomeIcon className="w-5 h-5" />
								Continue Shopping
							</Link>
						</div>
					</motion.div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<div className="max-w-2xl mx-auto px-6 py-16">
				<motion.div
					className="bg-[#191b14] rounded-2xl p-8 text-center space-y-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<CheckCircle2 className="w-20 h-20 text-[#c3e5a5] mx-auto" />
					<h1 className="text-3xl font-bold text-white">
						Order Confirmed!
					</h1>
					<p className="text-gray-400">Thank you for your purchase</p>

					<div className="bg-[#24271b] rounded-xl p-6 space-y-4 text-left">
						<p className="text-[#c3e5a5]">
							Order Number: {order?.orderNumber}
						</p>
						<div className="space-y-2">
							<p className="text-gray-400">Shipping Address:</p>
							{order?.shippingAddress && (
								<div className="bg-[#24271b] p-4 rounded-lg space-y-3">
									<div className="flex items-center gap-2">
										{getAddressIcon(
											order?.shippingAddress.addressType
										)}
										<span className="text-[#c3e5a5] font-medium">
											{order?.shippingAddress.addressType}
										</span>
									</div>
									<p className="text-white">
										{order?.shippingAddress.addressLine1}
									</p>
									{order?.shippingAddress.addressLine2 && (
										<p className="text-gray-400">
											{order?.shippingAddress.addressLine2}
										</p>
									)}
									{order?.shippingAddress.landmark && (
										<p className="text-gray-400">
											Landmark: {order?.shippingAddress.landmark}
										</p>
									)}
									<p className="text-gray-400">
										{`${order?.shippingAddress.city}, ${order?.shippingAddress.state} - ${order?.shippingAddress.pincode}`}
									</p>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<p className="text-gray-400">Contact Details:</p>
							<p className="text-white">
								{order?.contactDetails.name}
							</p>
							<p className="text-white">
								{order?.contactDetails.phone}
							</p>
							<p className="text-white">
								{order?.contactDetails.email}
							</p>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<Link
							to="/"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full hover:bg-[#a1c780] transition-all"
						>
							<HomeIcon className="w-5 h-5" />
							Continue Shopping
						</Link>
						{user && (
							<Link
								to="/dashboard?tab=orders"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#24271b] text-[#c3e5a5] rounded-full hover:bg-[#2f332a] transition-all"
							>
								<PackageCheck className="w-5 h-5" />
								View Orders
							</Link>
						)}
					</div>
				</motion.div>
			</div>
		</main>
	);
};

export default PaymentStatus;
