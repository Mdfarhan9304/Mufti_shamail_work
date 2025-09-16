import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getPublishedArticles, Article, ArticleFilters } from "../apis/articles.api";
import { getImageUrl } from "../utils/imageUtils";

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ArticleFilters>({
    page: 1,
    limit: 12,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await getPublishedArticles(filters);
      if (response.success) {
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError("Failed to load articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };



  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

    return (
      <main className="min-h-screen bg-[#121510] pt-24 md:pt-28">
        {/* Header Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#c3e5a5] mb-4">
              Articles & Insights
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover our latest articles on Islamic teachings, spiritual guidance, and contemporary issues.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-[#191b14] rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                      <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article._id}
                  className="group bg-[#191b14] rounded-xl overflow-hidden hover:bg-[#1f221a] transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link to={`/articles/${article._id}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(article.featuredImage)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      <div className="absolute top-4 right-4">
                        <span className="inline-block px-2 py-1 bg-black/50 text-white text-xs rounded">
                          Article
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c3e5a5] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-sm text-gray-400">
                          By <span className="text-[#c3e5a5]">{article.author}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <motion.div
              className="flex justify-center items-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-2 px-4 py-2 bg-[#191b14] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#24271b] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === pagination.currentPage;
                  
                  // Show first, last, current, and surrounding pages
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          isCurrentPage
                            ? "bg-[#c3e5a5] text-gray-800"
                            : "bg-[#191b14] text-white hover:bg-[#24271b]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={page} className="text-gray-400">...</span>;
                  }
                  
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-2 px-4 py-2 bg-[#191b14] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#24271b] transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          </div>
        </section>
      </main>
  );
};

export default Articles;
