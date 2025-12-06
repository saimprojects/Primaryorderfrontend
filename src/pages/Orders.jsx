import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import {
    FaShoppingBag, FaTruck, FaCheckCircle, FaClock,
    FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaUser,
    FaTag, FaChevronRight, FaBoxOpen, FaShoppingCart,
    FaHome, FaStar, FaExclamationCircle,
    FaPalette, FaRuler, FaBox, FaShippingFast // 🔥 NEW: Variant and shipping icons
} from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    // Format price in PKR
    const formatPrice = (price) => {
        if (!price) return "PKR 0";
        const numPrice = parseFloat(price);
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await api.get('/orders/');

                // Ensure we always have an array
                const data = Array.isArray(res.data?.results || res.data) 
                    ? (res.data?.results || res.data) 
                    : [];

                // 🔥 UPDATED: Sort orders by date (newest first)
                const sortedData = data.sort((a, b) => 
                    new Date(b.created_at || b.order_date) - new Date(a.created_at || a.order_date)
                );

                setOrders(sortedData);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                toast.error('Failed to load orders');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter orders based on status
    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'all') return true;
        return order.status?.toLowerCase() === activeFilter.toLowerCase();
    });

    // Get status color and icon
    const getStatusInfo = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return { 
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <FaClock className="text-yellow-600" />,
                    text: 'Pending',
                    progress: 25,
                    step: 1
                };
            case 'confirmed':
                return { 
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <FaCheckCircle className="text-blue-600" />,
                    text: 'Confirmed',
                    progress: 50,
                    step: 2
                };
            case 'shipped':
                return { 
                    color: 'bg-purple-100 text-purple-800 border-purple-200',
                    icon: <FaTruck className="text-purple-600" />,
                    text: 'Shipped',
                    progress: 75,
                    step: 3
                };
            case 'delivered':
                return { 
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <FaCheckCircle className="text-green-600" />,
                    text: 'Delivered',
                    progress: 100,
                    step: 4
                };
            case 'cancelled':
                return { 
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <FaExclamationCircle className="text-red-600" />,
                    text: 'Cancelled',
                    progress: 0,
                    step: 0
                };
            default:
                return { 
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <FaClock className="text-gray-600" />,
                    text: status || 'Processing',
                    progress: 10,
                    step: 1
                };
        }
    };

    // 🔥 NEW: Calculate shipping information
    const getShippingInfo = (order) => {
        const subtotal = order.total_amount - (order.shipping_fee || 0);
        const shippingFee = order.shipping_fee || 0;
        const isFreeShipping = shippingFee === 0;
        const freeShippingThreshold = 2000;
        
        return {
            subtotal,
            shippingFee,
            isFreeShipping,
            freeShippingThreshold
        };
    };

    // 🔥 NEW: Render order items with variants
    const renderOrderItems = (items) => {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return (
                <div className="text-gray-500 text-sm">No items found</div>
            );
        }

        return items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 py-3 border-b last:border-0">
                <img
                    src={item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                    alt={item.product?.title || 'Product'}
                    className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.product?.title || 'Unknown Product'}</div>
                    
                    {/* 🔥 NEW: Display variant information */}
                    {item.variant_attributes && (
                        <div className="flex flex-wrap gap-1 mt-1 mb-1">
                            {item.variant_attributes.size && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1">
                                    <FaRuler size={8} /> {item.variant_attributes.size}
                                </span>
                            )}
                            {item.variant_attributes.color && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded flex items-center gap-1">
                                    <FaPalette size={8} /> {item.variant_attributes.color}
                                </span>
                            )}
                            {item.variant_attributes.material && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                    {item.variant_attributes.material}
                                </span>
                            )}
                            {item.variant_attributes.sku && (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                    SKU: {item.variant_attributes.sku}
                                </span>
                            )}
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                        </div>
                        <div className="font-bold">
                            {formatPrice(item.price * item.quantity)}
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-gray-900 text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
                            <p className="text-gray-300">Track and manage all your purchases</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl text-[#FF5C00]">
                                <FaShoppingBag />
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="container mx-auto px-4 -mt-4 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-1 flex overflow-x-auto">
                    {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-3 rounded-lg font-medium capitalize whitespace-nowrap transition-all ${
                                activeFilter === filter
                                    ? 'bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white shadow'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            {filter === 'all' ? 'All Orders' : filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-9xl mb-6 text-gray-300">
                            <FaBoxOpen />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {activeFilter === 'all' ? 'No Orders Yet' : `No ${activeFilter} Orders`}
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {activeFilter === 'all' 
                                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                                : `You don't have any ${activeFilter} orders at the moment.`
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-[#E55100] hover:to-orange-600 transition-colors flex items-center justify-center gap-3"
                            >
                                <FaShoppingCart />
                                Start Shopping
                            </Link>
                            <Link
                                to="/"
                                className="bg-white border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                            >
                                <FaHome />
                                Go Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map(order => {
                            const statusInfo = getStatusInfo(order.status);
                            const orderDate = formatDate(order.created_at || order.order_date);
                            const shippingInfo = getShippingInfo(order);

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group border border-gray-100"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border ${statusInfo.color}`}>
                                                        {statusInfo.icon}
                                                        {statusInfo.text}
                                                    </div>
                                                    <div className="text-gray-500 text-sm flex items-center gap-2">
                                                        <FaCalendarAlt />
                                                        {orderDate}
                                                    </div>
                                                    <div className="text-gray-500 text-sm flex items-center gap-2">
                                                        <FaTag />
                                                        Order #{order.id}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {order.items?.length || 0} Items
                                                </h3>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-[#FF5C00] mb-2">
                                                    {formatPrice(order.total_amount)}
                                                </div>
                                                <div className="text-sm text-gray-500 mb-1">
                                                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {shippingInfo.isFreeShipping ? '🚚 Free Shipping' : `Shipping: ${formatPrice(shippingInfo.shippingFee)}`}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🔥 UPDATED: Order Items with Variants */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <FaBox /> Order Items
                                            </h4>
                                            <div className="max-h-60 overflow-y-auto pr-2">
                                                {renderOrderItems(order.items)}
                                            </div>
                                        </div>

                                        {/* Customer Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <FaUser /> Customer Details
                                                </h4>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Name:</span>
                                                        <span>{order.receiver_name || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone />
                                                        <span>{order.phone || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaMapMarkerAlt />
                                                        <span>{order.city || 'N/A'}, {order.province || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping Information */}
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <FaShippingFast /> Shipping Details
                                                </h4>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex justify-between">
                                                        <span>Subtotal:</span>
                                                        <span>{formatPrice(shippingInfo.subtotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Shipping:</span>
                                                        <span className={shippingInfo.isFreeShipping ? 'text-green-600 font-bold' : ''}>
                                                            {shippingInfo.isFreeShipping ? 'FREE' : formatPrice(shippingInfo.shippingFee)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between font-bold border-t pt-1 mt-1">
                                                        <span>Total:</span>
                                                        <span>{formatPrice(order.total_amount)}</span>
                                                    </div>
                                                    {shippingInfo.isFreeShipping && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            ✅ Free shipping applied on order over {formatPrice(shippingInfo.freeShippingThreshold)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🔥 UPDATED: Progress Bar */}
                                        <div className="mt-6">
                                            <div className="text-sm text-gray-600 mb-2">Order Progress</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                                        order.status === 'delivered' ? 'bg-green-500' :
                                                        order.status === 'shipped' ? 'bg-purple-500' :
                                                        order.status === 'confirmed' ? 'bg-blue-500' :
                                                        order.status === 'cancelled' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                    }`}
                                                    style={{ width: `${statusInfo.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                <span className={statusInfo.step >= 1 ? 'text-[#FF5C00] font-bold' : ''}>Ordered</span>
                                                <span className={statusInfo.step >= 2 ? 'text-[#FF5C00] font-bold' : ''}>Confirmed</span>
                                                <span className={statusInfo.step >= 3 ? 'text-[#FF5C00] font-bold' : ''}>Shipped</span>
                                                <span className={statusInfo.step >= 4 ? 'text-[#FF5C00] font-bold' : ''}>Delivered</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t">
                                            <div className="text-sm text-gray-600">
                                                Estimated Delivery: {order.estimated_delivery || '3-5 business days'}
                                            </div>
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="flex items-center gap-2 text-[#FF5C00] font-medium hover:text-orange-600 transition-colors"
                                            >
                                                <span>View Full Details</span>
                                                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Shopping Stats */}
                {orders.length > 0 && (
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Shopping Stats</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                                <div className="text-3xl font-bold text-[#FF5C00]">{orders.length}</div>
                                <div className="text-gray-600">Total Orders</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                                <div className="text-3xl font-bold text-green-600">
                                    {orders.filter(o => o.status === 'delivered').length}
                                </div>
                                <div className="text-gray-600">Delivered</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                                <div className="text-3xl font-bold text-blue-600">
                                    PKR {orders.reduce((acc, order) => acc + parseFloat(order.total_amount || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-gray-600">Total Spent</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                                <div className="text-3xl font-bold text-purple-600">
                                    {orders.reduce((acc, order) => acc + (order.items?.length || 0), 0)}
                                </div>
                                <div className="text-gray-600">Items Purchased</div>
                            </div>
                        </div>
                        
                        {/* 🔥 NEW: Shipping Stats */}
                        <div className="mt-6 bg-white p-6 rounded-xl">
                            <h3 className="font-bold text-gray-700 mb-4">Shipping Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {orders.filter(o => (o.shipping_fee || 0) === 0).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Free Shipping Orders</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#FF5C00]">
                                        PKR {orders.reduce((acc, order) => acc + (order.shipping_fee || 0), 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Shipping Saved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FOMO Banner */}
                {orders.length > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <FaExclamationCircle className="text-xl" />
                                <span className="font-bold">EXCLUSIVE OFFER</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Get 15% OFF Your Next Order!</h3>
                            <p className="mb-6 opacity-90">
                                Thank you for shopping with us! Use code <span className="font-bold">LOYAL15</span> on your next purchase.
                            </p>
                            <Link
                                to="/products"
                                className="inline-block bg-white text-[#FF5C00] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;