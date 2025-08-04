import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	Loader2,
	ArrowRight,
	ShoppingBag,
	Minus,
	Plus,
	Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGuestCart } from "../contexts/GuestCartContext";
import { CartItem } from "../apis/cart.api";
import { getImageUrl } from "../utils/imageUtils";

const Cart = () => {
	const {
		user,
		isLoading: loading,
		removeFromCart,
		updateQuantity,
	} = useAuth();
	const { guestCart, removeFromGuestCart, updateGuestQuantity } =
		useGuestCart();

	const cartItems = user ? user.cart : guestCart;
	const totalAmount = cartItems?.reduce(
		(total, item) => total + item.price * (item.quantity ?? 1),
		0
	);

	// if (loading) {
	// 	return (
	// 		<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
	// 			<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
	// 		</main>
	// 	);
	// }

	if (user?.role === "admin") {
		return <Navigate to="/admin/dashboard" replace />;
	}

	const handleRemove = async (itemId: string) => {
		if (user) {
			await removeFromCart(itemId);
		} else {
			removeFromGuestCart(itemId);
		}
	};

	const handleQuantityChange = async (itemId: string, quantity: number) => {
		console.log(guestCart);
		if (quantity < 0) return;
		if (user) {
			await updateQuantity(itemId, quantity);
		} else {
			updateGuestQuantity(itemId, quantity);
		}
	};

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17]/50 to-[#191a13]/50" />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-4xl md:text-5xl font-bold text-[#c3e5a5]">
							Your Cart
						</h1>
						{!user && (
							<Link
								to="/login"
								className="text-[#c3e5a5] hover:text-[#a1c780] transition-colors flex items-center gap-2"
							>
								Login to sync cart{" "}
								<ArrowRight className="w-4 h-4" />
							</Link>
						)}
					</div>

					{!cartItems || cartItems.length === 0 ? (
						<div className="text-center py-16">
							<ShoppingBag className="w-16 h-16 text-[#c3e5a5]/50 mx-auto mb-4" />
							<p className="text-gray-400 text-lg mb-8">
								Your cart is empty
							</p>
							<Link
								to="/"
								className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full hover:bg-[#a1c780] transition-all"
							>
								Start Shopping
							</Link>
						</div>
					) : (
						<div className="space-y-8">
							{cartItems.map((item: CartItem) => (
								<motion.div
									key={item._id}
									className="bg-[#191b14] rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center gap-6"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8 }}
								>
									<div className="w-full md:w-32 h-32">
										<img
											src={`${getImageUrl(item.images[0])}`}
											alt={item.name}
											className="w-full h-full object-contain rounded-lg"
										/>
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-medium text-white mb-2">
											{item.name}
										</h3>
										<p className="text-[#c3e5a5] text-lg">
											₹{item.price}
										</p>
									</div>
									<div className="flex items-center gap-4 bg-[#24271b] rounded-lg p-2 w-max">
										<button
											disabled={loading}
											onClick={() =>
												handleQuantityChange(
													item._id!,
													(item.quantity || 1) - 1
												)
											}
											className="p-2 hover:bg-[#50573a] rounded-lg transition-colors bg-[#3b402c]"
										>
											<Minus className="w-4 h-4 text-gray-400" />
										</button>
										<span className="text-white min-w-[2ch] text-center">
											{loading ? (
												<Loader2 className="w-4 h-4 text-[#c3e5a5] animate-spin" />
											) : (
												item.quantity || 1
											)}
										</span>
										<button
											disabled={loading}
											onClick={() =>
												handleQuantityChange(
													item._id!,
													(item.quantity || 1) + 1
												)
											}
											className="p-2 hover:bg-[#50573a] rounded-lg transition-colors bg-[#3b402c]"
										>
											<Plus className="w-4 h-4 text-gray-400" />
										</button>
									</div>
									<div className="flex items-center gap-6">
										<p className="text-[#c3e5a5] text-lg">
											₹{item.price * (item.quantity || 1)}
										</p>
										<button
											disabled={loading}
											onClick={() =>
												handleRemove(item._id!)
											}
											className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
										>
											<Trash2 className="w-4 h-4 text-red-500" />
										</button>
									</div>
								</motion.div>
							))}

							<div className="bg-[#191b14] rounded-xl p-6 shadow-xl">
								<div className="flex justify-between items-center mb-4">
									<span className="text-gray-400">
										Subtotal
									</span>
									<span className="text-white">
										₹{totalAmount}
									</span>
								</div>
								<div className="flex justify-between items-center mb-6">
									<span className="text-gray-400">
										Shipping
									</span>
									<span className="text-white">₹50</span>
								</div>
								<div className="border-t border-[#24271b] pt-4 flex justify-between items-center">
									<span className="text-lg text-white">
										Total
									</span>
									<span className="text-xl text-[#c3e5a5] font-medium">
										₹{totalAmount ? totalAmount + 50 : 0}
									</span>
								</div>
							</div>

							<div className="flex justify-end">
								<Link
									to={user ? "/checkout" : "/guest/checkout"}
									className="px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full hover:bg-[#a1c780] transition-all font-medium text-lg"
								>
									Proceed to Checkout
								</Link>
							</div>
						</div>
					)}
				</div>
			</section>
		</main>
	);
};

export default Cart;
