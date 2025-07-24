import express, { Router } from "express";
import {
	forgotPassword,
	resetPassword,
} from "../controllers/passwordController";

const router: Router = express.Router();

// Public routes (no auth required)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
