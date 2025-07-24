import express, { Router } from "express";
import {
	getAllBooks,
	getBookById,
	createBook,
	updateBook,
	deleteBook,
} from "../controllers/bookController";
import { protect, authorize } from "../middlewares/auth";
import upload from "../services/uploadService";

const router: Router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Protected routes
router.post(
	"/",
	protect,
	authorize("admin"),
	upload.array("images", 5),
	createBook
);
router.put("/:id", protect, authorize("admin"), updateBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);

export default router;
