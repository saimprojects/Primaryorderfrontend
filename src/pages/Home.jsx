import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { 
    FaFire, FaGift, FaShieldAlt, FaShippingFast, 
    FaArrowRight, FaTrophy, FaPercent, FaCrown,
    FaClock, FaUsers, FaEye, FaTag, FaStar,
    FaShoppingCart, FaBolt, FaUserFriends
} from 'react-icons/fa';
import CountdownTimer from '../components/CountdownTimer';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('trending');
    const [viewedProducts, setViewedProducts] = useState([]);
    const [liveStats, setLiveStats] = useState({
        activeUsers: 0,
        recentOrders: 0,
        itemsSold: 0
    });
    
    const saleEndTimeRef = useRef(new Date(Date.now() + 24 * 60 * 60 * 1000));

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

    // Calculate discount percentage
    const calculateDiscount = (product) => {
        const price = parseFloat(product.price || 0);
        const discountPrice = parseFloat(product.discount_price || 0);
        
        if (discountPrice > 0 && price > 0) {
            const discountPercentage = Math.round(((price - discountPrice) / price) * 100);
            return {
                percentage: discountPercentage,
                originalPrice: price,
                discountedPrice: discountPrice,
                savings: price - discountPrice
            };
        }
        return null;
    };

    // Fetch all data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories from backend
                const categoriesRes = await api.get('/products/categories/');
                let categoriesData = [];
                
                // Handle different response formats
                if (categoriesRes.data?.results) {
                    categoriesData = categoriesRes.data.results;
                } else if (Array.isArray(categoriesRes.data)) {
                    categoriesData = categoriesRes.data;
                }
                
                setCategories(categoriesData.slice(0, 8));
                
                // Fetch products from backend
                const productsRes = await api.get('/products/');
                let productsData = [];
                
                if (productsRes.data?.results) {
                    productsData = productsRes.data.results;
                } else if (Array.isArray(productsRes.data)) {
                    productsData = productsRes.data;
                }
                
                // Set all products
                setProducts(productsData);
                
                // Create featured products (products with highest rating or most reviews)
                const sortedForFeatured = [...productsData].sort((a, b) => {
                    const ratingA = a.average_rating || 0;
                    const ratingB = b.average_rating || 0;
                    const reviewCountA = a.review_count || 0;
                    const reviewCountB = b.review_count || 0;
                    
                    // Prioritize products with reviews and higher ratings
                    if (reviewCountA !== reviewCountB) {
                        return reviewCountB - reviewCountA;
                    }
                    return ratingB - ratingA;
                });
                setFeaturedProducts(sortedForFeatured.slice(0, 8));
                
                // Create flash sale products (products with actual discounts)
                const discountedProducts = productsData.filter(product => {
                    const discount = calculateDiscount(product);
                    return discount && discount.percentage >= 10; // At least 10% discount
                });
                
                // If we have discounted products, use them; otherwise, create some based on API data
                if (discountedProducts.length >= 4) {
                    setFlashSaleProducts(discountedProducts.slice(0, 8));
                } else {
                    // Use products with best ratings for flash sale section
                    const sortedByRating = [...productsData].sort((a, b) => {
                        return (b.average_rating || 0) - (a.average_rating || 0);
                    });
                    setFlashSaleProducts(sortedByRating.slice(0, 8));
                }
                
                // Recently viewed products (simulate from products with images)
                const productsWithImages = productsData.filter(p => p.images && p.images.length > 0);
                setViewedProducts(productsWithImages.slice(0, 4));
                
                // Set live stats (simulated)
                setLiveStats({
                    activeUsers: Math.floor(Math.random() * 500) + 250,
                    recentOrders: Math.floor(Math.random() * 200) + 50,
                    itemsSold: Math.floor(Math.random() * 1000) + 500
                });
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setCategories([]);
                setProducts([]);
                setFeaturedProducts([]);
                setFlashSaleProducts([]);
                setViewedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to get category icon based on category name
    const getCategoryIcon = (categoryName) => {
        const lowerName = categoryName?.toLowerCase() || '';
        
        const iconMap = {
            'electronics': '📱',
            'fashion': '👕',
            'clothing': '👕',
            'home': '🏠',
            'furniture': '🛋️',
            'kitchen': '🍳',
            'beauty': '💄',
            'cosmetics': '💄',
            'sports': '⚽',
            'fitness': '💪',
            'books': '📚',
            'stationery': '📎',
            'toys': '🧸',
            'gaming': '🎮',
            'automotive': '🚗',
            'tools': '🔧',
            'jewelry': '💎',
            'watches': '⌚',
            'shoes': '👟',
            'bags': '👜',
        };

        // Check for exact matches first
        if (iconMap[lowerName]) {
            return iconMap[lowerName];
        }
        
        // Check for partial matches
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerName.includes(key)) {
                return icon;
            }
        }
        
        // Default icons based on keywords
        if (lowerName.includes('electr')) return '⚡';
        if (lowerName.includes('cloth')) return '👚';
        if (lowerName.includes('food')) return '🍕';
        if (lowerName.includes('drink')) return '🥤';
        if (lowerName.includes('mobil')) return '📱';
        if (lowerName.includes('comp')) return '💻';
        
        // Random fallback
        const fallbackIcons = ['🛒', '📦', '⭐', '🔥', '🎁'];
        return fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];
    };

    // Trust badges data
    const trustBadges = [
        { icon: <FaShieldAlt />, text: 'Secure Payment', subtext: '100% Protected' },
        { icon: <FaShippingFast />, text: 'Free Shipping', subtext: 'Over PKR 2000' },
        { icon: <FaGift />, text: 'Easy Returns', subtext: '7 Day Policy' },
        { icon: <FaTrophy />, text: 'Best Prices', subtext: 'Price Match Guarantee' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-4 text-gray-600">Loading amazing deals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner with FOMO */}
            <div className="relative bg-gradient-to-r from-[#1A1A1A] to-gray-900 text-white overflow-hidden">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
                                <FaFire /> <span className="font-bold">LIMITED TIME OFFER</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                                Welcome to <span className="text-[#FF5C00]">PrimaryOrder</span>
                            </h1>
                            
                            <p className="text-xl text-gray-300 mb-8">
                                Shop Smart. Shop Primary. Discover amazing deals on thousands of products.
                                <span className="block text-[#FF5C00] font-bold mt-2">
                                    Flash sale ends in:
                                </span>
                            </p>
                            
                            <CountdownTimer targetDate={saleEndTimeRef.current} />
                            
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link 
                                    to="/products" 
                                    className="bg-[#FF5C00] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#E55100] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    Shop Now <FaArrowRight />
                                </Link>
                                <Link 
                                    to="/categories" 
                                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#1A1A1A] transition-all duration-300"
                                >
                                    Browse Categories
                                </Link>
                            </div>
                            
                            {/* Live Stats - UPDATED FOMO ELEMENT */}
                            <div className="mt-10 p-6 bg-gradient-to-r from-[#FF5C00]/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-[#FF5C00]/30">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <div className="relative">
                                                <FaUserFriends className="text-xl text-[#FF5C00]" />
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                            </div>
                                            <span className="text-sm font-medium">Live Shoppers</span>
                                        </div>
                                        <div className="text-2xl font-bold animate-pulse">
                                            {liveStats.activeUsers}+
                                        </div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <FaShoppingCart className="text-xl text-[#FF5C00]" />
                                            <span className="text-sm font-medium">Recent Orders</span>
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {liveStats.recentOrders}+ today
                                        </div>
                                    </div>
                                    
                                    <div className="text-center col-span-2 md:col-span-1">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <FaBolt className="text-xl text-yellow-400 animate-pulse" />
                                            <span className="text-sm font-medium">Flash Sale Items</span>
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {flashSaleProducts.length}+
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Stock Alert Bar */}
                                <div className="mt-4 bg-red-900/30 p-3 rounded-lg border border-red-500/50">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaClock className="text-red-400 animate-pulse" />
                                        <span className="text-sm font-medium">
                                            {Math.floor(Math.random() * 10) + 1} items sold in last hour!
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Hero Image with Real Products */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-[#FF5C00] to-orange-500 p-1 rounded-3xl shadow-2xl">
                                <div className="bg-white rounded-2xl p-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        {products.slice(0, 4).map((product, index) => {
                                            const discount = calculateDiscount(product);
                                            const finalPrice = discount ? discount.discountedPrice : parseFloat(product.price || 0);
                                            
                                            return (
                                                <div key={product.id || index} className="bg-gray-50 p-4 rounded-xl hover:shadow-lg transition-shadow group">
                                                    <div className="relative">
                                                        <img 
                                                            src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'} 
                                                            alt={product.title}
                                                            className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        {discount && (
                                                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                                -{discount.percentage}%
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="text-xs font-semibold text-gray-800 truncate">{product.title}</div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-lg font-bold text-[#FF5C00]">
                                                                {formatPrice(finalPrice)}
                                                            </div>
                                                            {discount && (
                                                                <div className="text-xs text-gray-500 line-through">
                                                                    {formatPrice(discount.originalPrice)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="text-xs text-red-500 font-bold">
                                                                🔥 {Math.floor(Math.random() * 50) + 20} sold
                                                            </div>
                                                            <div className="flex items-center text-xs text-yellow-500">
                                                                <FaStar className="fill-current" />
                                                                <span className="ml-1">{product.average_rating?.toFixed(1) || '0.0'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6 text-center">
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-6 py-3 rounded-full font-bold animate-pulse">
                                            <FaFire /> {products.length}+ Hot Deals Available Now!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Badges */}
                            <div className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
                                <div className="text-xs font-bold">🔥 HOT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of your existing code remains the same from Trust Badges section onward */}
            {/* Trust Badges */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trustBadges.map((badge, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="text-3xl text-[#FF5C00] mb-3">
                                {badge.icon}
                            </div>
                            <div className="font-bold text-gray-800">{badge.text}</div>
                            <div className="text-sm text-gray-600">{badge.subtext}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Continue with the rest of your existing code... */}
            {/* Categories Section */}
            {/* Flash Sale Section */}
            {/* Featured Products */}
            {/* Recently Viewed Section */}
            {/* Bottom CTA with FOMO */}
            
        </div>
    );
};

export default HomePage;