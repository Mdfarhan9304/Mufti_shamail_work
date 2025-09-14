import express, { Router } from "express";
import { protect } from "../middlewares/auth";
import { getOrders, getAllOrders, updateOrderStatus, getOrderById, exportOrdersCSV } from "../controllers/orderController";

const router: Router = express.Router();

// Admin routes (must come before the :userId route)
router.get("/admin/all", protect, getAllOrders); // Get all orders (admin only)
router.get("/admin/export-csv", protect, exportOrdersCSV); // Export orders as CSV (admin only)
router.get("/admin/:orderId", protect, getOrderById); // Get single order details (admin only)
router.patch("/admin/:orderId/status", protect, updateOrderStatus); // Update order status (admin only)

// Protected user routes
router.get("/:userId", protect, getOrders); // Get orders for a specific user

export default router;
