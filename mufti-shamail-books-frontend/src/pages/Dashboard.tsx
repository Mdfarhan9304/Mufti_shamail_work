import { motion } from "framer-motion";
import { Loader2, LogOut, Package, MapPin, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Orders from "../components/user/Orders";
import Addresses from "../components/user/Addresses";

const Dashboard: React.FC = () => {
	const { user, logout, isLoading, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

	// Get tab from URL params
	useEffect(() => {
		const tab = searchParams.get('tab');
		if (tab && ['profile', 'orders', 'addresses'].includes(tab)) {
			setActiveTab(tab as 'profile' | 'orders' | 'addresses');
		}
	}, [searchParams]);

	// Update URL when tab changes
	const handleTabChange = (tab: 'profile' | 'orders' | 'addresses') => {
		setActiveTab(tab);
		setSearchParams({ tab });
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	if (isAuthenticated) {
		if (user?.role !== "user") {
			<Navigate to="/admin/dashboard" replace />;
		}
	} else <Navigate to="/login" replace />;

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<div className="flex flex-col md:flex-row">
				{/* Sidebar */}
				<aside className="bg-[#191b14] w-full md:w-1/4 h-[90vh] p-6 md:p-8 shadow-xl">
					<div className="text-center md:text-left">
						<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-4">
							Assalamu Alaikum, {user?.name}
						</h1>
						<p className="text-gray-400">
							Welcome to your dashboard
						</p>
					</div>
					
					{/* Navigation Menu */}
					<div className="mt-8 space-y-2">
						<button
							onClick={() => handleTabChange('profile')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
								activeTab === 'profile'
									? 'bg-[#c3e5a5] text-gray-800'
									: 'text-gray-300 hover:bg-[#24271b] hover:text-white'
							}`}
						>
							<User className="w-5 h-5" />
							Profile
						</button>
						<button
							onClick={() => handleTabChange('orders')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
								activeTab === 'orders'
									? 'bg-[#c3e5a5] text-gray-800'
									: 'text-gray-300 hover:bg-[#24271b] hover:text-white'
							}`}
						>
							<Package className="w-5 h-5" />
							My Orders
						</button>
						<button
							onClick={() => handleTabChange('addresses')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
								activeTab === 'addresses'
									? 'bg-[#c3e5a5] text-gray-800'
									: 'text-gray-300 hover:bg-[#24271b] hover:text-white'
							}`}
						>
							<MapPin className="w-5 h-5" />
							My Addresses
						</button>
					</div>

					{/* User Info & Logout */}
					<div className="mt-8 pt-8 border-t border-[#24271b] space-y-4">
						<div className="text-white text-sm">
							<p>Name: {user?.name}</p>
							<p>Email: {user?.email}</p>
						</div>
						<button
							onClick={handleLogout}
							className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								<LogOut className="w-5 h-5" />
							)}
							Logout
						</button>
					</div>
				</aside>

				{/* Main Content */}
				<section className="flex-1 p-6 md:p-8">
					<motion.div
						className="bg-[#191b14] rounded-2xl p-4 md:p-8 shadow-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						{activeTab === 'profile' && (
							<div className="space-y-6">
								<h2 className="text-2xl md:text-3xl font-bold text-[#c3e5a5] mb-6">
									Profile Information
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-[#24271b] p-6 rounded-lg">
										<h3 className="text-lg font-semibold text-[#c3e5a5] mb-4">Personal Details</h3>
										<div className="space-y-3 text-white">
											<div>
												<span className="text-gray-400">Name: </span>
												<span>{user?.name}</span>
											</div>
											<div>
												<span className="text-gray-400">Email: </span>
												<span>{user?.email}</span>
											</div>
											<div>
												<span className="text-gray-400">Phone: </span>
												<span>{user?.phone || 'Not provided'}</span>
											</div>
										</div>
									</div>
									<div className="bg-[#24271b] p-6 rounded-lg">
										<h3 className="text-lg font-semibold text-[#c3e5a5] mb-4">Account Status</h3>
										<div className="space-y-3 text-white">
											<div>
												<span className="text-gray-400">Role: </span>
												<span className="capitalize">{user?.role}</span>
											</div>
											<div>
												<span className="text-gray-400">Member Since: </span>
												<span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
						{activeTab === 'orders' && <Orders />}
						{activeTab === 'addresses' && <Addresses />}
					</motion.div>
				</section>
			</div>
		</main>
	);
};

export default Dashboard;
