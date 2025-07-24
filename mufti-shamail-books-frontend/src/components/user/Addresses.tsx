import { motion } from "framer-motion";
import {
	Edit,
	Plus,
	Home,
	Briefcase,
	MapPin,
	Loader2,
	Trash,
	Save,
	X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
	Address,
	AddressType,
	getAddresses,
	removeAddress,
	State,
	updateExistingAddress,
} from "../../apis/addresses.api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const getAddressIcon = (type: Address["addressType"]) => {
	switch (type) {
		case "Home":
			return <Home className="w-5 h-5 text-[#c3e5a5]" />;
		case "Work":
			return <Briefcase className="w-5 h-5 text-[#c3e5a5]" />;
		default:
			return <MapPin className="w-5 h-5 text-[#c3e5a5]" />;
	}
};

const AddressCard = ({
	address,
	onUpdate,
	onDelete,
}: {
	address: Address;
	onUpdate: (id: string, updatedAddress: Address) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [editedAddress, setEditedAddress] = useState(address);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setEditedAddress((prev) => ({
			...prev,
			[name]:
				name === "isDefault"
					? (e.target as HTMLInputElement).checked
					: value,
		}));
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			await onUpdate(address._id!, editedAddress);
			setIsEditing(false);
			toast.success("Address updated successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Update failed"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this address?"))
			return;

		setIsLoading(true);
		try {
			await onDelete(address._id!);
			toast.success("Address deleted successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Delete failed"
			);
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			className="bg-[#191b14] p-6 rounded-xl shadow-lg border border-[#24271b] hover:border-[#c3e5a5]/20 transition-all"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<div className="flex justify-between items-start mb-4">
				{isEditing ? (
					<select
						name="addressType"
						value={editedAddress.addressType}
						onChange={handleChange}
						className="bg-[#24271b] text-[#c3e5a5] rounded-lg px-3 py-1.5"
					>
						{Object.values(AddressType).map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				) : (
					<div className="flex items-center gap-3 bg-[#24271b] px-3 py-1.5 rounded-lg">
						{getAddressIcon(address.addressType)}
						<span className="text-[#c3e5a5] font-medium capitalize">
							{address.addressType.toLowerCase()}
						</span>
					</div>
				)}

				<div className="flex gap-2">
					{!isEditing ? (
						<>
							<button
								onClick={() => setIsEditing(true)}
								className="p-2 hover:bg-[#24271b] rounded-lg transition-colors group"
							>
								<Edit className="w-4 h-4 text-[#c3e5a5]" />
							</button>
							<button
								onClick={handleDelete}
								disabled={isLoading}
								className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
							>
								<Trash className="w-4 h-4 text-red-500" />
							</button>
						</>
					) : (
						<>
							<button
								onClick={handleSave}
								disabled={isLoading}
								className="p-2 hover:bg-[#24271b] rounded-lg transition-colors group"
							>
								{isLoading ? (
									<Loader2 className="w-4 h-4 text-[#c3e5a5] animate-spin" />
								) : (
									<Save className="w-4 h-4 text-[#c3e5a5]" />
								)}
							</button>
							<button
								onClick={() => {
									setIsEditing(false);
									setEditedAddress(address);
								}}
								className="p-2 hover:bg-[#24271b] rounded-lg transition-colors group"
							>
								<X className="w-4 h-4 text-gray-400" />
							</button>
						</>
					)}
				</div>
			</div>

			{isEditing ? (
				<div className="space-y-4">
					<textarea
						name="addressLine1"
						value={editedAddress.addressLine1}
						onChange={handleChange}
						className="w-full bg-[#24271b] text-white rounded-lg p-3"
						placeholder="Address Line 1"
						rows={2}
					/>
					<textarea
						name="addressLine2"
						value={editedAddress.addressLine2}
						onChange={handleChange}
						className="w-full bg-[#24271b] text-white rounded-lg p-3"
						placeholder="Address Line 2 (Optional)"
						rows={2}
					/>
					<input
						name="landmark"
						value={editedAddress.landmark}
						onChange={handleChange}
						className="w-full bg-[#24271b] text-white rounded-lg p-3"
						placeholder="Landmark"
					/>
					<div className="grid grid-cols-2 gap-4">
						<input
							name="city"
							value={editedAddress.city}
							onChange={handleChange}
							className="w-full bg-[#24271b] text-white rounded-lg p-3"
							placeholder="City"
						/>
						<input
							name="pincode"
							value={editedAddress.pincode}
							onChange={handleChange}
							className="w-full bg-[#24271b] text-white rounded-lg p-3"
							placeholder="Pincode"
						/>
					</div>
					<select
						name="state"
						value={editedAddress.state}
						onChange={handleChange}
						className="w-full bg-[#24271b] text-white rounded-lg p-3"
					>
						{Object.values(State).map((state) => (
							<option key={state} value={state}>
								{state}
							</option>
						))}
					</select>
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							name="isDefault"
							checked={editedAddress.isDefault}
							onChange={handleChange}
							className="form-checkbox h-5 w-5 text-[#c3e5a5] rounded border-gray-600 bg-[#24271b]"
						/>
						<span className="text-gray-400">
							Set as default address
						</span>
					</label>
				</div>
			) : (
				<div className="space-y-3 text-gray-400">
					<p className="text-white">{address.addressLine1}</p>
					{address.addressLine2 && (
						<p className="text-gray-400">{address.addressLine2}</p>
					)}
					<p className="text-sm">{`${address.city}, ${address.state} - ${address.pincode}`}</p>
					{address.landmark && (
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="w-4 h-4 text-[#c3e5a5]" />
							<p>{address.landmark}</p>
						</div>
					)}
				</div>
			)}

			{address.isDefault && !isEditing && (
				<span className="inline-block px-3 py-1 bg-[#24271b] text-[#c3e5a5] text-sm rounded-full mt-4 border border-[#c3e5a5]/20">
					Default Address
				</span>
			)}
		</motion.div>
	);
};

const Addresses = () => {
	const { user, setUser } = useAuth();
	const navigate = useNavigate();
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				setLoading(true);
				const response = await getAddresses(user!._id);
				console.log(response);
				setAddresses(response.data.addresses);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to fetch addresses"
				);
			} finally {
				setLoading(false);
			}
		};

		if (user?._id) {
			fetchAddresses();
		}
	}, [user?._id]);

	const handleAddNew = () => {
		navigate("/addresses/new");
	};

	const handleUpdate = async (id: string, updatedAddress: Address) => {
		const response = await updateExistingAddress(
			id,
			updatedAddress,
			user!._id
		);
		console.log(response.data.user);
		setUser(response.data.user);
		setAddresses(response.data.user.addresses);
	};

	const handleDelete = async (id: string) => {
		const response = await removeAddress(id, user!._id);
		setUser(response.data.user);
		setAddresses(response.data.user.addresses);
	};

	if (loading) {
		return (
			<div className="grid place-items-center h-96">
				<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
			</div>
		);
	}

	return (
		<motion.div
			className="space-y-8"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-[#c3e5a5]">
					Your Addresses
				</h2>
				<button
					onClick={handleAddNew}
					className="px-4 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-all flex items-center gap-2 font-medium"
				>
					<Plus className="w-4 h-4" />
					Add New Address
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{addresses?.map((address) => (
					<AddressCard
						key={address._id}
						address={address}
						onUpdate={handleUpdate}
						onDelete={handleDelete}
					/>
				))}
			</div>

			{addresses && addresses.length === 0 && (
				<motion.div
					className="bg-[#191b14] p-8 rounded-xl text-center border border-[#24271b] shadow-lg"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<MapPin className="w-12 h-12 text-[#c3e5a5]/50 mx-auto mb-4" />
					<p className="text-gray-400 mb-6">No addresses added yet</p>
					<button
						onClick={handleAddNew}
						className="px-6 py-3 bg-[#24271b] text-[#c3e5a5] rounded-lg hover:bg-[#2f332a] transition-all flex items-center gap-2 mx-auto"
					>
						<Plus className="w-4 h-4" />
						Add Your First Address
					</button>
				</motion.div>
			)}
		</motion.div>
	);
};

export default Addresses;
