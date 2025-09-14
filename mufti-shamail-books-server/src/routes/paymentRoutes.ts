import express, { Router } from "express";
import {
	createRazorpayOrder,
	verifyRazorpayPayment,
} from "../controllers/paymentController";
import { optionalAuth } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/create-razorpay-order", optionalAuth, createRazorpayOrder);
router.post("/verify-razorpay-payment", optionalAuth, verifyRazorpayPayment);

export default router;
