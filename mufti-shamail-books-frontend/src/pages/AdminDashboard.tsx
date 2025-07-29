import { motion } from "framer-motion";
import { 
    Copy, 
    IndianRupee, 
    Eye, 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    Search,
    Filter,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../apis/orders.api";
import { toast } from "react-hot-toast";

interface OrderStats {
	totalOrders: number;
	totalRevenue: number;
	ordersByStatus: {
		[key: string]: number;
	};
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface Order {
	_id: string;
	user: {
		_id: string;
		name: string;
		email: string;
	};
	orderNumber: string;
	txnId: string;
	items: {
		_id: string;
		name: string;
		description: string;
		author: string;
		price: number;
		images: string[];
		quantity: number;
	}[];
	contactDetails: {
		phone: string;
		email: string;
		name: string;
	};
	shippingAddress: {
		addressLine1: string;
		addressLine2: string;
		landmark: string;
		city: string;
		state: string;
		pincode: string;
		isDefault: boolean;
		addressType: string;
		_id: string;
	};
	status: string;
    amount: number;
    fulfillment?: {
        trackingNumber?: string;
        shippingProvider?: string;
        trackingUrl?: string;
        shippedAt?: string;
        deliveredAt?: string;
        estimatedDelivery?: string;
        notes?: string;
    };
	createdAt: string;
	updatedAt: string;
}

const AdminDashboard = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [stats, setStats] = useState<OrderStats>({
		totalOrders: 0,
		totalRevenue: 0,
		ordersByStatus: {},
	});
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
	const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

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
        cancelled: Copy,
    };

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
	};

    const fetchOrders = async (page: number = 1, status?: string) => {
        setLoading(true);
			try {
            const filters = status && status !== "all" ? { status } : undefined;
            const response = await getAdminOrders(page, filters);
				setOrders(response.data.orders);
            if (response.data.stats) {
				setStats(response.data.stats);
            }
            setPagination(response.data.pagination);
			} catch (error) {
				console.error("Failed to fetch orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1, statusFilter);
    }, [statusFilter]);

	if (isAuthenticated) {
		if (user?.role !== "admin") {
			return <Navigate to="/dashboard" replace />;
		}
	} else return <Navigate to="/login" replace />;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

    const handlePageChange = (page: number) => {
        fetchOrders(page, statusFilter);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const viewOrderDetails = (orderId: string) => {
        navigate(`/admin/orders/${orderId}`);
	};

	const filteredOrders = orders.filter((order) => {
        if (!searchTerm) return true;
        return (
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.contactDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.contactDetails.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
	});

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-[#c3e5a5] mb-2">
                        📦 Order Management
							</h1>
                    <p className="text-gray-400 text-lg">
                        Manage orders, track shipments, and fulfill customer requests
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                                <p className="text-3xl font-bold text-white">{stats.totalOrders || 0}</p>
                            </div>
                            <Package className="w-8 h-8 text-[#c3e5a5]" />
                        </div>
						</div>

                    <div className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold text-white flex items-center">
                                    <IndianRupee className="w-6 h-6 mr-1" />
                                    {(stats.totalRevenue || 0).toLocaleString()}
                                </p>
                            </div>
                            <IndianRupee className="w-8 h-8 text-[#c3e5a5]" />
                        </div>
							</div>

                    <div className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Pending Orders</p>
                                <p className="text-3xl font-bold text-yellow-400">
                                    {stats.ordersByStatus?.pending || 0}
								</p>
							</div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>

                    <div className="bg-[#191b14] rounded-xl p-6 border border-[#c3e5a5]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Delivered</p>
                                <p className="text-3xl font-bold text-green-400">
                                    {stats.ordersByStatus?.delivered || 0}
                                </p>
									</div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
							</div>
						</div>
                </motion.div>

                {/* Filters and Search */}
					<motion.div
                    className="bg-[#191b14] rounded-xl p-6 mb-8 border border-[#c3e5a5]/20"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:flex-none lg:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search orders, customers..."
                                    className="w-full bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
												</div>
											</div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
												<select
                                    value={statusFilter}
                                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                                    className="bg-[#24271b] border border-[#c3e5a5]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] focus:border-transparent"
                                >
                                    <option value="all">All Orders</option>
													<option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
													<option value="shipped">Shipped</option>
													<option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
												</select>
											</div>
                        </div>
                    </div>
                </motion.div>

                {/* Orders Table */}
                <motion.div
                    className="bg-[#191b14] rounded-xl border border-[#c3e5a5]/20 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c3e5a5]"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No orders found</p>
											</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#24271b] border-b border-[#c3e5a5]/20">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-[#c3e5a5] font-semibold">Order</th>
                                        <th className="text-left py-4 px-6 text-[#c3e5a5] font-semibold">Customer</th>
                                        <th className="text-left py-4 px-6 text-[#c3e5a5] font-semibold">Amount</th>
                                        <th className="text-left py-4 px-6 text-[#c3e5a5] font-semibold">Status</th>
                                        <th className="text-left py-4 px-6 text-[#c3e5a5] font-semibold">Date</th>
                                        <th className="text-center py-4 px-6 text-[#c3e5a5] font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#c3e5a5]/10">
                                    {filteredOrders.map((order, index) => {
                                        const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                                        return (
                                            <motion.tr
                                                key={order._id}
                                                className="hover:bg-[#24271b]/50 transition-colors"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="text-white font-medium">{order.orderNumber}</p>
                                                        <p className="text-gray-400 text-sm">{order.items.length} item(s)</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
															<div>
                                                        <p className="text-white font-medium">{order.contactDetails.name}</p>
                                                        <p className="text-gray-400 text-sm">{order.contactDetails.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center text-white font-semibold">
                                                        <IndianRupee className="w-4 h-4 mr-1" />
                                                        {(order.amount || 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                                                        {StatusIcon && <StatusIcon className="w-4 h-4" />}
                                                        <span className="capitalize">{order.status}</span>
															</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-gray-400">
                                                        {formatDate(order.createdAt)}
															</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => viewOrderDetails(order._id)}
                                                            className="bg-[#c3e5a5] text-[#191b14] p-2 rounded-lg hover:bg-[#b3d595] transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => copyToClipboard(order.orderNumber)}
                                                            className="bg-[#24271b] text-white p-2 rounded-lg hover:bg-[#2a2f1f] transition-colors border border-[#c3e5a5]/30"
                                                            title="Copy Order Number"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
														</div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
												</div>
                    )}

                    {/* Pagination */}
                    {!loading && filteredOrders.length > 0 && (
                        <div className="bg-[#24271b] px-6 py-4 border-t border-[#c3e5a5]/20">
                            <div className="flex items-center justify-between">
                                <div className="text-gray-400 text-sm">
                                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} orders
											</div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#191b14] text-white rounded-lg border border-[#c3e5a5]/30 hover:bg-[#24271b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                                        page === pagination.currentPage
                                                            ? 'bg-[#c3e5a5] text-[#191b14] font-semibold'
                                                            : 'bg-[#191b14] text-white border border-[#c3e5a5]/30 hover:bg-[#24271b]'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
										</div>
                                    
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#191b14] text-white rounded-lg border border-[#c3e5a5]/30 hover:bg-[#24271b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
								</div>
							</div>
						</div>
                    )}
					</motion.div>
			</div>
		</main>
	);
};

export default AdminDashboard;
