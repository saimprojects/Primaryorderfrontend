import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { 
    FaFire, FaGift, FaShieldAlt, FaShippingFast, 
    FaArrowRight, FaTrophy, FaPercent, FaCrown,
    FaClock, FaUsers, FaEye, FaTag, FaStar,
    FaShoppingCart, FaUserFriends, FaBolt, FaChartLine
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
        purchases: 0,
        usersOnline: 0,
        dealsClaimed: 0
    });
    
    const saleEndTimeRef = useRef(new Date(Date.now() + 24 * 60 * 60 * 1000));

    // Simulate live stats
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveStats(prev => ({
                purchases: prev.purchases + Math.floor(Math.random() * 3),
                usersOnline: 150 + Math.floor(Math.random() * 50),
                dealsClaimed: prev.dealsClaimed + Math.floor(Math.random() * 2)
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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
                            
                            {/* Live Stats */}
                            <div className="mt-10 flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                        <FaUsers className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{products.length}+</div>
                                        <div className="text-gray-300 text-sm">Products Available</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                        <FaTag className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{categories.length}</div>
                                        <div className="text-gray-300 text-sm">Categories</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* New FOMO Element - Live Shopping Activity */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-[#FF5C00] to-orange-500 p-1 rounded-3xl shadow-2xl animate-pulse">
                                <div className="bg-white rounded-2xl p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-100 p-2 rounded-full">
                                                <FaBolt className="text-red-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">Live Shopping Activity</h3>
                                                <p className="text-gray-600 text-sm">Happening right now!</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Live Activity Feed */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaUserFriends className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{liveStats.usersOnline}+ shoppers</div>
                                                    <div className="text-xs text-gray-500">Online now</div>
                                                </div>
                                            </div>
                                            <div className="text-green-600 font-bold animate-pulse">LIVE</div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FaShoppingCart className="text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{liveStats.purchases} orders</div>
                                                    <div className="text-xs text-gray-500">Last 5 minutes</div>
                                                </div>
                                            </div>
                                            <div className="text-red-600 font-bold">
                                                🔥 Hot
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <FaChartLine className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{liveStats.dealsClaimed} deals</div>
                                                    <div className="text-xs text-gray-500">Claimed recently</div>
                                                </div>
                                            </div>
                                            <div className="text-orange-600 font-bold">
                                                🚀 Trending
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* FOMO Message */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500">
                                        <div className="flex items-start gap-3">
                                            <FaClock className="text-red-600 mt-1" />
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">Don't Miss Out!</div>
                                                <div className="text-xs text-gray-600">
                                                    Last {Math.floor(Math.random() * 20) + 10} people purchased in the last hour. 
                                                    Sale ends when timer hits zero!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hot Categories */}
                                    <div className="mt-6">
                                        <div className="text-sm font-bold text-gray-800 mb-3">🔥 Hot Categories Right Now:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.slice(0, 4).map((category, index) => (
                                                <div 
                                                    key={category.id} 
                                                    className="bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 border border-orange-200"
                                                >
                                                    {category.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* Categories Section - Using Real Categories from Backend */}
            {categories.length > 0 && (
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link 
                                key={category.id} 
                                to={`/category/${category.slug || category.name?.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-white rounded-xl p-4 md:p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
                            >
                                <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {getCategoryIcon(category.name)}
                                </div>
                                <div className="font-bold text-gray-800 mb-1 text-sm md:text-base">
                                    {category.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {Math.floor(Math.random() * 500) + 50}+ items
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Flash Sale Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-3">
                            <FaFire /> FLASH SALE
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Deals Ending Soon</h2>
                        <p className="text-gray-600 mt-2">Don't miss these amazing discounts!</p>
                        <CountdownTimer targetDate={new Date(Date.now() + 6 * 60 * 60 * 1000)} compact />
                    </div>
                    <Link 
                        to="/products" 
                        className="mt-4 md:mt-0 text-[#FF5C00] font-bold hover:text-[#E55100] flex items-center gap-2"
                    >
                        View All <FaArrowRight />
                    </Link>
                </div>
                
                {flashSaleProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {flashSaleProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        
                        {/* Stock Alert Bar */}
                        <div className="mt-10 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 p-2 rounded-full">
                                        <FaClock className="text-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">HURRY! These deals won't last</div>
                                        <div className="text-sm text-gray-600">Limited stock at these prices</div>
                                    </div>
                                </div>
                                <div className="text-red-600 font-bold text-sm md:text-base">
                                    🔥 {Math.floor(Math.random() * 100) + 50} people viewing now
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-4">🔥</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Flash Sale Coming Soon!</h3>
                        <p className="text-gray-600">Check back later for amazing discounts</p>
                    </div>
                )}
            </div>

            {/* Featured Products */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Featured Products</h2>
                        <p className="text-gray-600 mt-2">Handpicked selections just for you</p>
                    </div>
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                        {['trending', 'new', 'popular'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
                                    activeTab === tab 
                                        ? 'bg-white text-[#FF5C00] shadow' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                {featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Yet</h3>
                        <p className="text-gray-600">Products will appear here soon</p>
                    </div>
                )}
            </div>

            {/* Recently Viewed Section */}
            {viewedProducts.length > 0 && (
                <div className="container mx-auto px-4 py-16">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Recently Viewed</h2>
                                <p className="text-gray-600 mt-2">Continue your shopping journey</p>
                            </div>
                            <div className="text-gray-500 text-sm">
                                <span className="flex items-center gap-2">
                                    <FaEye /> Based on your activity
                                </span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {viewedProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl p-4 shadow-lg">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom CTA with FOMO */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full translate-x-20 translate-y-20"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
                        Join {products.length}+ Happy Shoppers!
                    </h2>
                    <p className="text-xl mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">
                        Discover amazing deals across {categories.length} categories. 
                        Shop with confidence on Pakistan's favorite e-commerce platform.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 justify-center mb-10 relative z-10">
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <div className="text-2xl font-bold">{products.length}+</div>
                            <div className="text-sm">Products</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <div className="text-2xl font-bold">{categories.length}</div>
                            <div className="text-sm">Categories</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <div className="text-2xl font-bold">24/7</div>
                            <div className="text-sm">Support</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <div className="text-2xl font-bold">7 Days</div>
                            <div className="text-sm">Returns</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link 
                            to="/products" 
                            className="inline-flex items-center justify-center gap-3 bg-white text-[#FF5C00] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Start Shopping Now <FaArrowRight />
                        </Link>
                        <Link 
                            to="/categories" 
                            className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#FF5C00] transition-all duration-300"
                        >
                            Browse Categories
                        </Link>
                    </div>
                    
                    <div className="mt-8 text-sm opacity-80 relative z-10">
                        ⚡ New deals added daily
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;