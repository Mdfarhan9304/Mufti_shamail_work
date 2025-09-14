import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Book } from "../../apis/books.api";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// import { toast } from "react-toastify";
import { useGuestCart } from "../../contexts/GuestCartContext";
import { getImageUrl } from "../../utils/imageUtils";
import { formatCurrency } from "../../utils/priceUtils";

const BookCard = ({ book }: { book: Book }) => {
	const {
		user,
		addToCart,
		updateQuantity,
		isLoading: cartLoading,
	} = useAuth();
	const { guestCart, addToGuestCart, updateGuestQuantity } = useGuestCart();

	const cartItems = user ? user.cart : guestCart;
	const cartItem = cartItems.find((item) => item._id === book._id);

	const handleQuantityChange = async (itemId: string, quantity: number) => {
		console.log(user);
		if (quantity < 0) return;
		if (user) {
			await updateQuantity(itemId, quantity);
		} else {
			updateGuestQuantity(itemId, quantity);
		}
	};

	return (
		<motion.div
			className="group bg-[#191b14] rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full max-w-sm mx-auto"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
		>
			<div className="w-full aspect-square p-2 bg-[#24271b]">
				<img
					src={getImageUrl(book.images[0])}
					alt={book.name}
					className="w-full h-full object-cover rounded-lg"
				/>
			</div>

			<div className="p-4 md:p-6 space-y-4 md:space-y-6">
				<div className="space-y-2 md:space-y-3">
					<h3 className="text-lg md:text-xl font-bold text-white line-clamp-2">
						{book.name}
					</h3>
					<p className="text-sm text-[#c3e5a5]">By {book.author}</p>
					<p className="text-gray-400 line-clamp-2 text-sm">
						{book.description}
					</p>
					<p className="text-xl md:text-2xl font-bold text-[#c3e5a5]">
						{formatCurrency(book.price)}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
					{cartItem && cartItem.quantity! > 0 ? (
						<div className="flex items-center gap-2 bg-[#24271b] rounded-lg p-1.5 w-full sm:w-auto justify-center">
							<button
								disabled={cartLoading}
								onClick={() =>
									handleQuantityChange(
										cartItem._id!,
										(cartItem.quantity || 1) - 1
									)
								}
								className="p-1.5 bg-[#c3e5a5] text-gray-600 rounded-md hover:bg-[#a1c780] transition-all"
							>
								<Minus className="w-4 h-4" />
							</button>
							<span className="text-white text-sm px-2 min-w-[24px] text-center">
								{cartLoading ? (
									<Loader2 className="animate-spin w-2 h-2" />
								) : (
									cartItem.quantity
								)}
							</span>
							<button
								disabled={cartLoading}
								onClick={() =>
									handleQuantityChange(
										cartItem._id!,
										(cartItem.quantity || 1) + 1
									)
								}
								className="p-1.5 bg-[#c3e5a5] text-gray-600 rounded-md hover:bg-[#a1c780] transition-all"
							>
								<Plus className="w-4 h-4" />
							</button>
						</div>
					) : (
						<button
							onClick={async () => {
								if (user) {
									await addToCart({ ...book, quantity: 1 });
								} else {
									addToGuestCart({
										...book,
										quantity: 1,
										_id: book._id!,
										price: typeof book.price === 'number' ? book.price : 0,
									});
								}
							}}
							className={`w-full sm:flex-1 px-3 md:px-4 py-2 bg-[#c3e5a5] text-gray-600 rounded-lg font-medium hover:bg-[#a1c780] transition-all text-sm ${
								user?.role === "admin"
									? "cursor-not-allowed bg-[#687a58] hover:bg-[#687a58]"
									: ""
							}`}
							disabled={user?.role === "admin"}
						>
							Add to Cart
						</button>
					)}
					<Link
						to={`/book/${book._id}`}
						className="w-full sm:flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#24271b] text-[#c3e5a5] rounded-lg font-medium hover:bg-[#2f332a] transition-all text-sm"
					>
						Details
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default BookCard;
