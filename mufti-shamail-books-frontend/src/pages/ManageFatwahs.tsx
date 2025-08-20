import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Eye,
	Calendar,
	Tag,
	ChevronDown,
	Loader2,
	MessageCircle,
	CheckCircle,
	Clock,
	FileText
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { getAllFatwahs, getFatwahCategories, deleteFatwah, updateFatwah, Fatwah, FatwahCategory, FatwahStatus } from "../apis/fatwah.api";
import { toast } from "react-toastify";
import FatwahModal from "../components/FatwahModal";

const ManageFatwahs = () => {
	const { user, isAuthenticated } = useAuth();
	const [fatwahs, setFatwahs] = useState<Fatwah[]>([]);
	const [categories, setCategories] = useState<FatwahCategory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedFatwah, setSelectedFatwah] = useState<Fatwah | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"view" | "edit" | "create">("view");

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const { data } = await getFatwahCategories();
			setCategories(data);
		} catch {
			console.error("Failed to fetch categories");
		}
	};

	const fetchFatwahs = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data, pagination } = await getAllFatwahs({
				search: searchTerm || undefined,
				status: selectedStatus === "all" ? undefined : selectedStatus,
				category: selectedCategory === "all" ? undefined : selectedCategory,
				page: currentPage,
				limit: 10
			});
			setFatwahs(data);
			setTotalPages(pagination.pages);
		} catch {
			toast.error("Failed to fetch fatwahs");
			console.error("Failed to fetch fatwahs");
		} finally {
			setIsLoading(false);
		}
	}, [searchTerm, selectedStatus, selectedCategory, currentPage]);

	useEffect(() => {
		fetchFatwahs();
	}, [fetchFatwahs]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		fetchFatwahs();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this fatwah?")) {
			return;
		}

		try {
			await deleteFatwah(id);
			toast.success("Fatwah deleted successfully");
			fetchFatwahs();
		} catch {
			toast.error("Failed to delete fatwah");
		}
	};

	const handleStatusChange = async (id: string, newStatus: FatwahStatus) => {
		try {
			await updateFatwah(id, { status: newStatus });
			toast.success(`Fatwah status updated to ${newStatus}`);
			fetchFatwahs();
		} catch {
			toast.error("Failed to update fatwah status");
		}
	};

	const openModal = (type: "view" | "edit" | "create", fatwah?: Fatwah) => {
		setModalType(type);
		setSelectedFatwah(fatwah || null);
		setIsModalOpen(true);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	const getStatusIcon = (status: FatwahStatus) => {
		switch (status) {
			case FatwahStatus.PENDING:
				return <Clock className="w-4 h-4 text-yellow-400" />;
			case FatwahStatus.PUBLISHED:
				return <CheckCircle className="w-4 h-4 text-green-400" />;
			case FatwahStatus.DRAFT:
				return <FileText className="w-4 h-4 text-blue-400" />;
			default:
				return <Clock className="w-4 h-4 text-gray-400" />;
		}
	};

	const getStatusColor = (status: FatwahStatus) => {
		switch (status) {
			case FatwahStatus.PENDING:
				return "bg-yellow-500/10 text-yellow-400 border-yellow-400/20";
			case FatwahStatus.PUBLISHED:
				return "bg-green-500/10 text-green-400 border-green-400/20";
			case FatwahStatus.DRAFT:
				return "bg-blue-500/10 text-blue-400 border-blue-400/20";
			default:
				return "bg-gray-500/10 text-gray-400 border-gray-400/20";
		}
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

	if (!isAuthenticated || user?.role !== "admin") {
		return <Navigate to="/admin/login" replace />;
	}

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative py-16 md:py-24">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
					{/* Header */}
					<motion.div
						className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center justify-between mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<div>
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-2">
								Manage Fatwahs
							</h1>
							<p className="text-gray-300 text-sm md:text-base">
								Review questions, create fatwahs, and manage published content
							</p>
						</div>
						<button
							onClick={() => openModal("create")}
							className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium text-sm md:text-base hover:bg-[#a1c780] transition-all w-full md:w-auto"
						>
							<Plus className="w-4 h-4 md:w-5 md:h-5" />
							Create Fatwah
						</button>
					</motion.div>

					{/* Search and Filters */}
					<motion.div
						className="bg-[#191b14] rounded-xl p-4 md:p-6 mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<div className="flex flex-col gap-4">
							{/* Search */}
							<form onSubmit={handleSearch} className="w-full">
								<div className="relative">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
									<input
										type="text"
										placeholder="Search fatwahs..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full bg-[#24271b] text-white rounded-lg pl-10 md:pl-12 pr-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
									/>
								</div>
							</form>

							{/* Filters */}
							<div className="flex flex-col sm:flex-row gap-3">
								{/* Status Filter */}
								<select
									value={selectedStatus}
									onChange={(e) => {
										setSelectedStatus(e.target.value);
										setCurrentPage(1);
									}}
									className="flex-1 px-4 py-3 bg-[#24271b] text-white rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
								>
									<option value="all">All Status</option>
									<option value={FatwahStatus.PENDING}>Pending</option>
									<option value={FatwahStatus.DRAFT}>Draft</option>
									<option value={FatwahStatus.PUBLISHED}>Published</option>
								</select>

								{/* Category Filter */}
								<div className="relative flex-1">
									<button
										onClick={() => setIsFilterOpen(!isFilterOpen)}
										className="flex items-center gap-2 px-4 py-3 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors w-full justify-between text-sm md:text-base"
									>
										<div className="flex items-center gap-2">
											<Filter className="w-4 h-4 md:w-5 md:h-5" />
											<span className="truncate">
												{selectedCategory === "all" ? "All Categories" : selectedCategory}
											</span>
										</div>
										<ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform flex-shrink-0 ${isFilterOpen ? "rotate-180" : ""}`} />
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
												className={`w-full text-left px-4 py-3 hover:bg-[#24271b] transition-colors text-sm md:text-base ${selectedCategory === "all" ? "bg-[#24271b] text-[#c3e5a5]" : "text-white"}`}
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
													className={`w-full text-left px-4 py-3 hover:bg-[#24271b] transition-colors text-sm md:text-base ${selectedCategory === category ? "bg-[#24271b] text-[#c3e5a5]" : "text-white"}`}
												>
													{category}
												</button>
											))}
										</motion.div>
									)}
								</div>
							</div>
						</div>
					</motion.div>

					{/* Fatwahs List */}
					{isLoading ? (
						<div className="grid place-items-center py-16">
							<Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#c3e5a5] animate-spin" />
						</div>
					) : fatwahs.length === 0 ? (
						<motion.div
							className="text-center py-12 md:py-16"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">No fatwahs found</h3>
							<p className="text-gray-400 mb-6 text-sm md:text-base px-4">Try adjusting your search terms or filters.</p>
							<button
								onClick={() => openModal("create")}
								className="inline-flex items-center gap-2 px-4 md:px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all text-sm md:text-base"
							>
								Create First Fatwah
							</button>
						</motion.div>
					) : (
						<div className="space-y-4">
							{fatwahs.map((fatwah, index) => (
								<motion.div
									key={fatwah._id}
									className="bg-[#191b14] rounded-xl p-4 md:p-6 shadow-xl"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: index * 0.05 }}
								>
									<div className="flex flex-col gap-4">
										<div className="flex-1">
											{/* Question */}
											<h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
												{fatwah.question}
											</h3>

											{/* Answer Preview */}
											{fatwah.answer && (
												<p className="text-gray-300 mb-3 line-clamp-2 text-sm md:text-base">
													{fatwah.answer}
												</p>
											)}

											{/* Categories */}
											<div className="flex flex-wrap gap-1 md:gap-2 mb-3">
												{fatwah.categories.map((category) => (
													<span
														key={category}
														className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}
													>
														<Tag className="w-3 h-3 inline mr-1" />
														{category}
													</span>
												))}
											</div>

											{/* Meta Info */}
											<div className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:items-center md:gap-4 text-xs md:text-sm text-gray-400">
												{fatwah.askerName && (
													<span>By: {fatwah.askerName}</span>
												)}
												<div className="flex items-center gap-1">
													<Calendar className="w-3 h-3 md:w-4 md:h-4" />
													{formatDate(fatwah.createdAt)}
												</div>
												{fatwah.answeredBy && (
													<span>Answered by: {fatwah.answeredBy.name}</span>
												)}
											</div>
										</div>

										<div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-700">
											{/* Status */}
											<div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(fatwah.status)}`}>
												{getStatusIcon(fatwah.status)}
												<span className="text-xs md:text-sm font-medium capitalize">{fatwah.status}</span>
											</div>

											{/* Actions */}
											<div className="flex items-center gap-2">
												<button
													onClick={() => openModal("view", fatwah)}
													className="p-2 bg-[#24271b] text-gray-300 rounded-lg hover:bg-[#2f332a] hover:text-[#c3e5a5] transition-colors"
													title="View"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													onClick={() => openModal("edit", fatwah)}
													className="p-2 bg-[#24271b] text-gray-300 rounded-lg hover:bg-[#2f332a] hover:text-blue-400 transition-colors"
													title="Edit"
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(fatwah._id)}
													className="p-2 bg-[#24271b] text-gray-300 rounded-lg hover:bg-[#2f332a] hover:text-red-400 transition-colors"
													title="Delete"
												>
													<Trash2 className="w-4 h-4" />
												</button>

												{/* Quick Status Change */}
												{fatwah.status === FatwahStatus.PENDING && fatwah.answer && (
													<button
														onClick={() => handleStatusChange(fatwah._id, FatwahStatus.PUBLISHED)}
														className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-xs font-medium"
													>
														Publish
													</button>
												)}
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
							className="flex justify-center mt-8 md:mt-12"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<div className="flex items-center gap-1 md:gap-2">
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className="px-3 md:px-4 py-2 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
								>
									<span className="hidden sm:inline">Previous</span>
									<span className="sm:hidden">Prev</span>
								</button>

								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
										if (page > totalPages) return null;

										return (
											<button
												key={page}
												onClick={() => setCurrentPage(page)}
												className={`px-2 md:px-3 py-2 rounded-lg transition-colors text-sm md:text-base ${currentPage === page
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
									className="px-3 md:px-4 py-2 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
								>
									<span className="hidden sm:inline">Next</span>
									<span className="sm:hidden">Next</span>
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</section>

			{/* Modal Component */}
			{isModalOpen && (
				<FatwahModal
					isOpen={isModalOpen}
					type={modalType}
					fatwah={selectedFatwah}
					categories={categories}
					onClose={() => setIsModalOpen(false)}
					onSave={() => {
						setIsModalOpen(false);
						fetchFatwahs();
					}}
				/>
			)}
		</main>
	);
};

export default ManageFatwahs;
