import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { getArticleById, updateArticle, Article } from "../../apis/articles.api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const EditArticle = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "Admin",
    featuredImage: "",
    isPublished: false,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        setFetching(true);
        const response = await getArticleById(id);
        if (response.success) {
          const article: Article = response.data;
          setFormData({
            title: article.title,
            content: article.content,
            author: article.author,
            featuredImage: article.featuredImage,
            isPublished: article.isPublished,
          });
        }
      } catch (error) {
        toast.error("Failed to load article");
        navigate("/admin/articles");
      } finally {
        setFetching(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.title || !formData.content || !formData.featuredImage) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await updateArticle(id, formData);
      if (response.success) {
        toast.success("Article updated successfully!");
        navigate("/admin/articles");
      }
    } catch (error) {
      toast.error("Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate("/admin/articles")}
                className="p-2 hover:bg-[#24271b] rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-[#c3e5a5]" />
              </button>
              <h1 className="text-3xl font-bold text-[#c3e5a5]">Edit Article</h1>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-[#191b14] rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {fetching ? (
              <div className="text-gray-400">Loading article...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter article title..."
                    className="w-full px-4 py-3 bg-[#24271b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#c3e5a5] focus:outline-none"
                    required
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-white font-medium mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name..."
                    className="w-full px-4 py-3 bg-[#24271b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#c3e5a5] focus:outline-none"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Featured Image URL *
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-[#24271b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#c3e5a5] focus:outline-none"
                    required
                  />
                  {formData.featuredImage && (
                    <div className="mt-3">
                      <img
                        src={formData.featuredImage}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Article Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your article content here..."
                    rows={12}
                    className="w-full px-4 py-3 bg-[#24271b] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#c3e5a5] focus:outline-none resize-vertical"
                    required
                  />
                </div>

                {/* Publish Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#c3e5a5] bg-[#24271b] border-gray-700 rounded focus:ring-[#c3e5a5] focus:ring-2"
                  />
                  <label htmlFor="isPublished" className="text-white font-medium">
                    Published
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-lg font-medium hover:bg-[#a1c780] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/articles")}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default EditArticle;


