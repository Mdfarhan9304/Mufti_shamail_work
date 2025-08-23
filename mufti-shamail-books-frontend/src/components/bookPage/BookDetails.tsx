import { Book } from "../../apis/books.api";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
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
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");

	// Set default language when component mounts
	useEffect(() => {
		if (book.availableLanguages?.english && book.availableLanguages?.urdu) {
			setSelectedLanguage("english"); // Default to English if both available
		} else if (book.availableLanguages?.english) {
			setSelectedLanguage("english");
		} else if (book.availableLanguages?.urdu) {
			setSelectedLanguage("urdu");
		}
	}, [book.availableLanguages]);

	const handleAddToCart = async () => {
		if (!selectedLanguage) {
			toast.error("Please select a language");
			return;
		}

		console.log(user);
		try {
			if (user) {
				console.log("quantity", quantity, "language", selectedLanguage);
				await addToCart({ ...book, quantity, selectedLanguage });
				toast.success(`Added ${selectedLanguage} version to cart successfully!`);
			} else {
				addToGuestCart({
					...book,
					quantity,
					selectedLanguage,
					_id: book._id!,
				});
				toast.success(`Added ${selectedLanguage} version to guest cart!`);
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
				<div className="flex items-center gap-4">
					<p className="text-xl text-gray-400">By {book.author}</p>
					<div className="flex gap-2">
						{book.availableLanguages?.english && (
							<span className="bg-[#c3e5a5]/20 text-[#c3e5a5] px-3 py-1 rounded-full text-sm">
								English
							</span>
						)}
						{book.availableLanguages?.urdu && (
							<span className="bg-[#c3e5a5]/20 text-[#c3e5a5] px-3 py-1 rounded-full text-sm">
								Urdu
							</span>
						)}
					</div>
				</div>
			</div>

						<p className="text-3xl font-bold text-[#c3e5a5]">{formatCurrency(book.price)}</p>

			<p className="text-gray-400 text-lg leading-relaxed">
				{book.description}
			</p>

			{/* Language Selection */}
			{(book.availableLanguages?.english || book.availableLanguages?.urdu) && (
				<div className="space-y-3">
					<label className="text-[#c3e5a5] font-medium text-lg">Select Language:</label>
					<div className="flex gap-4">
						{book.availableLanguages?.english && (
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="language"
									value="english"
									checked={selectedLanguage === "english"}
									onChange={(e) => setSelectedLanguage(e.target.value)}
									className="w-4 h-4 accent-[#c3e5a5]"
								/>
								<span className="text-white text-lg">English</span>
							</label>
						)}
						{book.availableLanguages?.urdu && (
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="language"
									value="urdu"
									checked={selectedLanguage === "urdu"}
									onChange={(e) => setSelectedLanguage(e.target.value)}
									className="w-4 h-4 accent-[#c3e5a5]"
								/>
								<span className="text-white text-lg">Urdu</span>
							</label>
						)}
					</div>
				</div>
			)}

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
