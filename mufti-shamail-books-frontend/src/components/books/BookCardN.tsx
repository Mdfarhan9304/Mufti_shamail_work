import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Book } from "../../apis/books.api";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface BookCardProps {
	book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
	const { user, addToCart, updateQuantity } = useAuth();
	const cartItem = user?.cart?.find((item) => item._id === book._id);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<Link to={`/book/${book._id}`}>
				<div className="bg-[#191b14] rounded-xl overflow-hidden shadow-xl hover:transform hover:scale-105 transition-all duration-300">
					<div className="aspect-[3/4] relative">
						<img
							src={`${import.meta.env.VITE_API_URL}/${
								book.images[0]
							}`}
							alt={book.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="p-4">
						<h3 className="text-xl font-bold text-[#c3e5a5] mb-2 line-clamp-1">
							{book.name}
						</h3>
						<p className="text-gray-400 text-sm mb-2">
							{book.author}
						</p>
						<p className="text-white font-bold">${book.price}</p>
					</div>
					{cartItem && cartItem.quantity! > 0 ? (
						<div className="flex items-center space-x-4 mt-4 bg-[#24271b] rounded-full p-2 w-max">
							<button
								onClick={() => {
									if (cartItem.quantity! > 0) {
										updateQuantity(
											book._id || "",
											cartItem.quantity! - 1
										);
									}
								}}
								className="px-2 py-2 bg-[#c3e5a5] text-gray-600 rounded-full font-medium hover:bg-[#a1c780] transition-all"
							>
								<Minus size={24} />
							</button>
							<span className="text-white">
								{cartItem.quantity}
							</span>
							<button
								onClick={() =>
									updateQuantity(
										book._id || "",
										cartItem.quantity! + 1
									)
								}
								className="px-2 py-2 bg-[#c3e5a5] text-gray-600 rounded-full font-medium hover:bg-[#a1c780] transition-all"
							>
								<Plus size={24} />
							</button>
						</div>
					) : (
						<button
							onClick={() => addToCart({ ...book, quantity: 1 })}
							// onClick={() => addToCart(book)}
							className="mt-4 px-8 py-4 bg-[#c3e5a5] text-gray-600 rounded-full font-medium hover:bg-[#a1c780] transition-all"
						>
							Add to Cart
						</button>
					)}
				</div>
			</Link>
		</motion.div>
	);
};

export default BookCard;
