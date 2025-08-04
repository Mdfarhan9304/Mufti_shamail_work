import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Tag, ChevronDown, Loader2, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getPublishedFatwahs, getFatwahCategories, Fatwah, FatwahCategory } from "../apis/fatwah.api";
import { toast } from "react-toastify";

const FatwahPage = () => {
	const [fatwahs, setFatwahs] = useState<Fatwah[]>([]);
	const [categories, setCategories] = useState<FatwahCategory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

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

	const fetchFatwahs = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data, pagination } = await getPublishedFatwahs({
				search: searchTerm || undefined,
				category: selectedCategory === "all" ? undefined : selectedCategory,
				page: currentPage,
				limit: 10
			});
			setFatwahs(data);
			setTotalPages(pagination.pages);
		} catch (error) {
			toast.error("Failed to fetch fatwahs");
			console.error("Failed to fetch fatwahs:", error);
		} finally {
			setIsLoading(false);
		}
	}, [searchTerm, selectedCategory, currentPage]);

	useEffect(() => {
		fetchFatwahs();
	}, [fetchFatwahs]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		fetchFatwahs();
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};

	const getCategoryColor = (category: FatwahCategory) => {
		const colors = {
			[FatwahCategory.PRAYER]: "bg-blue-500/10 text-blue-400",
			[FatwahCategory.FASTING]: "bg-purple-500/10 text-purple-400",
			[FatwahCategory.MARRIAGE]: "bg-pink-500/10 text-pink-400",
			[FatwahCategory.BUSINESS]: "bg-green-500/10 text-green-400",
			[FatwahCategory.PURIFICATION]: "bg-cyan-500/10 text-cyan-400",
			[FatwahCategory.HAJJ]: "bg-orange-500/10 text-orange-400",
			[FatwahCategory.ZAKAT]: "bg-yellow-500/10 text-yellow-400",
			[FatwahCategory.FAMILY]: "bg-red-500/10 text-red-400",
			[FatwahCategory.WORSHIP]: "bg-indigo-500/10 text-indigo-400",
			[FatwahCategory.OTHER]: "bg-gray-500/10 text-gray-400"
		};
		return colors[category] || colors[FatwahCategory.OTHER];
	};

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />
				
				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
					{/* Header */}
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-4xl md:text-6xl font-bold text-[#c3e5a5] mb-6">
							Islamic Fatwahs
						</h1>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Find answers to your Islamic questions from qualified scholars. Browse through our collection of published fatwahs or ask your own question.
						</p>
						<Link
							to="/ask-fatwah"
							className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all"
						>
							<MessageCircle className="w-5 h-5" />
							Ask a Question
							<ArrowRight className="w-5 h-5" />
						</Link>
					</motion.div>

					{/* Search and Filters */}
					<motion.div
						className="bg-[#191b14] rounded-xl p-6 mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<div className="flex flex-col lg:flex-row gap-4">
							{/* Search */}
							<form onSubmit={handleSearch} className="flex-1">
								<div className="relative">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="text"
										placeholder="Search fatwahs..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full bg-[#24271b] text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									/>
								</div>
							</form>

							{/* Category Filter */}
							<div className="relative">
								<button
									onClick={() => setIsFilterOpen(!isFilterOpen)}
									className="flex items-center gap-2 px-6 py-3 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors min-w-[200px] justify-between"
								>
									<div className="flex items-center gap-2">
										<Filter className="w-5 h-5" />
										{selectedCategory === "all" ? "All Categories" : selectedCategory}
									</div>
									<ChevronDown className={`w-5 h-5 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
								</button>

								{isFilterOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="absolute top-full mt-2 left-0 right-0 bg-[#191b14] rounded-xl shadow-xl border border-[#24271b] z-50 max-h-[300px] overflow-y-auto"
									>
										<button
											onClick={() => {
												setSelectedCategory("all");
												setCurrentPage(1);
												setIsFilterOpen(false);
											}}
											className={`w-full text-left px-4 py-3 hover:bg-[#24271b] transition-colors ${selectedCategory === "all" ? "bg-[#24271b] text-[#c3e5a5]" : "text-white"}`}
										>
											All Categories
										</button>
										{categories.map((category) => (
											<button
												key={category}
												onClick={() => {
													setSelectedCategory(category);
													setCurrentPage(1);
													setIsFilterOpen(false);
												}}
												className={`w-full text-left px-4 py-3 hover:bg-[#24271b] transition-colors ${selectedCategory === category ? "bg-[#24271b] text-[#c3e5a5]" : "text-white"}`}
											>
												{category}
											</button>
										))}
									</motion.div>
								)}
							</div>
						</div>
					</motion.div>

					{/* Fatwahs List */}
					{isLoading ? (
						<div className="grid place-items-center py-16">
							<Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
						</div>
					) : fatwahs.length === 0 ? (
						<motion.div
							className="text-center py-16"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-gray-300 mb-2">No fatwahs found</h3>
							<p className="text-gray-400 mb-6">Try adjusting your search terms or filters.</p>
							<Link
								to="/ask-fatwah"
								className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all"
							>
								Ask the First Question
							</Link>
						</motion.div>
					) : (
						<div className="space-y-6">
							{fatwahs.map((fatwah, index) => (
								<motion.div
									key={fatwah._id}
									className="bg-[#191b14] rounded-xl p-6 shadow-xl"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: index * 0.1 }}
								>
									<div className="space-y-4">
										{/* Question */}
										<div>
											<h3 className="text-xl font-bold text-[#c3e5a5] mb-2">
												Question
											</h3>
											<p className="text-white leading-relaxed">
												{fatwah.question}
											</p>
										</div>

										{/* Answer */}
										{fatwah.answer && (
											<div>
												<h4 className="text-lg font-semibold text-[#c3e5a5] mb-2">
													Answer
												</h4>
												<p className="text-gray-300 leading-relaxed">
													{fatwah.answer}
												</p>
											</div>
										)}

										{/* Categories */}
										<div className="flex flex-wrap gap-2">
											{fatwah.categories.map((category) => (
												<span
													key={category}
													className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}
												>
													<Tag className="w-3 h-3 inline mr-1" />
													{category}
												</span>
											))}
										</div>

										{/* Meta Info */}
										<div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-800">
											<div className="flex items-center gap-4">
												{fatwah.answeredBy && (
													<span>Answered by: {fatwah.answeredBy.name}</span>
												)}
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												{formatDate(fatwah.publishedAt || fatwah.createdAt)}
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<motion.div
							className="flex justify-center mt-12"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className="px-4 py-2 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								
								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
										if (page > totalPages) return null;
										
										return (
											<button
												key={page}
												onClick={() => setCurrentPage(page)}
												className={`px-3 py-2 rounded-lg transition-colors ${
													currentPage === page
														? "bg-[#c3e5a5] text-gray-800"
														: "bg-[#24271b] text-white hover:bg-[#2f332a]"
												}`}
											>
												{page}
											</button>
										);
									})}
								</div>

								<button
									onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className="px-4 py-2 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</section>
		</main>
	);
};

export default FatwahPage;
