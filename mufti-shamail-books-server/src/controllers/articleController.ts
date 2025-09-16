import { Request, Response, NextFunction } from "express";
import Article, { IArticle } from "../models/Article";
import { AuthRequest } from "../types";

// Helper function to get excerpt from content
const getExcerpt = (content: string, length: number = 150): string => {
  const text = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Get all published articles (public)
export const getPublishedArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = req.query;

    const filter: any = { isPublished: true };

    // Add search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const articlesWithContent = await Article.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Add excerpt to articles
    const articles = articlesWithContent.map(article => ({
      ...article,
      excerpt: getExcerpt(article.content),
      content: undefined // Remove content from list view
    }));

    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: Number(page),
          totalPages,
          total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching published articles:", error);
    next(error);
  }
};

// Get single published article by ID (public)
export const getPublishedArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const article = await Article.findOneAndUpdate(
      { _id: id, isPublished: true },
      { $inc: { views: 1 } }, // Increment view count
      { new: true }
    ).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    next(error);
  }
};

// Get featured articles (public)
export const getFeaturedArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 6 } = req.query;

    const articles = await Article.find({ isPublished: true })
      .select("-content")
      .sort({ views: -1, publishedAt: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    next(error);
  }
};

// Get recent articles (public)
export const getRecentArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await Article.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .lean();

    const articlesWithExcerpt = articles.map(article => ({
      ...article,
      excerpt: getExcerpt(article.content),
      content: undefined
    }));

    res.status(200).json({
      success: true,
      data: articlesWithExcerpt,
    });
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    next(error);
  }
};

// ADMIN ROUTES (require authentication and admin role)

// Get all articles (admin)
export const getAllArticles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isPublished,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter: any = {};

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === "true";
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const articlesWithContent = await Article.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Add excerpt to articles for admin view
    const articles = articlesWithContent.map(article => ({
      ...article,
      excerpt: getExcerpt(article.content),
      content: undefined // Remove content from list view for performance
    }));

    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: Number(page),
          totalPages,
          total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching all articles:", error);
    next(error);
  }
};

// Get single article by ID (admin)
export const getArticleById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    next(error);
  }
};

// Create new article (admin)
export const createArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      content,
      author = "Admin",
      featuredImage,
      isPublished = false,
    } = req.body;

    // Validate required fields
    if (!title || !content || !featuredImage) {
      return res.status(400).json({
        success: false,
        error: "Title, content, and featured image are required",
      });
    }

    // Create new article
    const article = new Article({
      title,
      content,
      author,
      featuredImage,
      isPublished,
    });

    const savedArticle = await article.save();

    res.status(201).json({
      success: true,
      data: savedArticle,
      message: "Article created successfully",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return res.status(400).json({
        success: false,
        error: "Article with this title already exists",
      });
    }
    next(error);
  }
};

// Update article (admin)
export const updateArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // No need to recalculate read time - removed for simplicity

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    next(error);
  }
};

// Delete article (admin)
export const deleteArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    next(error);
  }
};

// Toggle article publish status (admin)
export const togglePublishStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    article.isPublished = !article.isPublished;
    if (article.isPublished && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: article,
      message: `Article ${article.isPublished ? "published" : "unpublished"} successfully`,
    });
  } catch (error) {
    console.error("Error toggling publish status:", error);
    next(error);
  }
};

// Get article statistics (admin)
export const getArticleStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ isPublished: true });
    const draftArticles = await Article.countDocuments({ isPublished: false });
    
    const totalViews = await Article.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    // Removed category stats for simplicity

    const recentArticles = await Article.find()
      .select("title createdAt isPublished views")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews: totalViews[0]?.totalViews || 0,
        },
        recentArticles,
      },
    });
  } catch (error) {
    console.error("Error fetching article stats:", error);
    next(error);
  }
};
