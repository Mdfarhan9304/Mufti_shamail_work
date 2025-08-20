import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, MessageCircle, User } from "lucide-react";
import { getFatwahById, Fatwah, FatwahCategory } from "../apis/fatwah.api";
import { toast } from "react-toastify";

const FatwahDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [fatwah, setFatwah] = useState<Fatwah | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFatwah = async () => {
            try {
                setIsLoading(true);
                const { data } = await getFatwahById(id!);
                setFatwah(data);
            } catch (error) {
                toast.error("Failed to fetch fatwah details");
                console.error("Failed to fetch fatwah:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchFatwah();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
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

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
                    <div className="grid place-items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c3e5a5]"></div>
                        <p className="text-gray-400 mt-4 text-sm md:text-base">Loading fatwah...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!fatwah) {
        return (
            <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
                    <div className="text-center">
                        <MessageCircle className="w-12 md:w-16 h-12 md:h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-4">Fatwah not found</h2>
                        <Link
                            to="/fatwahs"
                            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all text-sm md:text-base"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Fatwahs
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
            <section className="py-8 md:py-16 lg:py-">
                <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Link
                            to="/fatwah"
                            className="inline-flex items-center gap-2 text-[#c3e5a5] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to All Fatwahs
                        </Link>
                    </motion.div>

                    {/* Fatwah Content */}
                    <motion.article
                        className="bg-[#191b14] rounded-2xl p-4 md:p-8 lg:p-12 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                            {fatwah.categories.map((category) => (
                                <span
                                    key={category}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border ${getCategoryColor(category)}`}
                                >
                                    <Tag className="w-3 h-3 inline mr-1 md:mr-2" />
                                    {category}
                                </span>
                            ))}
                        </div>

                        {/* Question Section */}
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#c3e5a5] mb-3 md:mb-4 flex items-start gap-2 md:gap-3">
                                <MessageCircle className="w-6 md:w-8 h-6 md:h-8 mt-1 flex-shrink-0" />
                                Question
                            </h1>
                            <div className="bg-[#24271b] rounded-xl p-2 md:p-6 border-l-4 border-[#c3e5a5]">
                                <p className="text-white text-base md:text-lg leading-relaxed">
                                    {fatwah.question}
                                </p>
                            </div>
                        </div>

                        {/* Answer Section */}
                        {fatwah.answer && (
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#c3e5a5] mb-3 md:mb-4">
                                    Answer
                                </h2>
                                <div className="prose prose-invert max-w-none">
                                    <div className="bg-[#24271b] rounded-xl p-2 md:p-6">
                                        <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                            {fatwah.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className="border-t border-gray-800 pt-4 md:pt-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                    {fatwah.answeredBy && (
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>Answered by: <span className="text-[#c3e5a5] font-medium">{fatwah.answeredBy.name}</span></span>
                                        </div>
                                    )}
                                    {fatwah.askerName && (
                                        <div>
                                            <span>Asked by: <span className="text-gray-300">{fatwah.askerName}</span></span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(fatwah.publishedAt || fatwah.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-800">
                            <div className="bg-gradient-to-r from-[#c3e5a5]/10 to-transparent rounded-xl p-4 md:p-6">
                                <h3 className="text-base md:text-lg font-semibold text-[#c3e5a5] mb-2">
                                    Have a Question?
                                </h3>
                                <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                                    Submit your own Islamic question and get guidance from qualified scholars.
                                </p>
                                <Link
                                    to="/ask-fatwah"
                                    className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all text-sm md:text-base"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Ask a Question
                                </Link>
                            </div>
                        </div>
                    </motion.article>

                    {/* Related Fatwahs could go here */}
                </div>
            </section>
        </main>
    );
};

export default FatwahDetail;
