import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  TrendingUp,
  FileText,
  Users
} from "lucide-react";
import { getAllArticles, deleteArticle, toggleArticlePublishStatus, getArticleStats, Article, ArticleFilters } from "../../apis/articles.api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const ArticleDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ArticleFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [publishFilter, setPublishFilter] = useState<string>("");

  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, [filters]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await getAllArticles(filters);
      if (response.success) {
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      toast.error("Failed to load articles");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getArticleStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
  };

  const handlePublishFilter = (value: string) => {
    setPublishFilter(value);
    setFilters(prev => ({
      ...prev,
      isPublished: value === "" ? undefined : value === "published",
      page: 1,
    }));
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteArticle(id);
        toast.success("Article deleted successfully");
        fetchArticles();
        fetchStats();
      } catch (err) {
        toast.error("Failed to delete article");
        console.error("Error deleting article:", err);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await toggleArticlePublishStatus(id);
      toast.success(`Article ${currentStatus ? "unpublished" : "published"} successfully`);
      fetchArticles();
      fetchStats();
    } catch (err) {
      toast.error("Failed to update article status");
      console.error("Error toggling publish status:", err);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#c3e5a5]">Article Management</h1>
            <Link
              to="/admin/articles/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c3e5a5] text-gray-800 rounded-lg font-medium hover:bg-[#a1c780] transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Article
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-[#191b14] p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#c3e5a5]" />
                <div>
                  <p className="text-gray-400 text-sm">Total Articles</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalArticles}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#191b14] p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-gray-400 text-sm">Published</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.publishedArticles}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#191b14] p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <EyeOff className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-gray-400 text-sm">Drafts</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.draftArticles}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#191b14] p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          className="bg-[#191b14] p-6 rounded-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#24271b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#c3e5a5] focus:outline-none"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Status:</span>
              </div>
              <select
                value={publishFilter}
                onChange={(e) => handlePublishFilter(e.target.value)}
                className="px-3 py-2 bg-[#24271b] border border-gray-700 rounded-lg text-white focus:border-[#c3e5a5] focus:outline-none"
              >
                <option value="">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Articles Table */}
        <motion.div
          className="bg-[#191b14] rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#24271b]">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Title</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Views</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Created</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="border-t border-gray-800">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-12"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-20"></div>
                      </td>
                    </tr>
                  ))
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No articles found
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article._id} className="border-t border-gray-800 hover:bg-[#1f221a] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-white font-medium line-clamp-1">{article.title}</h3>
                            <p className="text-gray-400 text-sm">By {article.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          article.isPublished 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-orange-500/10 text-orange-500"
                        }`}>
                          {article.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatDate(article.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(article._id, article.isPublished)}
                            className={`p-2 rounded-lg transition-colors ${
                              article.isPublished
                                ? "text-orange-500 hover:bg-orange-500/10"
                                : "text-green-500 hover:bg-green-500/10"
                            }`}
                            title={article.isPublished ? "Unpublish" : "Publish"}
                          >
                            {article.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <Link
                            to={`/admin/articles/edit/${article._id}`}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(article._id, article.title)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-gray-400 text-sm">
                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.total)} of {pagination.total} articles
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 bg-[#24271b] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2f332a] transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 bg-[#24271b] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2f332a] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ArticleDashboard;
