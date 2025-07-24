import { Request, Response } from "express";
import { Order, OrderDocument } from "../models/Order";
import { fixCart } from "../utils/helper";
import { ApiError } from "../utils/errors";

// Extend Express Request to include user property
interface AuthRequest extends Request {
    user?: {
        _id: string;
        role: string;
    };
}

// Get orders for a specific user
export const getOrders = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ user: userId })
            .populate("items.book")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();

        const newOrders = orders.map((order) => ({
            ...order,
            items: fixCart(order.items),
        }));

        res.status(200).json({ success: true, data: { orders: newOrders } });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw new ApiError(500, "Failed to fetch orders");
    }
};

// Get all orders (admin only)
export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        // Check if user is admin
        if (req.user?.role !== "admin") {
            throw new ApiError(403, "Access denied. Admin only route.");
        }

        // Get query parameters for filtering
        const { status, startDate, endDate } = req.query;
        
        // Build query
        const query: any = {};
        
        // Add status filter if provided
        if (status) {
            query.status = status;
        }
        
        // Add date range filter if provided
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }

        const orders = await Order.find(query)
            .populate("items.book")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();

        const newOrders = orders.map((order) => ({
            ...order,
            items: fixCart(order.items),
        }));

        // Calculate total revenue - sum of all items' (price * quantity)
        const totalRevenue = orders.reduce((acc, order) => {
            const orderTotal = order.items.reduce((itemAcc, item) => {
                return itemAcc + (item.price * item.quantity);
            }, 0);
            return acc + orderTotal;
        }, 0);

        // Group orders by status
        const ordersByStatus = orders.reduce((acc: Record<string, number>, order) => {
			const orderStatus = typeof order.status === 'string' ? order.status : 'pending';

            acc[orderStatus] = (acc[orderStatus] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                orders: newOrders,
                stats: {
                    totalOrders: orders.length,
                    totalRevenue,
                    ordersByStatus,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to fetch orders");
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Check if user is admin
        if (req.user?.role !== "admin") {
            throw new ApiError(403, "Access denied. Admin only route.");
        }

        // Validate status
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid status value");
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        )
            .populate("items.book")
            .populate("user", "name email")
            .lean();

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const updatedOrder = {
            ...order,
            items: fixCart(order.items),
        };

        res.status(200).json({
            success: true,
            data: { order: updatedOrder },
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to update order status");
    }
};
