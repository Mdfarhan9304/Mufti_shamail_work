import { motion } from "framer-motion";
import { Loader2, LogOut } from "lucide-react";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
	const { user, logout, isLoading, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const dummyOrders = [
		{ id: 1, status: "Completed", item: "Book 1", date: "2023-01-01" },
		{ id: 2, status: "Ongoing", item: "Book 2", date: "2023-01-05" },
		{ id: 3, status: "Completed", item: "Book 3", date: "2023-01-10" },
	];

	const previousOrders = dummyOrders.filter(
		(order) => order.status === "Completed"
	);
	const ongoingOrders = dummyOrders.filter(
		(order) => order.status === "Ongoing"
	);

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
					<div className="mt-8 space-y-4">
						<div className="text-white">
							<p>Name: {user?.name}</p>
							<p>Email: {user?.email}</p>
						</div>
						<button
							onClick={handleLogout}
							className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-600 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all"
						>
							Logout
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								<LogOut className="w-5 h-5" />
							)}
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
						<div className="space-y-8">
							<div className="text-center md:text-left">
								<h2 className="text-2xl font-bold text-[#c3e5a5] mb-4">
									Ongoing Orders
								</h2>
								<div className="space-y-4">
									{ongoingOrders.map((order) => (
										<div
											key={order.id}
											className="bg-[#24271b] p-4 rounded-lg shadow-md"
										>
											<p>Item: {order.item}</p>
											<p>Status: {order.status}</p>
											<p>Date: {order.date}</p>
										</div>
									))}
								</div>
							</div>

							<div className="text-center md:text-left">
								<h2 className="text-2xl font-bold text-[#c3e5a5] mb-4">
									Previous Orders
								</h2>
								<div className="space-y-4">
									{previousOrders.map((order) => (
										<div
											key={order.id}
											className="bg-[#24271b] p-4 rounded-lg shadow-md"
										>
											<p>Item: {order.item}</p>
											<p>Status: {order.status}</p>
											<p>Date: {order.date}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</motion.div>
				</section>
			</div>
		</main>
	);
};

export default Dashboard;
