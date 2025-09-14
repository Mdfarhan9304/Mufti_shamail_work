import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { createBook } from "../apis/books.api";
import ImageUploadPreview from "../components/ImageUploadPreview";
import { useAuth } from "../contexts/AuthContext";

const AddBook = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		author: "",
		price: "",
	});
	const [images, setImages] = useState<File[]>([]);
	const { user, isAuthenticated } = useAuth();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};


	const handleImageAdd = (files: FileList) => {
		setImages((prev) => [...prev, ...Array.from(files)]);
	};

	const handleImageRemove = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.name ||
			!formData.description ||
			!formData.author ||
			!formData.price ||
			images.length === 0
		) {
			toast.error("All fields including at least one image are required");
			return;
		}


		setIsLoading(true);
		try {
			const priceValue = parseFloat(parseFloat(formData.price).toFixed(2));

			await createBook(
				{
					name: formData.name,
					description: formData.description,
					author: formData.author,
					price: priceValue,
					images: [],
				},
				images
			);
			toast.success("Book added successfully");
			navigate("/manage-books");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to add book"
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isAuthenticated) {
		if (user?.role !== "admin") {
			return <Navigate to="/dashboard" replace />;
		}
	} else return <Navigate to="/login" replace />;

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />
				<div className="max-w-3xl mx-auto px-6 lg:px-8">
					<motion.div
						className="bg-[#191b14] rounded-2xl p-8 shadow-xl relative z-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-8">
							Add New Book
						</h1>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<input
									type="text"
									name="name"
									placeholder="Book Name"
									value={formData.name}
									onChange={handleChange}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								/>
								<textarea
									name="description"
									placeholder="Description"
									value={formData.description}
									onChange={handleChange}
									rows={4}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								/>
								<input
									type="text"
									name="author"
									placeholder="Author"
									value={formData.author}
									onChange={handleChange}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								/>
								<input
									type="number"
									name="price"
									placeholder="Price"
									value={formData.price}
									onChange={handleChange}
									min="0"
									step="0.01"
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									required
								/>

								<div className="space-y-2">
									<label className="text-[#c3e5a5]">
										Images
									</label>
									<ImageUploadPreview
										images={images}
										onRemove={handleImageRemove}
										onAdd={handleImageAdd}
									/>
								</div>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Add Book"
								)}
							</button>
						</form>
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default AddBook;
