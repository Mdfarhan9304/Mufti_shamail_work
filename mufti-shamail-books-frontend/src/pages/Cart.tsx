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
import { formatCurrency, formatPrice } from "../utils/priceUtils";

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

	// Filter out invalid cart items and add safety checks
	const validCartItems = cartItems?.filter(item => item && item._id) || [];

	// Calculate total quantity of books
	const totalQuantity = validCartItems.reduce(
		(total, item) => total + (item.quantity ?? 1),
		0
	);

	// Calculate delivery charges: every 2 books add ₹50
	const deliveryCharges = Math.ceil(totalQuantity / 2) * 50;

	const totalAmount = validCartItems.reduce(
		(total, item) => {
			const price = formatPrice(item.price);
			const quantity = item.quantity ?? 1;
			return total + (price * quantity);
		},
		0
	);

	// Debug logging to understand the data structure differences
	console.log('User cart items:', user?.cart);
	console.log('Guest cart items:', guestCart);
	console.log('Valid cart items:', validCartItems);

	if (user?.role === "admin") {
		return <Navigate to="/admin/dashboard" replace />;
	}

	const handleRemove = async (itemId: string) => {
		try {
			if (user) {
				await removeFromCart(itemId);
			} else {
				removeFromGuestCart(itemId);
			}
		} catch (error) {
			console.error('Error removing item from cart:', error);
		}
	};

	const handleQuantityChange = async (itemId: string, quantity: number) => {
		if (quantity < 0) return;
		try {
			if (user) {
				await updateQuantity(itemId, quantity);
			} else {
				updateGuestQuantity(itemId, quantity);
			}
		} catch (error) {
			console.error('Error updating quantity:', error);
		}
	};

	// Helper function to safely get image URL
	const getSafeImageUrl = (item: CartItem) => {
		if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
			return '/placeholder-book.jpg'; // Make sure this exists in your public folder
		}
		try {
			return getImageUrl(item.images[0]);
		} catch (error) {
			console.error('Error getting image URL:', error);
			return '/placeholder-book.jpg';
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

					{validCartItems.length === 0 ? (
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
							{validCartItems.map((item: CartItem) => {
								// Add extra safety checks for each item
								if (!item || !item._id) {
									return null;
								}

								const itemPrice = formatPrice(item.price);
								const itemQuantity = item.quantity ?? 1;
								const itemTotal = itemPrice * itemQuantity;

								return (
									<motion.div
										key={item._id}
										className="bg-[#191b14] rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center gap-6"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8 }}
									>
										<div className="w-full md:w-32 h-32">
											<img
												src={getSafeImageUrl(item)}
												alt={item.name || 'Book'}
												className="w-full h-full object-contain rounded-lg"
												onError={(e) => {
													// Fallback if image fails to load
													e.currentTarget.src = '/placeholder-book.jpg';
												}}
											/>
										</div>
										<div className="flex-1">
											<h3 className="text-xl font-medium text-white mb-2">
												{item.name || 'Untitled Book'}
											</h3>
											<div className="flex items-center gap-2 mb-2">
												<p className="text-gray-400 text-sm">
													By {item.author || 'Unknown Author'}
												</p>
												{item.selectedLanguage && (
													<span className="text-xs bg-[#c3e5a5]/20 text-[#c3e5a5] px-2 py-1 rounded-full">
														{item.selectedLanguage.charAt(0).toUpperCase() + item.selectedLanguage.slice(1)}
													</span>
												)}
												{!item.selectedLanguage && item.availableLanguages && (
													<div className="flex gap-1">
														{item.availableLanguages.english && (
															<span className="text-xs bg-[#c3e5a5]/20 text-[#c3e5a5] px-2 py-1 rounded-full">
																English
															</span>
														)}
														{item.availableLanguages.urdu && (
															<span className="text-xs bg-[#c3e5a5]/20 text-[#c3e5a5] px-2 py-1 rounded-full">
																Urdu
															</span>
														)}
													</div>
												)}
											</div>
											<p className="text-[#c3e5a5] text-lg">
												{formatCurrency(itemPrice)}
											</p>
										</div>
										<div className="flex items-center gap-4 bg-[#24271b] rounded-lg p-2 w-max">
											<button
												disabled={loading}
												onClick={() =>
													handleQuantityChange(
														item._id!,
														itemQuantity - 1
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
													itemQuantity
												)}
											</span>
											<button
												disabled={loading}
												onClick={() =>
													handleQuantityChange(
														item._id!,
														itemQuantity + 1
													)
												}
												className="p-2 hover:bg-[#50573a] rounded-lg transition-colors bg-[#3b402c]"
											>
												<Plus className="w-4 h-4 text-gray-400" />
											</button>
										</div>
										<div className="flex items-center gap-6">
											<p className="text-[#c3e5a5] text-lg">
												{formatCurrency(itemTotal)}
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
								);
							})}

							<div className="bg-[#191b14] rounded-xl p-6 shadow-xl">
								<div className="flex justify-between items-center mb-4">
									<span className="text-gray-400">
										Subtotal
									</span>
									<span className="text-white">
										{formatCurrency(totalAmount)}
									</span>
								</div>
								<div className="flex justify-between items-center mb-6">
									<span className="text-gray-400">
										Shipping ({totalQuantity} books)
									</span>
									<span className="text-white">
										{formatCurrency(deliveryCharges)}
									</span>
								</div>
								<div className="border-t border-[#24271b] pt-4 flex justify-between items-center">
									<span className="text-lg text-white">
										Total
									</span>
									<span className="text-xl text-[#c3e5a5] font-medium">
										{formatCurrency(totalAmount + deliveryCharges)}
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