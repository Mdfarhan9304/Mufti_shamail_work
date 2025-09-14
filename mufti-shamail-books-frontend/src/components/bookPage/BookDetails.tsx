import { Book } from "../../apis/books.api";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useGuestCart } from "../../contexts/GuestCartContext";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/priceUtils";

interface BookDetailsProps {
	book: Book;
}

const BookDetails = ({ book }: BookDetailsProps) => {
	const { addToCart, user } = useAuth();
	const { addToGuestCart } = useGuestCart();
	const [quantity, setQuantity] = useState(1);

	const handleAddToCart = async () => {
		try {
			if (user) {
				await addToCart({ ...book, quantity });
				toast.success("Added to cart successfully!");
			} else {
				addToGuestCart({
					...book,
					quantity,
					_id: book._id!,
					price: typeof book.price === 'number' ? book.price : 0,
				});
				toast.success("Added to guest cart!");
			}
		} catch {
			toast.error("Failed to add to cart. Please try again.");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-2">
					{book.name}
				</h1>
				<p className="text-xl text-gray-400">By {book.author}</p>
			</div>

						<p className="text-3xl font-bold text-[#c3e5a5]">{formatCurrency(book.price)}</p>

			<p className="text-gray-400 text-lg leading-relaxed">
				{book.description}
			</p>


			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 bg-[#24271b] rounded-lg p-2">
					<button
						onClick={() => setQuantity(Math.max(1, quantity - 1))}
						className="p-2 bg-[#c3e5a5] text-gray-600 rounded-md hover:bg-[#a1c780] transition-all"
					>
						<Minus className="w-4 h-4" />
					</button>
					<span className="text-white px-4 min-w-[2rem] text-center">
						{quantity}
					</span>
					<button
						onClick={() => setQuantity(quantity + 1)}
						className="p-2 bg-[#c3e5a5] text-gray-600 rounded-md hover:bg-[#a1c780] transition-all"
					>
						<Plus className="w-4 h-4" />
					</button>
				</div>

				<button
					onClick={handleAddToCart}
					className="px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default BookDetails;
