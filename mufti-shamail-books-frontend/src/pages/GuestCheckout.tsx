import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGuestCart } from "../contexts/GuestCartContext";
import { generatePaymentUrl } from "../apis/payment.api";
import { toast } from "react-toastify";
import { State } from "../apis/addresses.api";

interface GuestInfo {
	name: string;
	email: string;
	phone: string;
	address: {
		addressLine1: string;
		addressLine2?: string;
		city: string;
		state: State;
		pincode: string;
	};
}

const GuestCheckout = () => {
	const { guestCart, guestTotal } = useGuestCart();
	const [paymentLoading, setPaymentLoading] = useState(false);
	const [guestInfo, setGuestInfo] = useState<GuestInfo>({
		name: "",
		email: "",
		phone: "",
		address: {
			addressLine1: "",
			addressLine2: "",
			city: "",
			state: State.Delhi,
			pincode: "",
		},
	});

	const shipping = 50;
	const total = guestTotal + shipping;

	const handleInfoChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		if (name.includes("address.")) {
			const addressField = name.split(".")[1];
			setGuestInfo((prev) => ({
				...prev,
				address: {
					...prev.address,
					[addressField]: value,
				},
			}));
		} else {
			setGuestInfo((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const validateForm = () => {
		if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
			toast.error("Please fill all contact details");
			return false;
		}
		if (
			!guestInfo.address.addressLine1 ||
			!guestInfo.address.city ||
			!guestInfo.address.state ||
			!guestInfo.address.pincode
		) {
			toast.error("Please fill all address details");
			return false;
		}
		return true;
	};

	const handlePayment = async () => {
		if (!validateForm()) return;

		try {
			setPaymentLoading(true);
			const { redirectUrl } = await generatePaymentUrl(total, null, guestInfo);

			if (redirectUrl) {
				localStorage.setItem("guestInfo", JSON.stringify(guestInfo));
				localStorage.setItem("localCart", JSON.stringify(guestCart));
				window.location.href = redirectUrl;
			} else {
				throw new Error("No payment URL received");
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to initiate payment"
			);
		} finally {
			setPaymentLoading(false);
		}
	};

	if (!guestCart || guestCart.length === 0) {
		return <Navigate to="/cart" replace />;
	}

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17]/50 to-[#191a13]/50" />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<motion.div
							className="space-y-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<div className="bg-[#191b14] rounded-xl p-6 space-y-6">
								<h2 className="text-2xl font-bold text-[#c3e5a5]">
									Contact Details
								</h2>
								<div className="space-y-4">
									<input
										type="text"
										name="name"
										placeholder="Full Name *"
										value={guestInfo.name}
										onChange={handleInfoChange}
										className="w-full bg-[#24271b] text-white rounded-lg p-3"
										required
									/>
									<input
										type="email"
										name="email"
										placeholder="Email *"
										value={guestInfo.email}
										onChange={handleInfoChange}
										className="w-full bg-[#24271b] text-white rounded-lg p-3"
										required
									/>
									<input
										type="tel"
										name="phone"
										placeholder="Phone *"
										value={guestInfo.phone}
										onChange={handleInfoChange}
										className="w-full bg-[#24271b] text-white rounded-lg p-3"
										required
									/>
								</div>
							</div>

							<div className="bg-[#191b14] rounded-xl p-6 space-y-6">
								<h2 className="text-2xl font-bold text-[#c3e5a5]">
									Delivery Address
								</h2>
								<div className="space-y-4">
									<textarea
										name="address.addressLine1"
										placeholder="Address Line 1 *"
										value={guestInfo.address.addressLine1}
										onChange={handleInfoChange}
										rows={2}
										className="w-full bg-[#24271b] text-white rounded-lg p-3"
										required
									/>
									<textarea
										name="address.addressLine2"
										placeholder="Address Line 2 (Optional)"
										value={guestInfo.address.addressLine2}
										onChange={handleInfoChange}
										rows={2}
										className="w-full bg-[#24271b] text-white rounded-lg p-3"
									/>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input
											type="text"
											name="address.city"
											placeholder="City *"
											value={guestInfo.address.city}
											onChange={handleInfoChange}
											className="w-full bg-[#24271b] text-white rounded-lg p-3"
											required
										/>
										<select
											name="address.state"
											value={guestInfo.address.state}
											onChange={handleInfoChange}
											className="w-full bg-[#24271b] text-white rounded-lg p-3"
											required
										>
											{Object.values(State).map(
												(state) => (
													<option
														key={state}
														value={state}
													>
														{state}
													</option>
												)
											)}
										</select>
									</div>
									<input
										type="text"
										name="address.pincode"
										placeholder="Pincode *"
										value={guestInfo.address.pincode}
										onChange={handleInfoChange}
										pattern="[0-9]{6}"
										maxLength={6}
										className="w-full bg-[#24271b] text-white rounded-lg p-3"
										required
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="space-y-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<div className="bg-[#191b14] rounded-xl p-6 space-y-6">
								<h2 className="text-2xl font-bold text-[#c3e5a5]">
									Order Summary
								</h2>
								<div className="space-y-4">
									{guestCart.map((item) => (
										<div
											key={item._id}
											className="flex gap-4"
										>
											<div className="w-16 h-16">
												<img
													src={`${import.meta.env
														.VITE_API_URL
														}/${item.images[0]}`}
													alt={item.name}
													className="w-full h-full object-contain rounded-md"
												/>
											</div>
											<div className="flex-1">
												<p className="text-white">
													{item.name}
												</p>
												<p className="text-gray-400">
													Quantity: {item.quantity}
												</p>
												<p className="text-[#c3e5a5]">
													₹
													{item.price * item.quantity}
												</p>
											</div>
										</div>
									))}
								</div>

								<div className="border-t border-[#24271b] pt-4 space-y-4">
									<div className="flex justify-between">
										<span className="text-gray-400">
											Subtotal
										</span>
										<span className="text-white">
											₹{guestTotal}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">
											Shipping
										</span>
										<span className="text-white">
											₹{shipping}
										</span>
									</div>
									<div className="flex justify-between font-medium">
										<span className="text-white">
											Total
										</span>
										<span className="text-[#c3e5a5]">
											₹{total}
										</span>
									</div>
								</div>

								<button
									onClick={handlePayment}
									disabled={paymentLoading}
									className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{paymentLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										"Proceed to Payment"
									)}
								</button>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default GuestCheckout;
