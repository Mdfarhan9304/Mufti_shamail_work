import express from "express";
import {
  getPublishedArticles,
  getPublishedArticleById,
  getFeaturedArticles,
  getRecentArticles,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublishStatus,
  getArticleStats,
} from "../controllers/articleController";
import { protect, authorize } from "../middlewares/auth";

const router = express.Router();

// Public routes
router.get("/published", getPublishedArticles);
router.get("/published/:id", getPublishedArticleById);
router.get("/featured", getFeaturedArticles);
router.get("/recent", getRecentArticles);

// Protected admin routes
router.get("/admin/all", protect, authorize("admin"), getAllArticles);
router.get("/admin/stats", protect, authorize("admin"), getArticleStats);
router.get("/admin/:id", protect, authorize("admin"), getArticleById);
router.post("/admin", protect, authorize("admin"), createArticle);
router.put("/admin/:id", protect, authorize("admin"), updateArticle);
router.delete("/admin/:id", protect, authorize("admin"), deleteArticle);
router.patch("/admin/:id/toggle-publish", protect, authorize("admin"), togglePublishStatus);

export default router;
