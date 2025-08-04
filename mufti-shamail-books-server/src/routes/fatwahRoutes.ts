import express, { Router } from "express";
import {
	getPublishedFatwahs,
	getAllFatwahs,
	getFatwahById,
	submitQuestion,
	createFatwah,
	updateFatwah,
	deleteFatwah,
	getFatwahCategories
} from "../controllers/fatwahController";
import { protect, authorize } from "../middlewares/auth";

const router: Router = express.Router();

// Public routes
router.get("/public", getPublishedFatwahs);
router.get("/categories", getFatwahCategories);
router.get("/:id", getFatwahById);
router.post("/submit", submitQuestion);

// Protected admin routes
router.get("/", protect, authorize("admin"), getAllFatwahs);
router.post("/", protect, authorize("admin"), createFatwah);
router.put("/:id", protect, authorize("admin"), updateFatwah);
router.delete("/:id", protect, authorize("admin"), deleteFatwah);

export default router;
