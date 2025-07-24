import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronFirst, ChevronLastIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Profile from "./Profile";
import Orders from "./Orders";
import TabNavigation from "./TabNavigation";
import { Navigate, useSearchParams } from "react-router-dom";
import Addresses from "./Addresses";

const Dashboard = () => {
	const [searchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState("profile");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, logout, isAuthenticated } = useAuth();

	console.log(user, isAuthenticated);

	const tabs = {
		profile: "Profile",
		orders: "Orders",
		addresses: "Addresses",
	};

	useEffect(() => {
		const tabFromUrl = searchParams.get("tab");
		if (tabFromUrl && Object.keys(tabs).includes(tabFromUrl)) {
			setActiveTab(tabFromUrl);
		}
	}, [searchParams]);

	if (isAuthenticated) {
		if (user?.role !== "user") {
			<Navigate to="/admin/dashboard" replace />;
		}
	} else <Navigate to="/login" replace />;

	const renderTabContent = () => {
		switch (activeTab) {
			case "profile":
				return <Profile />;
			case "orders":
				return <Orders />;
			case "addresses":
				return <Addresses />;
			default:
				return <Profile />;
		}
	};

	return (
		<main className="min-h-screen bg-[#121510]">
			{/* Mobile Header */}
			<div className="md:hidden fixed top-20 left-0 right-0 bg-[#191b14] p-4 z-50 flex items-center justify-start">
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 text-[#c3e5a5]"
				>
					{isMobileMenuOpen ? (
						<ChevronFirst size={24} />
					) : (
						<ChevronLastIcon size={24} />
					)}
				</button>
				<h1 className="text-xl font-bold text-[#c3e5a5]">
					{tabs[activeTab as keyof typeof tabs]}
				</h1>
			</div>

			<div className="flex min-h-screen pt-16 md:pt-20">
				{/* Sidebar - Mobile (Animated) */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.aside
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "tween" }}
							className="fixed inset-0 bg-[#191b14] w-64 z-40 p-6 md:hidden"
						>
							<div className="mt-36  mb-5">
								<h1 className="text-2xl font-bold text-[#c3e5a5]">
									Dashboard
								</h1>
								<p className="text-gray-400">
									Welcome back, {user?.name}
								</p>
							</div>

							<TabNavigation
								activeTab={activeTab}
								setActiveTab={(tab) => {
									setActiveTab(tab);
									setIsMobileMenuOpen(false);
								}}
							/>

							<button
								onClick={logout}
								className="w-full mt-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
							>
								Logout
							</button>
						</motion.aside>
					)}
				</AnimatePresence>

				{/* Sidebar - Desktop */}
				<aside className="hidden mt-8 md:block bg-[#191b14] w-1/4 min-h-screen p-8 shadow-xl">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-[#c3e5a5]">
							Dashboard
						</h1>
						<p className="text-gray-400">
							Welcome back, {user?.name}
						</p>
					</div>

					<TabNavigation
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>

					<button
						onClick={logout}
						className="w-full mt-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
					>
						Logout
					</button>
				</aside>

				{/* Main Content */}
				<section className="flex-1 p-5 mt-24 md:mt-0 md:p-8">
					<motion.div
						className="bg-[#191b14] rounded-2xl p-4 md:p-8 shadow-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						{renderTabContent()}
					</motion.div>
				</section>
			</div>
		</main>
	);
};

export default Dashboard;
