import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, ArrowLeft, Tag, Share2, Twitter, Facebook, Copy, Check } from "lucide-react";
import { getPublishedArticleById, Article } from "../apis/articles.api";
import { getImageUrl } from "../utils/imageUtils";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await getPublishedArticleById(id);
      if (response.success) {
        setArticle(response.data);
      }
    } catch (err) {
      setError("Article not found");
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOnTwitter = () => {
    const text = `Check out this article: ${article?.title}`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  

  if (loading) {
    return (
      <main className="min-h-screen bg-[#121510] pt-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8 w-32"></div>
            <div className="h-64 bg-gray-700 rounded-xl mb-8"></div>
            <div className="h-12 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-700 rounded mb-8 w-64"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-[#121510] pt-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121510] pt-24">
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-[#c3e5a5] hover:text-[#a1c780] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          className="relative h-96 rounded-xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute bottom-6 left-6">
            <span className="inline-block px-4 py-2 bg-[#c3e5a5] text-gray-800 font-medium rounded-full">
              {article.category || 'General'}
            </span>
          </div>
        </motion.div>

        {/* Article Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{article.views} views</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              By <span className="text-[#c3e5a5] font-medium">{article.author}</span>
            </p>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Share:</span>
              <button
                onClick={shareOnTwitter}
                className="p-2 bg-[#191b14] text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={shareOnFacebook}
                className="p-2 bg-[#191b14] text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-[#191b14] text-gray-400 hover:text-[#c3e5a5] rounded-lg transition-colors"
                title="Copy link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 leading-relaxed italic border-l-4 border-[#c3e5a5] pl-6">
            {article.excerpt}
          </p>
        </motion.header>

        {/* Article Content */}
        <motion.div
          className="prose prose-lg prose-invert max-w-none mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div 
            className="text-gray-300 leading-relaxed"
            style={{
              lineHeight: "1.8",
              fontSize: "1.125rem"
            }}
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/\n/g, '<br />') 
            }}
          />
        </motion.div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-gray-400">
                <Tag className="w-4 h-4" />
                <span>Tags:</span>
              </div>
              {(article.tags || []).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#191b14] text-[#c3e5a5] text-sm rounded-full border border-gray-800 hover:border-[#c3e5a5] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="flex justify-center pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-full font-medium hover:bg-[#a1c780] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </motion.div>
      </article>
    </main>
  );
};

export default ArticleDetail;
