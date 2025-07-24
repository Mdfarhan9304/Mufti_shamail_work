import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Home, Briefcase, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import {
	addNewAddress,
	Address,
	AddressType,
	State,
} from "../apis/addresses.api";
import { useAuth } from "../contexts/AuthContext";

const AddAddress = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated, setUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<Address>>({
		addressLine1: "",
		addressLine2: "",
		landmark: "",
		city: "",
		state: State.Delhi,
		pincode: "",
		isDefault: false,
		addressType: AddressType.Home,
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const value =
			e.target.type === "checkbox"
				? (e.target as HTMLInputElement).checked
				: e.target.value;
		setFormData((prev) => ({
			...prev,
			[e.target.name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.addressLine1 ||
			!formData.city ||
			!formData.state ||
			!formData.pincode
		) {
			toast.error("Please fill all required fields");
			return;
		}

		setIsLoading(true);
		try {
			const { data } = await addNewAddress(
				formData as Address,
				user!._id
			);
			setUser(data.user);
			toast.success("Address added successfully");
			navigate("/dashboard?tab=addresses");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to add address"
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
	if (user.role === "admin")
		return <Navigate to="/admin/dashboard" replace />;

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />
				<div className="max-w-3xl mx-auto px-6 lg:px-8">
					<motion.div
						className="bg-[#191b14] rounded-2xl p-8 shadow-xl relative z-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-8">
							Add New Address
						</h1>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4 md:col-span-2">
									<div className="flex gap-4">
										{Object.values(AddressType).map(
											(type) => (
												<label
													key={type}
													className={`flex-1 flex items-center gap-2 p-4 rounded-lg cursor-pointer transition-all ${
														formData.addressType ===
														type
															? "bg-[#c3e5a5] text-gray-800"
															: "bg-[#24271b] text-gray-400"
													}`}
												>
													<input
														type="radio"
														name="addressType"
														value={type}
														checked={
															formData.addressType ===
															type
														}
														onChange={handleChange}
														className="hidden"
													/>
													{type ===
														AddressType.Home && (
														<Home className="w-5 h-5" />
													)}
													{type ===
														AddressType.Work && (
														<Briefcase className="w-5 h-5" />
													)}
													{type ===
														AddressType.Other && (
														<MapPin className="w-5 h-5" />
													)}
													{type}
												</label>
											)
										)}
									</div>
								</div>

								<div className="md:col-span-2">
									<textarea
										name="addressLine1"
										placeholder="Address Line 1 *"
										value={formData.addressLine1}
										onChange={handleChange}
										rows={2}
										className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
										required
									/>
								</div>

								<div className="md:col-span-2">
									<textarea
										name="addressLine2"
										placeholder="Address Line 2 (Optional)"
										value={formData.addressLine2}
										onChange={handleChange}
										rows={2}
										className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									/>
								</div>

								<input
									type="text"
									name="landmark"
									placeholder="Landmark (Optional)"
									value={formData.landmark}
									onChange={handleChange}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
								/>

								<input
									type="text"
									name="city"
									placeholder="City *"
									value={formData.city}
									onChange={handleChange}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								/>

								<select
									name="state"
									value={formData.state}
									onChange={handleChange}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								>
									{Object.values(State).map((state) => (
										<option key={state} value={state}>
											{state}
										</option>
									))}
								</select>

								<input
									type="text"
									name="pincode"
									placeholder="Pincode *"
									value={formData.pincode}
									onChange={handleChange}
									pattern="[0-9]{6}"
									maxLength={6}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								/>

								<div className="md:col-span-2">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											name="isDefault"
											checked={formData.isDefault}
											onChange={handleChange}
											className="form-checkbox h-5 w-5 text-[#c3e5a5] rounded border-gray-600 bg-[#24271b] focus:ring-[#c3e5a5]"
										/>
										<span className="text-gray-400">
											Set as default address
										</span>
									</label>
								</div>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Add Address"
								)}
							</button>
						</form>
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default AddAddress;
