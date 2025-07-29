import express, { Router } from "express";
import {
	generatePaymentUrl,
	checkOrderPaymentStatus,
} from "../controllers/paymentController";
import { optionalAuth, protect } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/generate-payment-url", optionalAuth, generatePaymentUrl);
router.post(
	"/check-order-payment-status",
	optionalAuth,
	checkOrderPaymentStatus
);


export default router;
