import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import BookCard from "../components/books/BookCard";
import { useEffect, useState } from "react";
import { Book, getAllBooks } from "../apis/books.api";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUtils";

const Books = () => {
	const [books, setBooks] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const { data } = await getAllBooks();
				setBooks(data);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to fetch books"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBooks();
	}, []);

	if (isLoading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
			</main>
		);
	}

	const latestBook = books[books.length - 1];

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			{/* Latest Book Section */}
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

				{latestBook && (
					<div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
						{/* Book Image */}
						<motion.div
							className="order-2 md:order-1"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8 }}
						>
							<Link to={`/book/${latestBook._id}`}>
								<div className="relative  w-full max-w-[500px] mx-auto">
									<img
										src={getImageUrl(latestBook.images[0])}
										alt={latestBook.name}
										className="relative rounded-2xl w-full h-full object-cover shadow-xl"
									/>
								</div>
							</Link>
						</motion.div>

						{/* Content */}
						<motion.div
							className="order-1 md:order-2 z-20"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#c3e5a5] mb-6">
								Latest Release
							</h2>
							<h3 className="text-3xl font-bold text-white mb-4">
								{latestBook.name}
							</h3>
							<p className="text-gray-400 mb-6 line-clamp-3">
								{latestBook.description}
							</p>
							<Link
								to={`/book/${latestBook._id}`}
								className="inline-flex items-center gap-2 text-[#c3e5a5] hover:text-[#a1c780] transition-colors"
							>
								Learn More
								<ArrowRight className="w-5 h-5" />
							</Link>
						</motion.div>
					</div>
				)}
			</section>

			{/* All Books Grid */}
			<section className="relative py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<h2 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-12">
						All Books
					</h2>
					<div className="flex justify-start flex-wrap gap-6">
						{books.map((book) => (
							<BookCard key={book._id} book={book} />
						))}
					</div>
				</div>
			</section>

			{/* More Books Coming Soon */}
			<section className="relative py-16 md:py-24">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1a1f17] bg-gradient-to-r from-[#c3e5a5]/10 to-transparent bg-clip-text">
						More Books Coming Soon
					</h2>
				</motion.div>
			</section>
		</main>
	);
};

export default Books;
