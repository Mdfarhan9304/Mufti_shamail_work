import express, { Router, Response } from "express";
import {
	register,
	login,
	refreshToken,
	logout,
} from "../controllers/authController";
import { protect } from "../middlewares/auth";
import User from "../models/User";
import { AuthRequest } from "../types";
import { fixCart } from "../utils/helper";

const router: Router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, async (req: AuthRequest, res: Response) => {
	const user = await User.findById(req.user?._id)
		.populate("cart.book")
		.lean();
	const fixedCart = fixCart(user?.cart || []);
	res.json({ success: true, data: { user: { ...user, cart: fixedCart } } });
});

export default router;
