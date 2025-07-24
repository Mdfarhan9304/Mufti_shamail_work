import { motion } from "framer-motion";
import { Copy, IndianRupee } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminOrders } from "../apis/orders.api";

interface OrderStats {
	totalOrders: number;
	totalRevenue: number;
	ordersByStatus: {
		[key: string]: number;
	};
}

interface Order {
	_id: string;
	user: {
		_id: string;
		name: string;
		email: string;
	};
	orderNumber: string;
	txnId: string;
	items: {
		_id: string;
		name: string;
		description: string;
		author: string;
		price: number;
		images: string[];
		quantity: number;
	}[];
	contactDetails: {
		phone: string;
		email: string;
		name: string;
	};
	shippingAddress: {
		addressLine1: string;
		addressLine2: string;
		landmark: string;
		city: string;
		state: string;
		pincode: string;
		isDefault: boolean;
		addressType: string;
		_id: string;
	};
	status: string;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

const AdminDashboard = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [stats, setStats] = useState<OrderStats>({
		totalOrders: 0,
		totalRevenue: 0,
		ordersByStatus: {},
	});
	const { user, isAuthenticated } = useAuth();

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		alert("Copied to clipboard!");
	};

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await getAdminOrders();
				console.log("response", response.data.orders);
				setOrders(response.data.orders);
				setStats(response.data.stats);
			} catch (error) {
				console.error("Failed to fetch orders:", error);
			}
		};
		fetchOrders();
	}, []);

	if (isAuthenticated) {
		if (user?.role !== "admin") {
			return <Navigate to="/dashboard" replace />;
		}
	} else return <Navigate to="/login" replace />;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleStatusChange = async (orderId: string, newStatus: string) => {
		try {
			await updateOrderStatus(orderId, newStatus);
			toast.success("Order status updated successfully");
		} catch (error) {
			toast.error("Failed to update order status");
		}
	};

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<div className="flex flex-col md:flex-row">
				{/* Sidebar */}
				<aside className="bg-[#191b14] w-full md:w-1/4 h-[90vh] p-6 md:p-8 shadow-xl">
					<div className="text-center md:text-left space-y-6">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-4">
								Admin Dashboard
							</h1>
							<p className="text-gray-400">
								Manage orders and customers
							</p>
						</div>

						{/* Stats */}
						<div className="space-y-4">
							<div className="bg-[#24271b] p-4 rounded-lg">
								<h3 className="text-[#c3e5a5] font-bold mb-2">Total Orders</h3>
								<p className="text-2xl text-white">{stats.totalOrders}</p>
							</div>
							<div className="bg-[#24271b] p-4 rounded-lg">
								<h3 className="text-[#c3e5a5] font-bold mb-2">Total Revenue</h3>
								<p className="text-2xl text-white flex items-center">
									<IndianRupee className="w-5 h-5 mr-1" />
									{stats.totalRevenue}
								</p>
							</div>
							<div className="bg-[#24271b] p-4 rounded-lg">
								<h3 className="text-[#c3e5a5] font-bold mb-2">Order Status</h3>
								{Object.entries(stats.ordersByStatus).map(([status, count]) => (
									<div key={status} className="flex justify-between text-white">
										<span className="capitalize">{status}</span>
										<span>{count}</span>
									</div>
								))}
							</div>
						</div>
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
									Recent Orders
								</h2>
								<div className="space-y-4">
									{orders.map((order) => (
										<div
											key={order._id}
											className="bg-[#24271b] p-4 rounded-lg shadow-md"
										>
											<div className="flex justify-between items-center">
												<div className="space-y-2">
													<p className="text-white">
														<strong>Order ID:</strong>{" "}
														<span className="text-gray-400">{order.orderNumber}</span>
													</p>
													<p className="text-white">
														<strong>Transaction ID:</strong>{" "}
														<span className="text-gray-400">{order.txnId}</span>
													</p>
													<p className="text-white">
														<strong>Date:</strong>{" "}
														<span className="text-gray-400">
															{formatDate(order.createdAt)}
														</span>
													</p>
												</div>
											</div>

											<div className="mt-4">
												<h3 className="text-xl font-bold text-[#c3e5a5] mb-2">
													Customer Details
												</h3>
												<div className="space-y-2">
													<p
														className="text-gray-400 cursor-pointer"
														onClick={() =>
															copyToClipboard(order.contactDetails.name)
														}
													>
														<strong>Name:</strong> {order.contactDetails.name}{" "}
														<Copy className="inline w-4 h-4 ml-2" />
													</p>
													<p
														className="text-gray-400 cursor-pointer"
														onClick={() =>
															copyToClipboard(order.contactDetails.email)
														}
													>
														<strong>Email:</strong> {order.contactDetails.email}{" "}
														<Copy className="inline w-4 h-4 ml-2" />
													</p>
													<p
														className="text-gray-400 cursor-pointer"
														onClick={() =>
															copyToClipboard(order.contactDetails.phone)
														}
													>
														<strong>Phone:</strong> {order.contactDetails.phone}{" "}
														<Copy className="inline w-4 h-4 ml-2" />
													</p>
												</div>
											</div>
											<div className="mt-4">
												<h3 className="text-xl font-bold text-[#c3e5a5] mb-2">
													Order Status
												</h3>
												<p className="text-gray-400">{order.status}</p>
												<select
													value={order.status}
													onChange={(e) => handleStatusChange(order._id, e.target.value)}
													className="bg-[#24271b] text-white rounded px-3 py-1 border border-[#c3e5a5] focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
												>
													<option value="pending">Pending</option>
													<option value="shipped">Shipped</option>
													<option value="delivered">Delivered</option>
												</select>
											</div>

											<div className="mt-4">
												<h3 className="text-xl font-bold text-[#c3e5a5] mb-2">
													Shipping Address
												</h3>
												<p
													className="text-gray-400 cursor-pointer"
													onClick={() =>
														copyToClipboard(
															`${order.shippingAddress.addressLine1}, ${
																order.shippingAddress.addressLine2
																	? order.shippingAddress.addressLine2 + ", "
																	: ""
															}${
																order.shippingAddress.landmark
																	? order.shippingAddress.landmark + ", "
																	: ""
															}${order.shippingAddress.city}, ${
																order.shippingAddress.state
															} - ${order.shippingAddress.pincode}`
														)
													}
												>
													{order.shippingAddress.addressLine1}
													{order.shippingAddress.addressLine2 && (
														<>, {order.shippingAddress.addressLine2}</>
													)}
													{order.shippingAddress.landmark && (
														<>, {order.shippingAddress.landmark}</>
													)}
													<br />
													{order.shippingAddress.city},{" "}
													{order.shippingAddress.state} -{" "}
													{order.shippingAddress.pincode}
													<Copy className="inline w-4 h-4 ml-2" />
												</p>
											</div>

											<div className="mt-4">
												<h3 className="text-xl font-bold text-[#c3e5a5] mb-2">
													Order Details
												</h3>
												<div className="space-y-2">
													{order.items.map((item) => (
														<div
															key={item._id}
															className="flex justify-between text-gray-400"
														>
															<div>
																<p>
																	<strong>Book:</strong> {item.name}
																</p>
																<p>
																	<strong>Author:</strong> {item.author}
																</p>
															</div>
															<div className="text-right">
																<p>
																	<strong>Quantity:</strong>{" "}
																	{item.quantity}
																</p>
																<p>
																	<strong>Price:</strong>{" "}
																	<IndianRupee className="inline w-4 h-4" />
																	{item.price}
																</p>
															</div>
														</div>
													))}
												</div>
											</div>
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

export default AdminDashboard;
