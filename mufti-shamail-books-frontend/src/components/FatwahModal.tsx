import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Loader2, Tag, FileText, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { createFatwah, updateFatwah, Fatwah, FatwahCategory, FatwahStatus } from "../apis/fatwah.api";

interface FatwahModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: () => void;
	type: "view" | "edit" | "create";
	fatwah?: Fatwah | null;
	categories: FatwahCategory[];
}

const FatwahModal = ({ isOpen, onClose, onSave, type, fatwah, categories }: FatwahModalProps) => {
	const [formData, setFormData] = useState({
		question: "",
		answer: "",
		categories: [] as FatwahCategory[],
		status: FatwahStatus.DRAFT
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (isOpen && fatwah && type !== "create") {
			setFormData({
				question: fatwah.question,
				answer: fatwah.answer || "",
				categories: fatwah.categories,
				status: fatwah.status
			});
		} else if (isOpen && type === "create") {
			setFormData({
				question: "",
				answer: "",
				categories: [],
				status: FatwahStatus.DRAFT
			});
		}
		setErrors({});
	}, [isOpen, fatwah, type]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.question.trim()) {
			newErrors.question = "Question is required";
		}

		if (type !== "create" && !formData.answer.trim()) {
			newErrors.answer = "Answer is required for existing fatwahs";
		}

		if (formData.categories.length === 0) {
			newErrors.categories = "At least one category is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			if (type === "create") {
				await createFatwah({
					question: formData.question,
					answer: formData.answer || undefined,
					categories: formData.categories,
					status: formData.status
				});
				toast.success("Fatwah created successfully");
			} else if (type === "edit" && fatwah) {
				await updateFatwah(fatwah._id, {
					question: formData.question,
					answer: formData.answer || undefined,
					categories: formData.categories,
					status: formData.status
				});
				toast.success("Fatwah updated successfully");
			}
			onSave();
		} catch {
			toast.error(`Failed to ${type === "create" ? "create" : "update"} fatwah`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCategoryToggle = (category: FatwahCategory) => {
		setFormData(prev => ({
			...prev,
			categories: prev.categories.includes(category)
				? prev.categories.filter(c => c !== category)
				: [...prev.categories, category]
		}));
	};

	const getCategoryColor = (category: FatwahCategory) => {
		const colors = {
			[FatwahCategory.PRAYER]: "bg-blue-500/10 text-blue-400 border-blue-400/20",
			[FatwahCategory.FASTING]: "bg-purple-500/10 text-purple-400 border-purple-400/20",
			[FatwahCategory.MARRIAGE]: "bg-pink-500/10 text-pink-400 border-pink-400/20",
			[FatwahCategory.BUSINESS]: "bg-green-500/10 text-green-400 border-green-400/20",
			[FatwahCategory.PURIFICATION]: "bg-cyan-500/10 text-cyan-400 border-cyan-400/20",
			[FatwahCategory.HAJJ]: "bg-orange-500/10 text-orange-400 border-orange-400/20",
			[FatwahCategory.ZAKAT]: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
			[FatwahCategory.FAMILY]: "bg-red-500/10 text-red-400 border-red-400/20",
			[FatwahCategory.WORSHIP]: "bg-indigo-500/10 text-indigo-400 border-indigo-400/20",
			[FatwahCategory.OTHER]: "bg-gray-500/10 text-gray-400 border-gray-400/20"
		};
		return colors[category] || colors[FatwahCategory.OTHER];
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<motion.div
				className="bg-[#191b14] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-[#24271b]">
					<h2 className="text-2xl font-bold text-[#c3e5a5] flex items-center gap-2">
						<FileText className="w-6 h-6" />
						{type === "create" ? "Create New Fatwah" : type === "edit" ? "Edit Fatwah" : "View Fatwah"}
					</h2>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-white hover:bg-[#24271b] rounded-lg transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Content */}
				<div className="overflow-y-auto max-h-[calc(90vh-120px)]">
					<form onSubmit={handleSubmit} className="p-6 space-y-6">
						{/* Question */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Question *
							</label>
							<textarea
								value={formData.question}
								onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
								disabled={type === "view"}
								className="w-full bg-[#24271b] text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
								rows={4}
								placeholder="Enter the question..."
							/>
							{errors.question && (
								<div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									{errors.question}
								</div>
							)}
						</div>

						{/* Answer */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Answer {type !== "create" && "*"}
							</label>
							<textarea
								value={formData.answer}
								onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
								disabled={type === "view"}
								className="w-full bg-[#24271b] text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
								rows={8}
								placeholder="Enter the answer..."
							/>
							{errors.answer && (
								<div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									{errors.answer}
								</div>
							)}
						</div>

						{/* Categories */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Categories *
							</label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{categories.map((category) => (
									<button
										key={category}
										type="button"
										onClick={() => type !== "view" && handleCategoryToggle(category)}
										disabled={type === "view"}
										className={`p-3 rounded-lg border text-sm font-medium transition-all disabled:cursor-not-allowed ${formData.categories.includes(category)
												? getCategoryColor(category)
												: "bg-[#24271b] text-gray-400 border-[#2f332a] hover:border-[#c3e5a5]/20"
											}`}
									>
										<Tag className="w-4 h-4 inline mr-2" />
										{category}
									</button>
								))}
							</div>
							{errors.categories && (
								<div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									{errors.categories}
								</div>
							)}
						</div>

						{/* Status */}
						{type !== "view" && (
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Status
								</label>
								<select
									value={formData.status}
									onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as FatwahStatus }))}
									className="w-full bg-[#24271b] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
								>
									<option value={FatwahStatus.DRAFT}>Draft</option>
									<option value={FatwahStatus.PENDING}>Pending Review</option>
									<option value={FatwahStatus.PUBLISHED}>Published</option>
								</select>
							</div>
						)}

						{/* Display asker info if viewing */}
						{type === "view" && fatwah && (fatwah.askerName || fatwah.askerEmail) && (
							<div className="bg-[#24271b] rounded-lg p-4">
								<h3 className="text-lg font-semibold text-[#c3e5a5] mb-3">Asker Information</h3>
								<div className="space-y-2">
									{fatwah.askerName && (
										<p className="text-gray-300">
											<span className="font-medium">Name:</span> {fatwah.askerName}
										</p>
									)}
									{fatwah.askerEmail && (
										<p className="text-gray-300">
											<span className="font-medium">Email:</span> {fatwah.askerEmail}
										</p>
									)}
								</div>
							</div>
						)}
					</form>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-4 p-6 border-t border-[#24271b]">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 bg-[#24271b] text-white rounded-lg hover:bg-[#2f332a] transition-colors"
					>
						{type === "view" ? "Close" : "Cancel"}
					</button>
					{type !== "view" && (
						<button
							type="submit"
							disabled={isLoading}
							onClick={handleSubmit}
							className="inline-flex items-center gap-2 px-6 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg hover:bg-[#a1c780] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							{isLoading ? "Saving..." : type === "create" ? "Create Fatwah" : "Update Fatwah"}
						</button>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default FatwahModal;
