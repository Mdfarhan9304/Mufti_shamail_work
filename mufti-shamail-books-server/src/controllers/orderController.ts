import { Request, Response } from "express";
import { Order, OrderDocument } from "../models/Order";
import { fixCart } from "../utils/helper";
import { ApiError } from "../utils/errors";
import { sendOrderShippedEmail, sendOrderDeliveredEmail, sendOrderRTOEmail } from "../services/emailService";

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10; // Orders per page
    const skip = (page - 1) * limit;

    try {
        // Get total count for pagination
        const totalOrders = await Order.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find({ user: userId })
            .populate("items.book")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const newOrders = orders.map((order) => ({
            ...order,
            items: fixCart(order.items),
        }));

        res.status(200).json({ 
            success: true, 
            data: { 
                orders: newOrders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            } 
        });
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

        // Get query parameters for filtering and pagination
        const { status, startDate, endDate } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10; // Orders per page
        const skip = (page - 1) * limit;
        
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

        // Get total count for pagination
        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find(query)
            .populate("items.book")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
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
                    totalOrders,
                    totalRevenue,
                    ordersByStatus,
                },
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
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

// Update order status with fulfillment details (admin only)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const { 
            status, 
            trackingNumber, 
            shippingProvider, 
            trackingUrl, 
            estimatedDelivery,
            notes 
        } = req.body;

        // Check if user is admin
        if (req.user?.role !== "admin") {
            throw new ApiError(403, "Access denied. Admin only route.");
        }

        // Validate status
        const validStatuses = ["pending", "shipped", "delivered", "RTO"];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid status value");
        }

        // Get the current order to compare status
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            throw new ApiError(404, "Order not found");
        }

        // Prepare update data
        const updateData: any = { status };
        
        // Update fulfillment details if provided
        if (trackingNumber || shippingProvider || trackingUrl || estimatedDelivery || notes) {
            updateData.fulfillment = {
                ...currentOrder.fulfillment,
                ...(trackingNumber && { trackingNumber }),
                ...(shippingProvider && { shippingProvider }),
                ...(trackingUrl && { trackingUrl }),
                ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) }),
                ...(notes && { notes }),
            };
        }

        // Set shipping/delivery timestamps
        if (status === "shipped" && currentOrder.status !== "shipped") {
            updateData.fulfillment = {
                ...updateData.fulfillment,
                shippedAt: new Date(),
            };
        }
        
        if (status === "delivered" && currentOrder.status !== "delivered") {
            updateData.fulfillment = {
                ...updateData.fulfillment,
                deliveredAt: new Date(),
            };
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            updateData,
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

        // Send email notifications for status changes (except pending)
        try {
            if (status === "shipped" && currentOrder.status !== "shipped") {
                await sendOrderShippedEmail(updatedOrder);
                console.log("Shipped email sent successfully");
            } else if (status === "delivered" && currentOrder.status !== "delivered") {
                await sendOrderDeliveredEmail(updatedOrder);
                console.log("Delivered email sent successfully");
            } else if (status === "RTO" && currentOrder.status !== "RTO") {
                await sendOrderRTOEmail(updatedOrder);
                console.log("RTO email sent successfully");
            }
        } catch (emailError) {
            console.error("Error sending status update email:", emailError);
            // Don't fail the request if email fails
        }

        res.status(200).json({
            success: true,
            data: { order: updatedOrder },
            message: `Order status updated to ${status}${status === 'shipped' || status === 'delivered' || status === 'RTO' ? '. Email notification sent.' : ''}`
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to update order status");
    }
};

// Get single order details (admin only)
export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;

        // Check if user is admin
        if (req.user?.role !== "admin") {
            throw new ApiError(403, "Access denied. Admin only route.");
        }

        const order = await Order.findById(orderId)
            .populate("items.book")
            .populate("user", "name email")
            .lean();

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        const orderWithFixedCart = {
            ...order,
            items: fixCart(order.items),
        };

        res.status(200).json({
            success: true,
            data: { order: orderWithFixedCart },
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to fetch order");
    }
};

// Export orders as CSV for delivery partners
export const exportOrdersCSV = async (req: AuthRequest, res: Response) => {
    try {
        // Only allow admin users
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: "Access denied. Admin role required."
            });
        }

        const { status, startDate, endDate } = req.query;
        
        // Build filter query
        const filter: any = {};
        
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate as string);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate as string);
            }
        }

        const orders = await Order.find(filter)
            .populate("items.book", "name author")
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        // Prepare CSV data
        const csvData = orders.map((order: any) => {
            const itemsDetails = order.items.map((item: any) => 
                `${item.book?.name || 'Unknown'}`
            ).join('; ');

            // Calculate total quantity
            const totalQuantity = order.items.reduce((total: number, item: any) => total + item.quantity, 0);

            return {
                'Order Number': order.orderNumber,
                'Customer Name': order.contactDetails?.name || '',
                'Customer Email': order.contactDetails?.email || '',
                'Customer Phone': order.contactDetails?.phone || '',
                'Items': itemsDetails,
                'Quantity': totalQuantity,
                'Total Amount': order.amount,
                'Status': order.status,
                'Address Line 1': order.shippingAddress?.addressLine1 || '',
                'Address Line 2': order.shippingAddress?.addressLine2 || '',
                'Landmark': order.shippingAddress?.landmark || '',
                'City': order.shippingAddress?.city || '',
                'State': order.shippingAddress?.state || '',
                'Pincode': order.shippingAddress?.pincode || '',
                'Order Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
                'Tracking Number': order.fulfillment?.trackingNumber || '',
                'Shipping Provider': order.fulfillment?.shippingProvider || '',
            };
        });

        // Convert to CSV format
        if (csvData.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No orders found for the specified criteria"
            });
        }

        const headers = Object.keys(csvData[0]);
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => 
                headers.map(header => {
                    const value = row[header as keyof typeof row];
                    // Escape commas and quotes in CSV values
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        // Set headers for file download
        const filename = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        
        res.status(200).send(csvContent);
        
    } catch (error) {
        console.error("Export orders CSV error:", error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to export orders"
        });
    }
};
