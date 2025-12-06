import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import {
    FaShoppingBag, FaTruck, FaCheckCircle, FaClock,
    FaMapMarkerAlt, FaPhone, FaWhatsapp, FaCreditCard,
    FaBoxOpen, FaArrowLeft, FaExclamationCircle, FaStar,
    FaRedo, FaTimesCircle, FaCalendarAlt, FaReceipt,
    FaUser, FaTag, FaChevronRight, FaShippingFast,
    FaRegCheckCircle, FaMoneyBillWave, FaFileInvoice
} from 'react-icons/fa';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trackingSteps, setTrackingSteps] = useState([]);

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
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/orders/${id}/`);
                setOrder(res.data);

                // Generate tracking steps based on order status
                generateTrackingSteps(res.data.status);

            } catch (error) {
                console.error('Failed to fetch order details:', error);
                toast.error('Order not found');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetail();
        }
    }, [id, navigate]);

    const generateTrackingSteps = (status) => {
        const allSteps = [
            { 
                id: 1, 
                status: 'ordered', 
                title: 'Order Placed', 
                description: 'Your order has been received',
                icon: <FaShoppingBag />,
                color: 'bg-blue-500'
            },
            { 
                id: 2, 
                status: 'confirmed', 
                title: 'Order Confirmed', 
                description: 'We are processing your order',
                icon: <FaRegCheckCircle />,
                color: 'bg-blue-500'
            },
            { 
                id: 3, 
                status: 'shipped', 
                title: 'Shipped', 
                description: 'Your order is on the way',
                icon: <FaTruck />,
                color: 'bg-purple-500'
            },
            { 
                id: 4, 
                status: 'delivered', 
                title: 'Delivered', 
                description: 'Order delivered successfully',
                icon: <FaCheckCircle />,
                color: 'bg-green-500'
            }
        ];

        const currentStatusIndex = allSteps.findIndex(step => 
            step.status === status?.toLowerCase()
        );

        const steps = allSteps.map((step, index) => {
            let stepStatus = 'pending';
            
            if (index < currentStatusIndex) {
                stepStatus = 'completed';
            } else if (index === currentStatusIndex) {
                stepStatus = 'current';
            }

            return {
                ...step,
                stepStatus,
                date: index <= currentStatusIndex ? formatDate(order?.created_at) : 'Pending'
            };
        });

        setTrackingSteps(steps);
    };

    const getStatusInfo = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return { 
                    color: 'bg-yellow-100 text-yellow-800', 
                    icon: <FaClock className="text-yellow-600" />,
                    text: 'Pending',
                    description: 'Your order is being processed'
                };
            case 'confirmed':
                return { 
                    color: 'bg-blue-100 text-blue-800', 
                    icon: <FaRegCheckCircle className="text-blue-600" />,
                    text: 'Confirmed',
                    description: 'Order has been confirmed'
                };
            case 'shipped':
                return { 
                    color: 'bg-purple-100 text-purple-800', 
                    icon: <FaTruck className="text-purple-600" />,
                    text: 'Shipped',
                    description: 'Your order is on the way'
                };
            case 'delivered':
                return { 
                    color: 'bg-green-100 text-green-800', 
                    icon: <FaCheckCircle className="text-green-600" />,
                    text: 'Delivered',
                    description: 'Order has been delivered'
                };
            case 'cancelled':
                return { 
                    color: 'bg-red-100 text-red-800', 
                    icon: <FaTimesCircle className="text-red-600" />,
                    text: 'Cancelled',
                    description: 'Order has been cancelled'
                };
            default:
                return { 
                    color: 'bg-gray-100 text-gray-800', 
                    icon: <FaClock className="text-gray-600" />,
                    text: status || 'Processing',
                    description: 'Your order is being processed'
                };
        }
    };

    const handleReorder = () => {
        toast.success('All items added to cart for reorder!');
        // In real app: Add all items to cart
        navigate('/cart');
    };

    const handleDownloadInvoice = () => {
        toast.info('Invoice download feature coming soon!');
        // In real app: Generate and download invoice PDF
    };

    const handleCancelOrder = () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            toast.info('Order cancellation request submitted!');
            // In real app: Call cancel order API
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                    <div className="text-9xl mb-6 text-gray-300">😕</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/orders')}
                            className="block w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-[#E55100] hover:to-orange-600 transition-colors"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-gray-900 text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/orders')}
                                className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
                            >
                                <FaArrowLeft />
                                Back to Orders
                            </button>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order #{order.id}</h1>
                            <p className="text-gray-300">Track your order and view details</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Tracking */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FaShippingFast className="text-2xl text-[#FF5C00]" />
                                <h2 className="text-2xl font-bold text-gray-800">Order Tracking</h2>
                            </div>

                            <div className="relative">
                                {/* Timeline */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                
                                {trackingSteps.map((step, index) => (
                                    <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                                        <div className={`z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl ${
                                            step.stepStatus === 'completed' ? step.color :
                                            step.stepStatus === 'current' ? 'bg-[#FF5C00] animate-pulse' :
                                            'bg-gray-300'
                                        }`}>
                                            {step.icon}
                                        </div>
                                        <div className="ml-6 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`text-lg font-bold ${
                                                        step.stepStatus === 'current' ? 'text-[#FF5C00]' : 'text-gray-800'
                                                    }`}>
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-gray-600">{step.description}</p>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {step.date}
                                                </div>
                                            </div>
                                            {step.stepStatus === 'current' && (
                                                <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                                    <div className="flex items-center gap-2 text-orange-700">
                                                        <FaExclamationCircle />
                                                        <span className="font-medium">{statusInfo.description}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Estimated Delivery */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-600 text-sm">Estimated Delivery</div>
                                        <div className="text-xl font-bold text-gray-800">
                                            {order.status === 'delivered' 
                                                ? 'Delivered on ' + formatDate(order.updated_at)
                                                : 'Within 5-7 business days'
                                            }
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-600 text-sm">Tracking ID</div>
                                        <div className="text-xl font-bold text-gray-800">
                                            #{order.tracking_id || 'TRK' + order.id.toString().padStart(8, '0')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FaShoppingBag className="text-2xl text-[#FF5C00]" />
                                <h2 className="text-2xl font-bold text-gray-800">Order Items</h2>
                            </div>

                            <div className="space-y-6">
                                {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                                    <div key={item.id || index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                                alt={item.product?.title}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-1">{item.product?.title || 'Unknown Product'}</h4>
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Quantity: {item.quantity || 1}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Price: {formatPrice(item.price)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg mb-2">{formatPrice((item.price || 0) * (item.quantity || 1))}</div>
                                            {order.status === 'delivered' && (
                                                <button className="text-sm text-[#FF5C00] hover:text-[#E55100] transition-colors flex items-center gap-1">
                                                    <FaStar />
                                                    Rate Product
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FaMapMarkerAlt className="text-2xl text-[#FF5C00]" />
                                <h2 className="text-2xl font-bold text-gray-800">Delivery Address</h2>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FaUser className="text-gray-400" />
                                        <div>
                                            <div className="font-bold text-gray-800">{order.receiver_name}</div>
                                            <div className="text-sm text-gray-600">Receiver</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaPhone className="text-gray-400" />
                                        <div>
                                            <div className="font-bold text-gray-800">{order.phone}</div>
                                            <div className="text-sm text-gray-600">Phone</div>
                                        </div>
                                    </div>
                                    {order.whatsapp && (
                                        <div className="flex items-center gap-3">
                                            <FaWhatsapp className="text-green-500" />
                                            <div>
                                                <div className="font-bold text-gray-800">{order.whatsapp}</div>
                                                <div className="text-sm text-gray-600">WhatsApp</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <div>
                                            <div className="font-bold text-gray-800">
                                                {order.address1}, {order.address2 || ''}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {order.city}, {order.province}, {order.country}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary & Actions */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">{formatPrice(order.subtotal || order.total_amount)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-bold text-green-600">
                                            {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-bold">{formatPrice(order.tax || 0)}</span>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-2xl text-[#FF5C00]">{formatPrice(order.total_amount)}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Paid via {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Actions */}
                            {/* <div className="space-y-3 mt-6">
                                

                                {order.status === 'delivered' && (
                                    <button
                                        onClick={handleDownloadInvoice}
                                        className="w-full border-2 border-green-300 text-green-600 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-3"
                                    >
                                        <FaFileInvoice />
                                        Download Invoice
                                    </button>
                                )}
                            </div> */}

                            {/* Order Info */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Order Date:</span>
                                        <span className="font-medium">{formatDate(order.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Order ID:</span>
                                        <span className="font-medium">#{order.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Payment Method:</span>
                                        <span className="font-medium">
                                            {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                        </span>
                                    </div>
                                    {order.tracking_id && (
                                        <div className="flex justify-between">
                                            <span>Tracking ID:</span>
                                            <span className="font-medium">#{order.tracking_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaPhone className="text-gray-400" />
                                    <span>Call us: 03131471263</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaWhatsapp className="text-green-500" />
                                    <span>WhatsApp: +92 313 1471263</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-4">
                                    24/7 Customer Support • 100% Secure
                                </div>
                            </div>
                        </div>

                        {/* FOMO Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <FaTag className="text-xl" />
                                <div className="font-bold">EXCLUSIVE OFFER</div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Get 15% OFF!</h3>
                         
                            <Link
                                to="/products"
                                className="block w-full bg-white text-[#FF5C00] px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center text-sm"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;