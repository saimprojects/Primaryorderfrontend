import { useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    FaUser, FaPhone, FaWhatsapp, FaMapMarkerAlt, 
    FaCity, FaCreditCard, FaTruck, FaShieldAlt, 
    FaClock, FaFire, FaCheckCircle, FaLock,
    FaArrowLeft, FaMoneyBillWave, FaRegCreditCard,
    FaExclamationTriangle, FaTag, FaPercent,
    FaChevronRight, FaPalette, FaRuler, FaBox // 🔥 NEW: Variant icons
} from 'react-icons/fa';

const Checkout = () => {
    const { cart, clearCart, loading: cartLoading } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        receiver_name: '',
        phone: '',
        whatsapp: '',
        sameAsPhone: true,
        payment_method: 'COD',
        country: 'Pakistan',
        province: '',
        city: '',
        address1: '',
        address2: '',
    });

    const [loading, setLoading] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [countdown, setCountdown] = useState(1800); // 30 minutes in seconds

    // Format price in PKR
    const formatPrice = (price) => {
        if (!price && price !== 0) return "PKR 0";
        const numPrice = parseFloat(price);
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    // Pakistan Provinces
    const provinces = [
        'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
        'Gilgit-Baltistan', 'Azad Jammu and Kashmir', 'Islamabad Capital Territory'
    ];

    // Auto-fill WhatsApp if checkbox is checked
    useEffect(() => {
        if (formData.sameAsPhone) {
            setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
        }
    }, [formData.sameAsPhone, formData.phone]);

    // 🔥 FIXED: Calculate order summary with variant prices and 200 PKR shipping
    useEffect(() => {
        console.log('Checkout Cart Data:', cart); // 🔍 Debug
        
        if (Array.isArray(cart) && cart.length > 0) {
            const subtotal = cart.reduce((acc, item) => {
                console.log('Processing cart item:', item); // 🔍 Debug
                
                let price = 0;
                
                // 🔥 FIXED: Check price from multiple possible sources
                if (item.selectedVariant) {
                    // Check variant price from multiple possible keys
                    price = item.selectedVariant.discount_price || 
                            item.selectedVariant.price || 
                            item.selectedVariant.sale_price || 
                            item.selectedVariant.original_price ||
                            0;
                    console.log('Variant price found:', price); // 🔍 Debug
                } else if (item.product) {
                    // Check product price from multiple possible keys
                    price = item.product.discount_price || 
                            item.product.price || 
                            item.product.base_price || 
                            item.product.sale_price || 
                            item.product.original_price ||
                            0;
                    console.log('Product price found:', price); // 🔍 Debug
                }
                
                const numericPrice = parseFloat(price) || 0;
                const quantity = parseInt(item.quantity) || 0;
                
                console.log('Item calculation:', numericPrice, '*', quantity, '=', numericPrice * quantity); // 🔍 Debug
                
                return acc + (numericPrice * quantity);
            }, 0);
            
            console.log('Total Subtotal:', subtotal); // 🔍 Debug
            
            // 🔥 UPDATED: 200 PKR shipping, free over 2000
            const freeShippingThreshold = 2000;
            const shippingFee = 200;
            const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
            const total = subtotal + shipping;
            const itemsCount = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);

            console.log('Order Summary:', { subtotal, shipping, total, itemsCount }); // 🔍 Debug

            setOrderSummary({
                subtotal,
                shipping,
                total,
                itemsCount,
                discount: 0,
                freeShippingThreshold,
                freeShippingEligible: subtotal >= freeShippingThreshold,
                shippingFee
            });
        } else {
            console.log('Cart is empty or not an array'); // 🔍 Debug
        }
    }, [cart]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Auto-fill user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                receiver_name: user.name || '',
                phone: user.phone || '',
                whatsapp: user.phone || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProvinceChange = (e) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setFormData(prev => ({ ...prev, province }));
    };

    // 🔥 FIXED: Handle order submission with variant data
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }

        setLoading(true);
        try {
            // 🔥 FIXED: Calculate price for each item
            const cart_items = cart.map(item => {
                let price = 0;
                
                if (item.selectedVariant) {
                    price = item.selectedVariant.discount_price || 
                            item.selectedVariant.price || 
                            item.selectedVariant.sale_price || 
                            item.selectedVariant.original_price ||
                            0;
                } else if (item.product) {
                    price = item.product.discount_price || 
                            item.product.price || 
                            item.product.base_price || 
                            item.product.sale_price || 
                            item.product.original_price ||
                            0;
                }
                
                return {
                    product: item.product?.id,
                    quantity: item.quantity,
                    price: parseFloat(price) || 0,
                    variant_id: item.selectedVariant?.id,
                    variant_attributes: item.selectedVariant ? {
                        size: item.selectedVariant.size,
                        color: item.selectedVariant.color,
                        material: item.selectedVariant.material,
                        sku: item.selectedVariant.sku
                    } : null
                };
            });

            const orderData = {
                receiver_name: formData.receiver_name,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                payment_method: formData.payment_method,
                country: formData.country,
                province: formData.province,
                city: formData.city,
                address1: formData.address1,
                address2: formData.address2 || '',
                total_amount: orderSummary?.total || 0,
                shipping_fee: orderSummary?.shipping || 0,
                cart_items: cart_items
            };

            console.log('Submitting order data:', orderData); // 🔍 Debug

            const response = await api.post('/orders/create/', orderData);
            
            toast.success(
                <div>
                    <div className="font-bold">🎉 Order Placed Successfully!</div>
                    <div className="text-sm">Order ID: #{response.data.order_id || response.data.id || 'ORD-' + Date.now()}</div>
                    {orderSummary?.shipping === 0 && (
                        <div className="text-sm text-green-600">✅ Free shipping applied!</div>
                    )}
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                }
            );

            clearCart();
            
            // Redirect to order confirmation
            setTimeout(() => {
                navigate(`/orders/${response.data.id || response.data.order_id}`);
            }, 2000);

        } catch (err) {
            console.error('Order placement error:', err);
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               'Failed to place order. Please try again.';
            
            toast.error(
                <div>
                    <div className="font-bold">Order Failed</div>
                    <div className="text-sm">{errorMessage}</div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                }
            );
        } finally {
            setLoading(false);
        }
    };

    // 🔥 FIXED: Get price for display in cart items preview
    const getItemPrice = (item) => {
        let price = 0;
        
        if (item.selectedVariant) {
            price = item.selectedVariant.discount_price || 
                    item.selectedVariant.price || 
                    item.selectedVariant.sale_price || 
                    item.selectedVariant.original_price ||
                    0;
        } else if (item.product) {
            price = item.product.discount_price || 
                    item.product.price || 
                    item.product.base_price || 
                    item.product.sale_price || 
                    item.product.original_price ||
                    0;
        }
        
        return parseFloat(price) || 0;
    };

    // 🔥 FIXED: Get item total for display
    const getItemTotal = (item) => {
        const price = getItemPrice(item);
        const quantity = parseInt(item.quantity) || 0;
        return price * quantity;
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-4 text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                    <div className="text-9xl mb-6 text-gray-300">🛒</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Add some products to your cart before checkout.</p>
                    <Link 
                        to="/products" 
                        className="block bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-[#E55100] hover:to-orange-600 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                    <div className="text-6xl mb-6 text-gray-300">🔒</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h1>
                    <p className="text-gray-600 mb-8">Please login to proceed with checkout.</p>
                    <div className="space-y-3">
                        <Link 
                            to="/login" 
                            state={{ from: '/checkout' }}
                            className="block bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-[#E55100] hover:to-orange-600 transition-colors"
                        >
                            Login Now
                        </Link>
                        <Link 
                            to="/register" 
                            className="block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-gray-900 text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
                            <p className="text-gray-300">Complete your purchase in a few simple steps</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Order reserved for</div>
                            <div className="font-bold text-lg">{user.name || user.email}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Countdown Banner */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3 text-sm md:text-base">
                        <FaClock className="animate-pulse" />
                        <span className="font-bold">ORDER RESERVATION TIMER:</span>
                        <span className="font-mono font-bold bg-black/30 px-3 py-1 rounded-lg">
                            {formatTime(countdown)}
                        </span>
                        <span className="text-sm">Complete checkout before timer ends!</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Delivery & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Back to Cart */}
                        <div className="flex items-center justify-between">
                            <Link 
                                to="/cart" 
                                className="flex items-center gap-2 text-gray-600 hover:text-[#FF5C00] transition-colors"
                            >
                                <FaArrowLeft />
                                Back to Cart
                            </Link>
                            <div className="text-sm text-gray-500">
                                Step 2 of 3 • Checkout
                            </div>
                        </div>

                        {/* Cart Items Preview */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaBox /> Order Items ({cart.length})
                            </h3>
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                {cart.map((item, index) => {
                                    const product = item.product || {};
                                    const selectedVariant = item.selectedVariant;
                                    const price = getItemPrice(item);
                                    const quantity = parseInt(item.quantity) || 0;
                                    const itemTotal = getItemTotal(item);

                                    console.log(`Item ${index}: Price=${price}, Qty=${quantity}, Total=${itemTotal}`); // 🔍 Debug

                                    return (
                                        <div key={item.id || product.id || index} 
                                             className="flex items-center gap-4 p-3 border-b last:border-0">
                                            <img
                                                src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                                alt={product.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800">{product.title}</div>
                                                {selectedVariant && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {selectedVariant.size && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                <FaRuler className="inline mr-1" size={8} /> {selectedVariant.size}
                                                            </span>
                                                        )}
                                                        {selectedVariant.color && (
                                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                                                <FaPalette className="inline mr-1" size={8} /> {selectedVariant.color}
                                                            </span>
                                                        )}
                                                        {selectedVariant.material && (
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                                {selectedVariant.material}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Qty: {quantity} × {formatPrice(price)}
                                                </div>
                                            </div>
                                            <div className="font-bold text-gray-800">
                                                {formatPrice(itemTotal)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#FF5C00] text-white p-2 rounded-lg">
                                    <FaTruck className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Delivery Information</h2>
                                    <p className="text-gray-600">Where should we deliver your order?</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Receiver Name */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">
                                        Receiver's Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaUser />
                                        </div>
                                        <input
                                            type="text"
                                            name="receiver_name"
                                            value={formData.receiver_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter receiver's full name"
                                            className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FaPhone />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="03XX-XXXXXXX"
                                                className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-gray-700 font-medium">
                                                WhatsApp Number
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="sameAsPhone"
                                                    checked={formData.sameAsPhone}
                                                    onChange={handleChange}
                                                    className="rounded border-gray-300 text-[#FF5C00] focus:ring-[#FF5C00]"
                                                />
                                                <label className="text-sm text-gray-600">Same as phone</label>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FaWhatsapp className="text-green-500" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="whatsapp"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                required
                                                placeholder="03XX-XXXXXXX"
                                                disabled={formData.sameAsPhone}
                                                className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Country */}
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300 bg-gray-50"
                                            readOnly
                                        />
                                    </div>

                                    {/* Province */}
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Province
                                        </label>
                                        <select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleProvinceChange}
                                            required
                                            className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                        >
                                            <option value="">Select Province</option>
                                            {provinces.map(province => (
                                                <option key={province} value={province}>
                                                    {province}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            City
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FaCity />
                                            </div>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter city"
                                                className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Lines */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Complete Address (Street, House #, Area)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-4 text-gray-400">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <textarea
                                                name="address1"
                                                value={formData.address1}
                                                onChange={handleChange}
                                                required
                                                placeholder="House #, Street, Sector, Area"
                                                rows="3"
                                                className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-gray-700 font-medium">
                                            Additional Instructions (Optional)
                                        </label>
                                        <textarea
                                            name="address2"
                                            value={formData.address2}
                                            onChange={handleChange}
                                            placeholder="Landmark, delivery instructions, etc."
                                            rows="2"
                                            className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="pt-6 border-t">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-[#FF5C00] text-white p-2 rounded-lg">
                                            <FaCreditCard className="text-xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                                            <p className="text-gray-600">How would you like to pay?</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                            formData.payment_method === 'COD' 
                                                ? 'border-[#FF5C00] bg-orange-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="COD"
                                                    checked={formData.payment_method === 'COD'}
                                                    onChange={handleChange}
                                                    className="text-[#FF5C00] focus:ring-[#FF5C00]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-green-600" />
                                                        <span className="font-bold">Cash on Delivery</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Pay when you receive your order
                                                    </div>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                            formData.payment_method === 'ONLINE' 
                                                ? 'border-[#FF5C00] bg-orange-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="ONLINE"
                                                    checked={formData.payment_method === 'ONLINE'}
                                                    onChange={handleChange}
                                                    className="text-[#FF5C00] focus:ring-[#FF5C00]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <FaRegCreditCard className="text-blue-600" />
                                                        <span className="font-bold">Online Payment</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Credit/Debit Card, JazzCash, EasyPaisa
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {formData.payment_method === 'ONLINE' && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div className="text-sm text-blue-800">
                                                <FaExclamationTriangle className="inline mr-2" />
                                                You will be redirected to secure payment gateway after order confirmation
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <FaLock className="text-green-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">Secure Payment</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <FaShieldAlt className="text-blue-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">SSL Encrypted</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <FaTruck className="text-orange-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">2-5 Day Delivery</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <FaCheckCircle className="text-purple-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">Quality Guarantee</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                            
                            {orderSummary ? (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal ({orderSummary.itemsCount} items)</span>
                                            <span className="font-bold">{formatPrice(orderSummary.subtotal)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className={`font-bold ${orderSummary.shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                                {orderSummary.shipping === 0 ? 'FREE' : formatPrice(orderSummary.shipping)}
                                                {orderSummary.shipping > 0 && (
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        (Standard fee: {formatPrice(orderSummary.shippingFee)})
                                                    </span>
                                                )}
                                            </span>
                                        </div>

                                        {/* Shipping Progress */}
                                        {!orderSummary.freeShippingEligible && (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Add {formatPrice(orderSummary.freeShippingThreshold - orderSummary.subtotal)} more for <span className="text-green-600 font-bold">free shipping!</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                                    <div 
                                                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500" 
                                                        style={{ 
                                                            width: `${(orderSummary.subtotal / orderSummary.freeShippingThreshold) * 100}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Free shipping on orders over {formatPrice(orderSummary.freeShippingThreshold)}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-4">
                                            <input
                                                type="text"
                                                placeholder="Discount code"
                                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                                            />
                                            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-2xl text-[#FF5C00]">{formatPrice(orderSummary.total)}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Including all applicable taxes
                                        </div>
                                        {orderSummary.shipping === 0 && (
                                            <div className="text-sm text-green-600 mt-1 font-medium">
                                                ✅ Free shipping applied
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Calculating order summary...
                                </div>
                            )}

                            {/* Shipping Policy Summary */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-gray-700 mb-2">📦 Shipping Policy</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Standard shipping fee: {formatPrice(200)}</li>
                                    <li>• Free shipping on orders over {formatPrice(2000)}</li>
                                    <li>• 2-5 business days delivery</li>
                                    <li>• Cash on Delivery available</li>
                                </ul>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !orderSummary}
                                className={`w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mt-6 ${
                                    (loading || !orderSummary) && 'opacity-70 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Processing Order...
                                    </>
                                ) : !orderSummary ? (
                                    'Calculating...'
                                ) : (
                                    <>
                                        Place Order
                                        <FaChevronRight />
                                    </>
                                )}
                            </button>

                            <div className="text-center text-xs text-gray-500 mt-4">
                                <FaLock className="inline mr-1" />
                                Your payment is secure and encrypted
                            </div>
                        </div>

                        {/* FOMO Banner */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-2xl">
                            <div className="flex items-start gap-3">
                                <FaFire className="text-red-600 text-xl mt-1" />
                                <div>
                                    <div className="font-bold text-gray-800 mb-2">🔥 Hurry! Limited Time Offer</div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        Complete your order in next {formatTime(countdown)} to get exclusive gifts!
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaTag className="text-green-600" />
                                        <span>89 orders placed in last hour</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaPhone className="text-gray-400" />
                                    <span>Call us: 0800-12345</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaWhatsapp className="text-green-500" />
                                    <span>WhatsApp: +92 300 1234567</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-4">
                                    24/7 Customer Support • 100% Secure Checkout
                                </div>
                            </div>
                        </div>

                        {/* Security Guarantee */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <FaShieldAlt className="text-2xl" />
                                <div className="font-bold">100% SECURE CHECKOUT</div>
                            </div>
                            <p className="text-sm opacity-90">
                                Your personal and payment information is encrypted and secure. We never store your credit card details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;