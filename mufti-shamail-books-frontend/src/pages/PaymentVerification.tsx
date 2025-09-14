import { useEffect, useState } from "react";
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { verifyRazorpayPayment } from "../apis/payment.api";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../utils/priceUtils";

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

interface UserCartItem {
	book: {
		_id: string;
		title: string;
	};
	quantity: number;
}

interface GuestCartItem {
	_id: string;
	title: string;
	quantity: number;
}

const PaymentVerification = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { isLoading: authLoading } = useAuth();
	const [loading, setLoading] = useState(true);
	const [verificationAttempted, setVerificationAttempted] = useState(false);
	const [order, setOrder] = useState<any>(null);
	const [error, setError] = useState<string>("");

	const razorpay_order_id = searchParams.get("razorpay_order_id");
	const razorpay_payment_id = searchParams.get("razorpay_payment_id");
	const razorpay_signature = searchParams.get("razorpay_signature");

	useEffect(() => {
		const verifyPayment = async () => {
			if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
				setError("Invalid payment parameters");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);

				// Get stored data
				const selectedAddressStr = localStorage.getItem("selectedAddress");
				const localCartStr = localStorage.getItem("localCart");
				const guestInfoStr = localStorage.getItem("guestInfo");

				if (!selectedAddressStr || !localCartStr) {
					setError("Payment session expired. Please try again.");
					setLoading(false);
					return;
				}

				const selectedAddress = JSON.parse(selectedAddressStr);
				const localCart = JSON.parse(localCartStr);
				const guestInfo: GuestInfo | null = guestInfoStr ? JSON.parse(guestInfoStr) : null;

				console.log("Payment verification data:", {
					razorpay_order_id,
					razorpay_payment_id,
					selectedAddress,
					localCart: localCart?.length,
					guestInfo: !!guestInfo
				});

				// Prepare order items based on user type
				// Only send book ID and quantity - server will fetch price from database
				const orderItems = localCart.map((item: GuestCartItem | UserCartItem) => {
					// Handle both guest cart items (with _id) and user cart items (with book)
					const bookId = '_id' in item ? item._id : 
						(typeof item.book === 'string' ? item.book : item.book._id);

					return {
						book: bookId,
						quantity: item.quantity,
					};
				});

				console.log("Calling verifyRazorpayPayment with:", {
					razorpay_order_id,
					razorpay_payment_id,
					orderItems,
					selectedAddress,
					guestInfo
				});

				const response = await verifyRazorpayPayment(
					razorpay_order_id,
					razorpay_payment_id,
					razorpay_signature,
					orderItems,
					selectedAddress,
					guestInfo || undefined,
				);

				console.log("Payment verification response:", response);

				if (response.success) {
					// Store order data for success page
					localStorage.setItem("successOrder", JSON.stringify(response.order));
					
					// Clear checkout data
					localStorage.removeItem("selectedAddress");
					localStorage.removeItem("localCart");
					localStorage.removeItem("guestInfo");
					
					toast.success("Payment successful! Order created.");
					console.log("Order set successfully:", response.order);
					
					// Redirect to payment status page using React Router
					navigate("/payment/success", { replace: true });
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
	}, [razorpay_order_id, razorpay_payment_id, razorpay_signature, authLoading, verificationAttempted]);

	// Show loading while auth is being checked
	if (authLoading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
			</main>
		);
	}

	if (loading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24">
				<div className="container mx-auto px-4 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="max-w-md mx-auto bg-[#1a1d16] rounded-lg p-8 text-center"
					>
						<Loader2 className="w-12 h-12 text-[#c3e5a5] animate-spin mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-white mb-2">
							Verifying Payment
						</h2>
						<p className="text-gray-400">
							Please wait while we confirm your payment...
						</p>
					</motion.div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24">
				<div className="container mx-auto px-4 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="max-w-md mx-auto bg-[#1a1d16] rounded-lg p-8 text-center"
					>
						<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-white mb-2">
							Payment Failed
						</h2>
						<p className="text-gray-400 mb-6">{error}</p>
						<button
							onClick={() => window.location.href = "/cart"}
							className="px-6 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-colors"
						>
							Return to Cart
						</button>
					</motion.div>
				</div>
			</main>
		);
	}

	// This component no longer directly redirects to order details
	// Instead, it redirects to order success page

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-md mx-auto bg-[#1a1d16] rounded-lg p-8 text-center"
				>
					<Loader2 className="w-12 h-12 text-[#c3e5a5] animate-spin mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-white mb-2">
						Processing...
					</h2>
					<p className="text-gray-400">
						Please wait while we process your request.
					</p>
				</motion.div>
			</div>
		</main>
	);
};

export default PaymentVerification;
