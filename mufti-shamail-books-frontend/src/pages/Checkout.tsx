import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
	Loader2,
	Home,
	Briefcase,
	MapPin,
	ChevronDown,
	ArrowLeft,
	Plus,
} from "lucide-react";
import { Address, AddressType } from "../apis/addresses.api";
import { toast } from "react-toastify";
import { generatePaymentUrl } from "../apis/payment.api";
import { getAddressIcon } from "../components/user/Addresses";
import { getImageUrl } from "../utils/imageUtils";

const AddressSelector = ({
	addresses,
	selectedAddress,
	onSelect,
	isOpen,
	setIsOpen,
}: {
	addresses: Address[];
	selectedAddress?: Address;
	onSelect: (address: Address) => void;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) => {
	const getAddressIcon = (type: AddressType) => {
		switch (type) {
			case AddressType.Home:
				return <Home className="w-5 h-5 text-[#c3e5a5]" />;
			case AddressType.Work:
				return <Briefcase className="w-5 h-5 text-[#c3e5a5]" />;
			default:
				return <MapPin className="w-5 h-5 text-[#c3e5a5]" />;
		}
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between bg-[#24271b] p-3 rounded-lg text-white hover:bg-[#2f332a] transition-colors"
			>
				<span>Select Delivery Address</span>
				<ChevronDown
					className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""
						}`}
				/>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute z-50 w-full mt-2 bg-[#191b14] rounded-xl shadow-xl border border-[#24271b] max-h-[300px] overflow-y-auto"
					>
						{addresses.map((address) => (
							<button
								key={address._id}
								onClick={() => {
									onSelect(address);
									setIsOpen(false);
								}}
								className={`w-full p-4 flex items-start gap-3 hover:bg-[#24271b] transition-colors ${selectedAddress?._id === address._id
									? "bg-[#24271b]"
									: ""
									}`}
							>
								{getAddressIcon(address.addressType)}
								<div className="text-left">
									<div className="flex items-center gap-2">
										<span className="text-[#c3e5a5] font-medium">
											{address.addressType}
										</span>
										{address.isDefault && (
											<span className="text-xs px-2 py-0.5 bg-[#c3e5a5]/10 text-[#c3e5a5] rounded-full">
												Default
											</span>
										)}
									</div>
									<p className="text-white text-sm mt-1">
										{address.addressLine1}
									</p>
									{address.addressLine2 && (
										<p className="text-gray-400 text-sm">
											{address.addressLine2}
										</p>
									)}
									<p className="text-gray-400 text-sm mt-1">
										{`${address.city}, ${address.state} - ${address.pincode}`}
									</p>
								</div>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const Checkout = () => {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
	const [paymentLoading, setPaymentLoading] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
		user?.addresses?.find((addr) => addr.isDefault)
	);
	const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

	const subtotal = user?.cart?.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);
	const shipping = 50;
	const total = (subtotal || 0) + shipping;

	const handlePayment = async () => {
		if (!selectedAddress) {
			toast.error("Please add a delivery address before making payment");
			return;
		}

		try {
			setPaymentLoading(true);
			const { redirectUrl } = await generatePaymentUrl(total);
			if (redirectUrl) {
				// Store complete address object instead of just the string
				localStorage.setItem(
					"selectedAddress",
					JSON.stringify({
						addressLine1: selectedAddress.addressLine1,
						addressLine2: selectedAddress.addressLine2 || "",
						landmark: selectedAddress.landmark || "",
						city: selectedAddress.city,
						state: selectedAddress.state,
						pincode: selectedAddress.pincode,
						addressType: selectedAddress.addressType,
					})
				);
				localStorage.setItem("localCart", JSON.stringify(user?.cart));
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
			setPaymentLoading(false);
		}
	};

	if (isLoading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
			</main>
		);
	}

	if (!user) return <Navigate to="/login" replace />;
	if (user.cart.length === 0) return <Navigate to="/cart" replace />;

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17]/50 to-[#191a13]/50" />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
					<div className="flex items-center gap-4 mb-8">
						<button
							onClick={() => navigate(-1)}
							className="p-2 hover:bg-[#24271b] rounded-full transition-colors"
						>
							<ArrowLeft className="w-6 h-6 text-[#c3e5a5]" />
						</button>
						<h1 className="text-4xl md:text-5xl font-bold text-[#c3e5a5]">
							Checkout
						</h1>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Delivery Details */}
						<motion.div
							className="space-y-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className="bg-[#191b14] rounded-xl p-6 space-y-6">
								<div className="flex justify-between items-center">
									<h2 className="text-2xl font-bold text-[#c3e5a5]">
										Delivery Details
									</h2>
									{(!user?.addresses || user.addresses.length === 0) && (
										<button
											onClick={() => navigate("/addresses/new")}
											className="flex items-center gap-2 px-4 py-2 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all"
										>
											<Plus className="w-4 h-4" />
											Add Address
										</button>
									)}
								</div>
								<div className="space-y-6">
									{user?.addresses && user.addresses.length > 0 ? (
										<>
											<AddressSelector
												addresses={user.addresses}
												selectedAddress={selectedAddress}
												onSelect={setSelectedAddress}
												isOpen={isAddressModalOpen}
												setIsOpen={setIsAddressModalOpen}
											/>

											{selectedAddress ? (
												<motion.div
													className="bg-[#24271b] p-4 rounded-lg space-y-3"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
												>
													<div className="flex items-center gap-2">
														{getAddressIcon(
															selectedAddress.addressType
														)}
														<span className="text-[#c3e5a5] font-medium">
															{selectedAddress.addressType}
														</span>
													</div>
													<p className="text-white">
														{selectedAddress.addressLine1}
													</p>
													{selectedAddress.addressLine2 && (
														<p className="text-gray-400">
															{selectedAddress.addressLine2}
														</p>
													)}
													<p className="text-gray-400">
														{`${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}
													</p>
												</motion.div>
											) : (
												<div className="bg-[#24271b] p-4 rounded-lg text-gray-400">
													Please select a delivery address to place your order.
												</div>
											)}
										</>
									) : (
										<div className="bg-[#24271b] p-6 rounded-lg space-y-4">
											<p className="text-gray-400 text-center">
												You haven't added any delivery addresses yet.
											</p>
											<button
												onClick={() => navigate("/addresses/new")}
												className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#c3e5a5] text-gray-800 rounded-lg font-medium hover:bg-[#a1c780] transition-all"
											>
												<Plus className="w-5 h-5" />
												Add Your First Address
											</button>
										</div>
									)}

									<div className="space-y-2">
										<span className="text-gray-400">Email</span>
										<p className="text-white bg-[#24271b] rounded-lg p-3">
											{user?.email}
										</p>
									</div>
									<div className="space-y-2">
										<span className="text-gray-400">Phone</span>
										<p className="text-white bg-[#24271b] rounded-lg p-3">
											{user?.phone}
										</p>
									</div>
									<div className="space-y-2">
										<span className="text-gray-400">Name</span>
										<p className="text-white bg-[#24271b] rounded-lg p-3">
											{user?.name}
										</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Order Summary */}
						<motion.div
							className="space-y-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="bg-[#191b14] rounded-xl p-6 space-y-6">
								<h2 className="text-2xl font-bold text-[#c3e5a5]">
									Order Summary
								</h2>
								<div className="space-y-4">
									{user?.cart?.map((item) => (
										<div
											key={item._id}
											className="flex gap-4 py-4 border-b border-gray-800"
										>
											<img
												src={item.images && item.images.length > 0 
													? getImageUrl(item.images[0])
													: '/vite.svg' // fallback image
												}
												alt={item.name}
												className="w-20 h-20 object-contain rounded-lg"
											/>
											<div className="flex-1">
												<h3 className="text-white font-medium">
													{item.name}
												</h3>
												<p className="text-gray-400">
													Quantity: {item.quantity}
												</p>
												<p className="text-[#c3e5a5]">
													₹{(item.price * item.quantity).toFixed(2)}
												</p>
											</div>
										</div>
									))}

									<div className="space-y-2 pt-4">
										<div className="flex justify-between text-gray-400">
											<span>Subtotal</span>
											<span>₹{subtotal?.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-gray-400">
											<span>Shipping</span>
											<span>₹{shipping.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-xl font-bold text-[#c3e5a5] pt-2 border-t border-gray-800">
											<span>Total</span>
											<span>₹{total.toFixed(2)}</span>
										</div>
									</div>
								</div>
							</div>

							<button
								onClick={handlePayment}
								disabled={paymentLoading || !selectedAddress}
								className="w-full px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
							>
								{paymentLoading ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Processing...
									</>
								) : (
									"Make Payment"
								)}
							</button>
						</motion.div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Checkout;
