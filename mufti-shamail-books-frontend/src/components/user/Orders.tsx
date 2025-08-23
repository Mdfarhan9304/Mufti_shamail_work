import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Package } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getOrders } from "../../apis/orders.api";
import { toast } from "react-toastify";
import { Address } from "../../apis/addresses.api";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { formatCurrency, formatPrice } from "../../utils/priceUtils";

interface OrderItem {
	_id: string;
	name: string;
	price: number;
	images: string[];
	quantity: number;
}

interface Order {
	_id: string;
	orderNumber: string;
	items: OrderItem[];
	contactDetails: {
		phone: string;
		email: string;
		name: string;
	};
	shippingAddress: Address;
	txnId: string;
	createdAt: string;
}

const Orders = () => {
	const { user } = useAuth();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await getOrders(user!._id);
				console.log(response.data.orders);
				setOrders(response.data.orders);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to fetch orders"
				);
			} finally {
				setLoading(false);
			}
		};

		if (user?._id) fetchOrders();
	}, [user]);

	if (loading) {
		return (
			<div className="grid place-items-center h-96">
				<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
			</div>
		);
	}

	return (
		<motion.div
			className="space-y-4 md:space-y-6 md:px-0"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<h2 className="text-xl md:text-2xl font-bold text-[#c3e5a5]">
				Your Orders
			</h2>

			{orders.length === 0 ? (
				<div className="bg-[#191b14] p-6 md:p-8 rounded-xl text-center">
					<Package className="w-10 h-10 md:w-12 md:h-12 text-[#c3e5a5] mx-auto mb-3 md:mb-4" />
					<p className="text-gray-400">No orders yet</p>
				</div>
			) : (
				<div className="space-y-4 md:space-y-6">
					{orders.map((order) => (
						<motion.div
							key={order._id}
							className="bg-[#191b14] p-4 md:p-6 rounded-xl shadow-lg border border-[#24271b] hover:border-[#c3e5a5]/20 transition-all"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ scale: 1.01 }}
							transition={{ duration: 0.2 }}
						>
							<div className="flex flex-col md:flex-row justify-between items-start border-b border-[#24271b] pb-4 mb-4 md:mb-6 gap-2 md:gap-0">
								<div className="space-y-1 w-full md:w-auto">
									<h4 className="text-base md:text-lg font-medium text-[#c3e5a5]">
										Order #{order.orderNumber}
									</h4>
									<p className="text-sm text-gray-400">
										{new Date(
											order.createdAt
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
								<div className="flex justify-between md:justify-end items-center w-full md:w-auto">
									<span className="text-sm md:text-base text-[#c3e5a5]">
										Total: {formatCurrency(
											order.items.reduce(
												(sum, item) => {
													const itemPrice = formatPrice(item.price);
													return sum + (itemPrice * item.quantity);
												},
												0
											)
										)}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4">
								{order.items.map((item) => (
									<Link
										to={`/book/${item._id}`}
										key={item._id}
										className="flex gap-3 md:gap-4"
									>
										<div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
											<img
												src={getImageUrl(item.images[0])}
												alt={item.name}
												className="w-full h-full object-contain rounded-md"
												onError={(e) => {
													// Fallback if image fails to load
													e.currentTarget.src = '/placeholder-book.jpg';
												}}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-white text-sm md:text-base font-medium truncate">
												{item.name}
											</p>
											<p className="text-gray-400 text-xs md:text-sm mt-1">
												Quantity: {item.quantity}
											</p>
											<p className="text-[#c3e5a5] text-sm md:text-base mt-1">
												{formatCurrency(formatPrice(item.price) * item.quantity)}
											</p>
										</div>
									</Link>
								))}
							</div>
						</motion.div>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default Orders;
