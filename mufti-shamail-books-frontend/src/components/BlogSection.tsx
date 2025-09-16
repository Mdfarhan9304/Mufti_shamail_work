import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Eye, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedArticles, Article } from "../apis/articles.api";
import { getImageUrl } from "../utils/imageUtils";

const BlogSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedArticles(6);
        if (response.success) {
          setArticles(response.data);
        }
      } catch (err) {
        setError("Failed to load articles");
        console.error("Error fetching featured articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-[#121510]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#c3e5a5] mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our latest insights on Islamic teachings, spiritual guidance, and contemporary issues.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-[#121510]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-red-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null; // Don't show section if no articles
  }

  return (
    <section className="py-16 md:py-24 bg-[#121510]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#c3e5a5] mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our latest insights on Islamic teachings, spiritual guidance, and contemporary issues.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <motion.article
              key={article._id}
              className="group bg-[#191b14] rounded-xl overflow-hidden hover:bg-[#1f221a] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Link to={`/articles/${article._id}`} className="block">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(article.featuredImage)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Simple overlay for better text readability */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-2 py-1 bg-black/50 text-white text-xs rounded">
                      Article
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c3e5a5] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Simple Meta Information */}
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

                  {/* Author */}
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

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all group"
          >
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
