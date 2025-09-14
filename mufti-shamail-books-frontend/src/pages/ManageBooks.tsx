import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Book, getAllBooks, updateBook, deleteBook } from "../apis/books.api";
import { Edit, Save, Plus, Trash, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

const ManageBooks = () => {
	const [books, setBooks] = useState<Book[]>([]);
	const [editedBook, setEditedBook] = useState<Partial<Book>>({});
	const [editingBookId, setEditingBookId] = useState<string | null>(null);
	const { user, isAuthenticated } = useAuth();

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const { data } = await getAllBooks();
				setBooks(data);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				toast.error((error as any).message);
			}
		};

		fetchBooks();
	}, []);

	const handleEditClick = (book: Book) => {
		setEditingBookId(book._id || null);
		setEditedBook(book);
	};

	const handleSaveClick = async (bookId: string) => {
		try {
			// Fix price precision before saving
			const updatedBook = {
				...editedBook,
				price: parseFloat(parseFloat(editedBook.price?.toString() || "0").toFixed(2))
			};

			await updateBook(bookId, updatedBook as Book, []);
			setBooks((prevBooks) =>
				prevBooks.map((book) =>
					book._id === bookId ? { ...book, ...updatedBook } : book
				)
			);
			setEditingBookId(null);
			toast.success("Book updated successfully");
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.error((error as any).message);
		}
	};

	const handleDeleteClick = async (bookId: string) => {
		try {
			await deleteBook(bookId);
			setBooks((prevBooks) =>
				prevBooks.filter((book) => book._id !== bookId)
			);
			toast.success("Book deleted successfully");
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.error((error as any).message);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditedBook((prevBook) => ({ ...prevBook, [name]: value }));
	};


	if (isAuthenticated) {
		if (user?.role !== "admin") {
			return <Navigate to="/dashboard" replace />;
		}
	} else return <Navigate to="/login" replace />;

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="flex justify-between items-center mb-12">
						<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5]">
							Manage Books
						</h1>
						<Link
							to="/add-book"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full hover:bg-[#a1c780] transition-all"
						>
							<Plus className="w-5 h-5" />
							Add New Book
						</Link>
					</div>


					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{books.map((book) => (
							<div
								key={book._id}
								className="bg-[#191b14] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
							>
								{editingBookId === book._id ? (
									<div className="p-6 space-y-4">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-xl font-bold text-[#c3e5a5]">
												Edit Book
											</h3>
											<button
												onClick={() =>
													setEditingBookId(null)
												}
												className="p-2 text-gray-400 hover:text-white transition-colors"
											>
												<X className="w-5 h-5" />
											</button>
										</div>
										<input
											type="text"
											name="name"
											value={editedBook.name || ""}
											onChange={handleChange}
											className="w-full bg-[#24271b] text-white rounded-lg p-3"
											placeholder="Book Title"
										/>
										<textarea
											name="description"
											value={editedBook.description || ""}
											onChange={handleChange}
											className="w-full bg-[#24271b] text-white rounded-lg p-3 min-h-[100px]"
											placeholder="Description"
										/>
										<input
											type="text"
											name="author"
											value={editedBook.author || ""}
											onChange={handleChange}
											className="w-full bg-[#24271b] text-white rounded-lg p-3"
											placeholder="Author"
										/>
										<input
											type="number"
											name="price"
											value={typeof editedBook.price === 'number' ? editedBook.price : ""}
											onChange={handleChange}
											min="0"
											step="0.01"
											className="w-full bg-[#24271b] text-white rounded-lg p-3"
											placeholder="Price"
										/>

										<div className="flex justify-end gap-4 pt-4">
											<button
												onClick={() =>
													handleSaveClick(book._id!)
												}
												className="inline-flex items-center gap-2 px-4 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-all"
											>
												<Save className="w-4 h-4" />
												Save
											</button>
										</div>
									</div>
								) : (
									<>
										<div className="aspect-[4/3] relative overflow-hidden">
											<img
												src={getImageUrl(book.images[0])}
												alt={book.name}
												className="absolute inset-0 w-full h-full object-cover"
											/>
										</div>
										<div className="p-6 space-y-4">
											<h3 className="text-xl font-bold text-[#c3e5a5] line-clamp-1">
												{book.name}
											</h3>
											<p className="text-gray-300 text-sm">
												By {book.author}
											</p>
											<p className="text-gray-400 text-sm line-clamp-2">
												{book.description}
											</p>
											<div className="flex justify-between items-center">
												<p className="text-white text-lg">
													₹{typeof book.price === 'number' ? book.price : 0}
												</p>
												<div className="flex gap-2">
													<button
														onClick={() =>
															handleEditClick(
																book
															)
														}
														className="p-2 bg-[#24271b] text-[#c3e5a5] rounded-lg hover:bg-[#2f332a] transition-all"
													>
														<Edit className="w-6 h-6" />
													</button>
													<button
														onClick={() =>
															handleDeleteClick(
																book._id!
															)
														}
														className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
													>
														<Trash className="w-6 h-6" />
													</button>
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
};

export default ManageBooks;
