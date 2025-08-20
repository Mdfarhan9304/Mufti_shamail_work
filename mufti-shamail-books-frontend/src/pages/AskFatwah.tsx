import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { submitQuestion, getFatwahCategories, FatwahCategory } from "../apis/fatwah.api";
import { toast } from "react-toastify";

const AskFatwah = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [categories, setCategories] = useState<FatwahCategory[]>([]);
	const [formData, setFormData] = useState({
		question: "",
		askerName: "",
		askerEmail: "",
		categories: [FatwahCategory.OTHER] as FatwahCategory[]
	});

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const { data } = await getFatwahCategories();
			setCategories(data);
		} catch (error) {
			console.error("Failed to fetch categories:", error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleCategoryChange = (category: FatwahCategory) => {
		setFormData(prev => ({
			...prev,
			categories: prev.categories.includes(category)
				? prev.categories.filter(c => c !== category)
				: [...prev.categories, category]
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.question.trim()) {
			toast.error("Please enter your question");
			return;
		}

		if (formData.categories.length === 0) {
			toast.error("Please select at least one category");
			return;
		}

		try {
			setIsLoading(true);
			await submitQuestion({
				question: formData.question.trim(),
				askerName: formData.askerName.trim() || undefined,
				askerEmail: formData.askerEmail.trim() || undefined,
				categories: formData.categories
			});

			setIsSubmitted(true);
			toast.success("Your question has been submitted successfully!");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to submit question"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const getCategoryColor = (category: FatwahCategory) => {
		const colors = {
			[FatwahCategory.PRAYER]: "border-blue-400 bg-blue-500/10 text-blue-400",
			[FatwahCategory.FASTING]: "border-purple-400 bg-purple-500/10 text-purple-400",
			[FatwahCategory.MARRIAGE]: "border-pink-400 bg-pink-500/10 text-pink-400",
			[FatwahCategory.BUSINESS]: "border-green-400 bg-green-500/10 text-green-400",
			[FatwahCategory.PURIFICATION]: "border-cyan-400 bg-cyan-500/10 text-cyan-400",
			[FatwahCategory.HAJJ]: "border-orange-400 bg-orange-500/10 text-orange-400",
			[FatwahCategory.ZAKAT]: "border-yellow-400 bg-yellow-500/10 text-yellow-400",
			[FatwahCategory.FAMILY]: "border-red-400 bg-red-500/10 text-red-400",
			[FatwahCategory.WORSHIP]: "border-indigo-400 bg-indigo-500/10 text-indigo-400",
			[FatwahCategory.OTHER]: "border-gray-400 bg-gray-500/10 text-gray-400"
		};
		return colors[category] || colors[FatwahCategory.OTHER];
	};

	if (isSubmitted) {
		return (
			<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
				<section className="relative py-16 md:py-24">
					<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

					<div className="max-w-2xl mx-auto px-6 lg:px-8 relative">
						<motion.div
							className="bg-[#191b14] rounded-2xl p-8 shadow-xl text-center"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
								<CheckCircle className="w-8 h-8 text-green-400" />
							</div>

							<h1 className="text-3xl font-bold text-[#c3e5a5] mb-4">
								Question Submitted Successfully!
							</h1>

							<p className="text-gray-300 mb-8 leading-relaxed">
								Thank you for your question. Our scholars will review it and provide an answer soon.
								The response will be published on our Fatwah page for everyone to benefit from.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link
									to="/fatwah"
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all"
								>
									Browse Fatwahs
								</Link>
								<button
									onClick={() => {
										setIsSubmitted(false);
										setFormData({
											question: "",
											askerName: "",
											askerEmail: "",
											categories: [FatwahCategory.OTHER]
										});
									}}
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#24271b] text-white rounded-full font-medium hover:bg-[#2f332a] transition-all"
								>
									Ask Another Question
								</button>
							</div>
						</motion.div>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

				<div className="max-w-2xl mx-auto px-6 lg:px-8 relative">
					{/* Header */}
					<motion.div
						className="text-center mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<div className="flex items-center justify-center mb-6">
							<Link
								to="/fatwah"
								className="absolute left-0 p-2 hover:bg-[#24271b] rounded-full transition-colors"
							>
								<ArrowLeft className="w-6 h-6 text-[#c3e5a5]" />
							</Link>
							<div className="w-16 h-16 bg-[#c3e5a5]/10 rounded-full flex items-center justify-center">
								<MessageCircle className="w-8 h-8 text-[#c3e5a5]" />
							</div>
						</div>

						<h1 className="text-4xl md:text-5xl font-bold text-[#c3e5a5] mb-4">
							Ask a Fatwah
						</h1>
						<p className="text-xl text-gray-300">
							Submit your Islamic question to our qualified scholars
						</p>
					</motion.div>

					{/* Form */}
					<motion.div
						className="bg-[#191b14] rounded-2xl p-8 shadow-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Question */}
							<div>
								<label className="block text-[#c3e5a5] font-medium mb-2">
									Your Question *
								</label>
								<textarea
									name="question"
									placeholder="Please write your Islamic question in detail..."
									value={formData.question}
									onChange={handleInputChange}
									rows={6}
									className="w-full bg-[#24271b] text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all resize-none"
									required
								/>
								<p className="text-sm text-gray-400 mt-2">
									Please be as specific as possible to help our scholars provide accurate guidance.
								</p>
							</div>

							{/* Categories */}
							<div>
								<label className="block text-[#c3e5a5] font-medium mb-3">
									Categories *
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{categories.map((category) => (
										<button
											key={category}
											type="button"
											onClick={() => handleCategoryChange(category)}
											className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${formData.categories.includes(category)
													? getCategoryColor(category)
													: "border-gray-600 bg-[#24271b] text-gray-400 hover:border-gray-500"
												}`}
										>
											{category}
										</button>
									))}
								</div>
								<p className="text-sm text-gray-400 mt-2">
									Select one or more categories that best describe your question.
								</p>
							</div>

							{/* Optional Contact Details */}
							<div className="space-y-4">
								<h3 className="text-[#c3e5a5] font-medium">
									Contact Details (Optional)
								</h3>
								<p className="text-sm text-gray-400">
									Providing your contact details is optional. They will only be used for clarification if needed and will not be published.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<input
										type="text"
										name="askerName"
										placeholder="Your Name (Optional)"
										value={formData.askerName}
										onChange={handleInputChange}
										className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									/>
									<input
										type="email"
										name="askerEmail"
										placeholder="Your Email (Optional)"
										value={formData.askerEmail}
										onChange={handleInputChange}
										className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									/>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Submitting...
									</>
								) : (
									<>
										<Send className="w-5 h-5" />
										Submit Question
									</>
								)}
							</button>
						</form>
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default AskFatwah;
