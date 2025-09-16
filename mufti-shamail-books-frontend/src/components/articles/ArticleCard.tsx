import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { Article } from "../../apis/articles.api";
import { getImageUrl } from "../../utils/imageUtils";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      className="group bg-[#1a1f17] rounded-xl overflow-hidden border border-gray-800 hover:border-[#c3e5a5]/30 transition-all duration-300"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/articles/${article._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Views Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
            <Eye className="w-3 h-3" />
            <span>{article.views}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-[#c3e5a5] transition-colors">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-[#c3e5a5] group-hover:gap-2 transition-all">
              <span className="text-xs font-medium">Read More</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            By <span className="text-[#c3e5a5] font-medium">{article.author}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;

