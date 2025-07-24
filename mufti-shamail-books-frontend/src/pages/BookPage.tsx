import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Book, getBookById } from "../apis/books.api";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import ImageCarousel from "../components/bookPage/ImageCarousel";
import BookDetails from "../components/bookPage/BookDetails";

const BookPage = () => {
	const { bookId } = useParams<{ bookId: string }>();
	const [book, setBook] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBook = async () => {
			try {
				setLoading(true);
				const { data } = await getBookById(bookId!);
				console.log(data);
				setBook(data);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to fetch book"
				);
			} finally {
				setLoading(false);
			}
		};

		if (bookId) fetchBook();
	}, [bookId]);

	if (loading) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
			</main>
		);
	}

	if (!book) {
		return (
			<main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
				<p className="text-[#c3e5a5] text-xl">Book not found</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
					<motion.div
						className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<ImageCarousel
							images={book.images}
							bookName={book.name}
						/>
						<BookDetails book={book} />
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default BookPage;
