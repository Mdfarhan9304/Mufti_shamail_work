import express, { Router } from "express";
import {
	addToCart,
	updateCartItem,
	removeFromCart,
	clearCart,
} from "../controllers/cartController";
import { protect } from "../middlewares/auth";

const router: Router = express.Router();

// Protected routes
router.post("/add", protect, addToCart);
router.patch("/update", protect, updateCartItem);
router.delete("/remove", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
