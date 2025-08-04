import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Edit, Loader2, Save } from "lucide-react";
import { updateUserProfile } from "../../apis/user.api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const Profile = () => {
	const { user, setUser } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [editedProfile, setEditedProfile] = useState({
		name: "",
		email: "",
		phone: ""
	});

	// Update editedProfile when user data is loaded
	useEffect(() => {
		if (user) {
			setEditedProfile({
				name: user.name || "",
				email: user.email || "",
				phone: user.phone || ""
			});
		}
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditedProfile((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const { data } = await updateUserProfile({
				...editedProfile,
				_id: user?._id,
			});
			setUser(data.user);
			setIsEditing(false);
			toast.success("Profile updated successfully");
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.response) {
				toast.error("Update failed: " + err.response.data.error);
			} else {
				toast.error("Update failed: " + (err as Error).message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-[#c3e5a5]">Profile</h2>
				{!isEditing ? (
					<button
						onClick={() => setIsEditing(true)}
						className="px-4 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-all flex items-center gap-2"
					>
						Edit Profile
						<Edit className="w-4 h-4" />
					</button>
				) : (
					<button
						onClick={handleSave}
						disabled={isLoading}
						className="px-4 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-all disabled:opacity-50 flex items-center gap-2"
					>
						{isLoading ? (
							<>
								Saving...
								<Loader2 className="w-4 h-4 animate-spin" />
							</>
						) : (
							<>
								Save Changes <Save className="w-4 h-4" />
							</>
						)}
					</button>
				)}
			</div>
			<div className="bg-[#24271b] p-4 md:p-6 rounded-lg">
				<div className="space-y-4">
					<div>
						<label className="text-gray-400">Full Name</label>
						<input
							type="text"
							name="name"
							className="w-full bg-[#191b14] text-white rounded-lg p-3 mt-1"
							value={isEditing ? editedProfile.name : user?.name || ""}
							onChange={handleChange}
							readOnly={!isEditing}
						/>
					</div>
					<div>
						<label className="text-gray-400">Email</label>
						<input
							type="email"
							name="email"
							className="w-full bg-[#191b14] text-white rounded-lg p-3 mt-1"
							value={isEditing ? editedProfile.email : user?.email || ""}
							onChange={handleChange}
							readOnly={!isEditing}
						/>
					</div>
					<div>
						<label className="text-gray-400">Phone</label>
						<input
							type="tel"
							name="phone"
							className="w-full bg-[#191b14] text-white rounded-lg p-3 mt-1"
							value={isEditing ? editedProfile.phone : user?.phone || ""}
							onChange={handleChange}
							readOnly={!isEditing}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Profile;
