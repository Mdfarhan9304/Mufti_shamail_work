import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    Copy,
    Edit3,
    Save,
    X,
    ExternalLink,
    MapPin,
    User,
    Mail,
    Phone,
    Calendar,
    IndianRupee
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { getAdminOrders, updateOrderStatus } from "../apis/orders.api";

interface Order {
    _id: string;
    orderNumber: string;
    txnId: string;
    status: string;
    amount: number;
    createdAt: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    contactDetails: {
        name: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        addressType: string;
    };
    items: {
        _id: string;
        name: string;
        author: string;
        price: number;
        quantity: number;
        images: string[];
    }[];
    fulfillment?: {
        trackingNumber?: string;
        shippingProvider?: string;
        trackingUrl?: string;
        shippedAt?: string;
        deliveredAt?: string;
        estimatedDelivery?: string;
        notes?: string;
    };
}

const OrderDetails = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [fulfillmentData, setFulfillmentData] = useState({
        status: "",
        trackingNumber: "",
        shippingProvider: "",
        trackingUrl: "",
        estimatedDelivery: "",
        notes: ""
    });

    const statusColors = {
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        shipped: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        delivered: "bg-green-500/20 text-green-400 border-green-500/30",
        cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const statusIcons = {
        pending: Clock,
        processing: Package,
        shipped: Truck,
        delivered: CheckCircle,
        cancelled: X,
    };

    const shippingProviders = [
        "FedEx", "DHL", "UPS", "Blue Dart", "DTDC", 
        "India Post", "Delhivery", "Ecom Express", "Other"
    ];

    useEffect(() => {
        if (!orderId) return;
        
        const fetchOrder = async () => {
            try {
                const response = await getAdminOrders();
                const foundOrder = response.data.orders.find(o => o._id === orderId);
                if (!foundOrder) {
                    throw new Error("Order not found");
                }
                setOrder(foundOrder);
                setFulfillmentData({
                    status: foundOrder.status || "",
                    trackingNumber: foundOrder.fulfillment?.trackingNumber || "",
                    shippingProvider: foundOrder.fulfillment?.shippingProvider || "",
                    trackingUrl: foundOrder.fulfillment?.trackingUrl || "",
                    estimatedDelivery: foundOrder.fulfillment?.estimatedDelivery
                    ? new Date(foundOrder.fulfillment.estimatedDelivery).toISOString().split('T')[0]
                    : "",
                    notes: foundOrder.fulfillment?.notes || ""
                });
            } catch (error) {
                console.error("Failed to fetch order:", error);
                toast.error("Failed to load order details");
                navigate("/admin/dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAddress = (address: Order['shippingAddress']) => {
        return [
            address.addressLine1,
            address.addressLine2,
            address.landmark,
            `${address.city}, ${address.state} - ${address.pincode}`
        ].filter(Boolean).join(", ");
    };

    const handleSaveFulfillment = async () => {
        try {
            await updateOrderStatus(order!._id, fulfillmentData);
            toast.success("Order fulfillment updated successfully!");
            setEditMode(false);
            // Refresh order data
            const response = await getAdminOrders();
            const updatedOrder = response.data.orders.find(o => o._id === orderId);
            if (updatedOrder) {
                setOrder(updatedOrder);
            }
        } catch (error) {
            toast.error("Failed to update order fulfillment");
        }
    };

    if (user?.role !== "admin") {
        navigate("/dashboard");
        return null;
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c3e5a5]"></div>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Order not found</p>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="mt-4 text-[#c3e5a5] hover:text-white transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        );
    }

    const StatusIcon = statusIcons[(order.status || "pending") as keyof typeof statusIcons];

    return (
        <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="flex items-center gap-2 text-[#c3e5a5] hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Orders
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-[#c3e5a5] mb-2">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-lg font-medium ${statusColors[(order.status || "pending") as keyof typeof statusColors]}`}>
                            {StatusIcon && <StatusIcon className="w-5 h-5" />}
                            <span className="capitalize">{order.status || "pending"}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Items */}
                        <motion.div
                            className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-[#c3e5a5] mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-4 p-4 bg-[#24271b] rounded-lg"
                                    >
                                        <div className="w-16 h-20 bg-[#2a2f1f] rounded-lg flex items-center justify-center">
                                            <Package className="w-8 h-8 text-[#c3e5a5]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold">{item.name}</h3>
                                            <p className="text-gray-400">by {item.author}</p>
                                            <p className="text-gray-400">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-semibold flex items-center">
                                                <IndianRupee className="w-4 h-4 mr-1" />
                                                {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                <IndianRupee className="w-3 h-3 inline mr-1" />
                                                {item.price} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-[#c3e5a5]/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-[#c3e5a5]">Total Amount</span>
                                    <span className="text-2xl font-bold text-white flex items-center">
                                        <IndianRupee className="w-6 h-6 mr-1" />
                                        {(order.amount || 0).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Fulfillment Management */}
                        <motion.div
                            className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#c3e5a5]">📦 Fulfillment Management</h2>
                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-2 bg-[#c3e5a5] text-[#191b14] px-4 py-2 rounded-lg hover:bg-[#b3d595] transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveFulfillment}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditMode(false)}
                                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Status */}
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Order Status
                                    </label>
                                    {editMode ? (
                                        <select
                                            value={fulfillmentData.status}
                                            onChange={(e) => setFulfillmentData({...fulfillmentData, status: e.target.value})}
                                            className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${statusColors[(order.status || "pending") as keyof typeof statusColors]}`}>
                                            {StatusIcon && <StatusIcon className="w-4 h-4" />}
                                            <span className="capitalize">{order.status || "pending"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Shipping Provider */}
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Shipping Provider
                                    </label>
                                    {editMode ? (
                                        <select
                                            value={fulfillmentData.shippingProvider}
                                            onChange={(e) => setFulfillmentData({...fulfillmentData, shippingProvider: e.target.value})}
                                            className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
                                        >
                                            <option value="">Select Provider</option>
                                            {shippingProviders.map((provider) => (
                                                <option key={provider} value={provider}>{provider}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-white">{order.fulfillment?.shippingProvider || "Not set"}</p>
                                    )}
                                </div>

                                {/* Tracking Number */}
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Tracking Number
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={fulfillmentData.trackingNumber}
                                            onChange={(e) => setFulfillmentData({...fulfillmentData, trackingNumber: e.target.value})}
                                            className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
                                            placeholder="Enter tracking number"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-white">{order.fulfillment?.trackingNumber || "Not set"}</p>
                                            {order.fulfillment?.trackingNumber && (
                                                <button
                                                    onClick={() => copyToClipboard(order.fulfillment!.trackingNumber!)}
                                                    className="text-[#c3e5a5] hover:text-white transition-colors"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Tracking URL */}
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Tracking URL
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="url"
                                            value={fulfillmentData.trackingUrl}
                                            onChange={(e) => setFulfillmentData({...fulfillmentData, trackingUrl: e.target.value})}
                                            className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
                                            placeholder="Enter tracking URL"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {order.fulfillment?.trackingUrl ? (
                                                <a
                                                    href={order.fulfillment.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#c3e5a5] hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    Track Package
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <p className="text-white">Not set</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Estimated Delivery */}
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Estimated Delivery
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="date"
                                            value={fulfillmentData.estimatedDelivery}
                                            onChange={(e) => setFulfillmentData({...fulfillmentData, estimatedDelivery: e.target.value})}
                                            className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
                                        />
                                    ) : (
                                        <p className="text-white">
                                            {order.fulfillment?.estimatedDelivery 
                                                ? formatDate(order.fulfillment.estimatedDelivery)
                                                : "Not set"
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Fulfillment Notes
                                    </label>
                                    {editMode ? (
                                        <textarea
                                            value={fulfillmentData.notes}
                                            onChange={(e) => setFulfillmentData({...fulfillmentData, notes: e.target.value})}
                                            rows={3}
                                            className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5]"
                                            placeholder="Add any special notes or instructions..."
                                        />
                                    ) : (
                                        <p className="text-white">{order.fulfillment?.notes || "No notes"}</p>
                                    )}
                                </div>
                            </div>

                            {/* Timestamps */}
                            {(order.fulfillment?.shippedAt || order.fulfillment?.deliveredAt) && (
                                <div className="mt-6 pt-6 border-t border-[#c3e5a5]/20">
                                    <h3 className="text-lg font-semibold text-[#c3e5a5] mb-4">Timeline</h3>
                                    <div className="space-y-2">
                                        {order.fulfillment.shippedAt && (
                                            <div className="flex items-center gap-2 text-orange-400">
                                                <Truck className="w-4 h-4" />
                                                <span>Shipped on {formatDate(order.fulfillment.shippedAt)}</span>
                                            </div>
                                        )}
                                        {order.fulfillment.deliveredAt && (
                                            <div className="flex items-center gap-2 text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Delivered on {formatDate(order.fulfillment.deliveredAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Customer Information */}
                        <motion.div
                            className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className="text-xl font-bold text-[#c3e5a5] mb-6">👤 Customer Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-[#c3e5a5]" />
                                    <div>
                                        <p className="text-white font-medium">{order.contactDetails.name}</p>
                                        <p className="text-gray-400 text-sm">Customer</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#c3e5a5]" />
                                    <div>
                                        <p className="text-white">{order.contactDetails.email}</p>
                                        <button
                                            onClick={() => copyToClipboard(order.contactDetails.email)}
                                            className="text-gray-400 text-sm hover:text-[#c3e5a5] transition-colors"
                                        >
                                            Click to copy
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-[#c3e5a5]" />
                                    <div>
                                        <p className="text-white">{order.contactDetails.phone}</p>
                                        <button
                                            onClick={() => copyToClipboard(order.contactDetails.phone)}
                                            className="text-gray-400 text-sm hover:text-[#c3e5a5] transition-colors"
                                        >
                                            Click to copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Shipping Address */}
                        <motion.div
                            className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="text-xl font-bold text-[#c3e5a5] mb-6">📍 Shipping Address</h3>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#c3e5a5] mt-1" />
                                <div>
                                    <p className="text-white mb-2">{formatAddress(order.shippingAddress)}</p>
                                    <span className="inline-block bg-[#24271b] text-[#c3e5a5] px-2 py-1 rounded text-sm">
                                        {order.shippingAddress.addressType}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(formatAddress(order.shippingAddress))}
                                        className="block text-gray-400 text-sm hover:text-[#c3e5a5] transition-colors mt-2"
                                    >
                                        Click to copy address
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <h3 className="text-xl font-bold text-[#c3e5a5] mb-6">📋 Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Order Number</span>
                                    <span className="text-white font-medium">{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Transaction ID</span>
                                    <span className="text-white font-medium">{order.txnId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Items</span>
                                    <span className="text-white font-medium">{order.items.length} item(s)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Order Date</span>
                                    <span className="text-white font-medium">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="pt-3 border-t border-[#c3e5a5]/20">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-[#c3e5a5]">Total Amount</span>
                                        <span className="text-lg font-bold text-white flex items-center">
                                            <IndianRupee className="w-5 h-5 mr-1" />
                                            {(order.amount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetails; 