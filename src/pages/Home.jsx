import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { 
    FaFire, FaGift, FaShieldAlt, FaShippingFast, 
    FaArrowRight, FaTrophy, FaPercent, FaCrown,
    FaClock, FaUsers, FaEye, FaTag, FaStar,
    FaShoppingCart, FaUserFriends, FaBolt, FaChartLine,
    FaWhatsapp, FaPhone, FaEnvelope, FaHeart,
    FaBox, FaTruck, FaCreditCard, FaUndo,
    FaCaretRight, FaCaretLeft, FaSearch,
    FaFilter, FaSortAmountDown
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
        purchases: Math.floor(Math.random() * 100) + 50,
        usersOnline: 150 + Math.floor(Math.random() * 50),
        dealsClaimed: Math.floor(Math.random() * 50) + 20
    });
    
    const saleEndTimeRef = useRef(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const featuredCarouselRef = useRef(null);

    // WhatsApp Click Handler
    const handleWhatsAppClick = () => {
        const phoneNumber = "+923131471263";
        const message = `Hi! I'm interested in shopping at PrimaryOrder. Can you help me?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
    };

    // Simulate live stats
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveStats(prev => ({
                purchases: prev.purchases + Math.floor(Math.random() * 3),
                usersOnline: Math.max(100, prev.usersOnline + Math.floor(Math.random() * 10) - 5),
                dealsClaimed: prev.dealsClaimed + Math.floor(Math.random() * 2)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Format price in PKR
    const formatPrice = (price) => {
        if (!price && price !== 0) return "Rs 0";
        const numPrice = parseFloat(price);
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice).replace('PKR', 'Rs');
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
                    const price = parseFloat(product.price || product.base_price || 0);
                    const discountPrice = parseFloat(product.discount_price || 0);
                    return discountPrice > 0 && discountPrice < price;
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
        { icon: <FaShippingFast />, text: 'Free Shipping', subtext: 'Over Rs 2000' },
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
        <div className="min-h-screen bg-gray-50 relative">
            {/* 🔥 WhatsApp Floating Button */}
            <button
                onClick={handleWhatsAppClick}
                className="fixed bottom-6 right-6 z-[99999] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110 animate-bounce"
                style={{ animationDuration: '2s' }}
                title="Chat on WhatsApp"
            >
                <FaWhatsapp className="text-3xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-ping">
                    !
                </span>
            </button>

            {/* 🔥 Top Announcement Bar */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <FaFire className="text-sm" />
                            <span className="font-bold">MEGA SALE LIVE!</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <FaPercent className="text-sm" />
                            <span>Up to 70% OFF</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <FaClock className="text-sm" />
                            <span>Ends in: <span className="font-bold">{String(Math.floor(Math.random() * 24)).padStart(2, '0')}h {String(Math.floor(Math.random() * 60)).padStart(2, '0')}m</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Banner with FOMO */}
            <div className="relative bg-gradient-to-r from-[#1A1A1A] to-gray-900 text-white overflow-hidden">
                <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-4 py-2 rounded-full mb-4 sm:mb-6 animate-pulse text-sm sm:text-base">
                                <FaFire /> <span className="font-bold">LIMITED TIME OFFER</span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                Welcome to <span className="text-[#FF5C00]">PrimaryOrder</span>
                            </h1>
                            
                            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
                                Shop Smart. Shop Primary. Discover amazing deals on thousands of products.
                                <span className="block text-[#FF5C00] font-bold mt-2 text-base sm:text-lg">
                                    Flash sale ends in:
                                </span>
                            </p>
                            
                            <div className="mb-6 sm:mb-8">
                                <CountdownTimer targetDate={saleEndTimeRef.current} />
                            </div>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Link 
                                    to="/products" 
                                    className="bg-[#FF5C00] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-[#E55100] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    Shop Now <FaArrowRight />
                                </Link>
                                <Link 
                                    to="/categories" 
                                    className="bg-transparent border border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 flex items-center justify-center"
                                >
                                    Browse Categories
                                </Link>
                            </div>
                            
                            {/* Live Stats */}
                            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg">
                                        <FaUsers className="text-lg sm:text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold">{products.length}+</div>
                                        <div className="text-gray-300 text-xs sm:text-sm">Products Available</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg">
                                        <FaTag className="text-lg sm:text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold">{categories.length}</div>
                                        <div className="text-gray-300 text-xs sm:text-sm">Categories</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 🔥 FOMO Element - Live Shopping Activity */}
                        <div className="relative mt-8 lg:mt-0">
                            <div className="relative bg-gradient-to-br from-[#FF5C00] to-orange-500 p-1 rounded-2xl sm:rounded-3xl shadow-2xl animate-pulse">
                                <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-100 p-2 rounded-full">
                                                <FaBolt className="text-red-600 text-base sm:text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base sm:text-lg">Live Shopping Activity</h3>
                                                <p className="text-gray-600 text-xs sm:text-sm">Happening right now!</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Live Activity Feed */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaUserFriends className="text-blue-600 text-sm" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800 text-sm sm:text-base">{liveStats.usersOnline}+ shoppers</div>
                                                    <div className="text-xs text-gray-500">Online now</div>
                                                </div>
                                            </div>
                                            <div className="text-green-600 font-bold text-xs sm:text-sm animate-pulse">LIVE</div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FaShoppingCart className="text-green-600 text-sm" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800 text-sm sm:text-base">{liveStats.purchases} orders</div>
                                                    <div className="text-xs text-gray-500">Last 5 minutes</div>
                                                </div>
                                            </div>
                                            <div className="text-red-600 font-bold text-xs sm:text-sm">
                                                🔥 Hot
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <FaChartLine className="text-purple-600 text-sm" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800 text-sm sm:text-base">{liveStats.dealsClaimed} deals</div>
                                                    <div className="text-xs text-gray-500">Claimed recently</div>
                                                </div>
                                            </div>
                                            <div className="text-orange-600 font-bold text-xs sm:text-sm">
                                                🚀 Trending
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* FOMO Message */}
                                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500">
                                        <div className="flex items-start gap-3">
                                            <FaClock className="text-red-600 mt-1 text-sm" />
                                            <div>
                                                <div className="font-bold text-gray-800 text-xs sm:text-sm">Don't Miss Out!</div>
                                                <div className="text-xs text-gray-600">
                                                    Last {Math.floor(Math.random() * 20) + 10} people purchased in the last hour. 
                                                    Sale ends when timer hits zero!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hot Categories */}
                                    <div className="mt-4 sm:mt-6">
                                        <div className="text-xs sm:text-sm font-bold text-gray-800 mb-2">🔥 Hot Categories Right Now:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.slice(0, 3).map((category, index) => (
                                                <div 
                                                    key={category.id} 
                                                    className="bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium text-gray-800 border border-orange-200"
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
            <div className="container mx-auto px-4 -mt-6 sm:-mt-8 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {trustBadges.map((badge, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="text-2xl sm:text-3xl text-[#FF5C00] mb-2 sm:mb-3">
                                {badge.icon}
                            </div>
                            <div className="font-bold text-gray-800 text-sm sm:text-base">{badge.text}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{badge.subtext}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            {categories.length > 0 && (
                <div className="container mx-auto px-4 py-8 sm:py-12">
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Shop by Category</h2>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">Browse our wide range of categories</p>
                        </div>
                        <Link 
                            to="/categories" 
                            className="text-[#FF5C00] font-bold hover:text-[#E55100] flex items-center gap-1 text-sm sm:text-base"
                        >
                            View All <FaArrowRight />
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
                        {categories.map((category) => (
                            <Link 
                                key={category.id} 
                                to={`/category/${category.slug || category.name?.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {getCategoryIcon(category.name)}
                                </div>
                                <div className="font-bold text-gray-800 mb-1 text-xs sm:text-sm line-clamp-2">
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
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-10">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="w-full lg:w-auto">
                            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-2 sm:mb-3 text-sm sm:text-base">
                                <FaFire /> <span className="font-bold">FLASH SALE</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Deals Ending Soon</h2>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Don't miss these amazing discounts!</p>
                            <div className="mt-3 sm:mt-4">
                                <CountdownTimer targetDate={new Date(Date.now() + 6 * 60 * 60 * 1000)} compact />
                            </div>
                        </div>
                        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 p-2 rounded-full">
                                        <FaEye className="text-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 text-lg sm:text-xl">{Math.floor(Math.random() * 100) + 50}</div>
                                        <div className="text-gray-600 text-xs sm:text-sm">Viewing Now</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <FaShoppingCart className="text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 text-lg sm:text-xl">{Math.floor(Math.random() * 50) + 20}</div>
                                        <div className="text-gray-600 text-xs sm:text-sm">Sold Today</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {flashSaleProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {flashSaleProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} isFlashSale={true} />
                            ))}
                        </div>
                        
                        {/* Flash Sale CTA */}
                        <div className="mt-8 sm:mt-10 flex justify-center">
                            <Link 
                                to="/products?flash_sale=true"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <FaFire /> View All Flash Sale Deals <FaArrowRight />
                            </Link>
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
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Featured Products</h2>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Handpicked selections just for you</p>
                    </div>
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                        {['trending', 'new', 'popular'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-6 py-2 rounded-lg font-medium capitalize transition-all text-xs sm:text-sm ${
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
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        
                        <div className="mt-8 sm:mt-10 flex justify-center">
                            <Link 
                                to="/products"
                                className="inline-flex items-center gap-2 bg-[#FF5C00] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-[#E55100] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                View All Products <FaArrowRight />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                        <div className="text-5xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Yet</h3>
                        <p className="text-gray-600">Products will appear here soon</p>
                    </div>
                )}
            </div>

            {/* Why Choose Us Section */}
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-10 text-center">Why Choose PrimaryOrder?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {[
                        { icon: <FaBox />, title: "Wide Selection", desc: "Thousands of products across categories" },
                        { icon: <FaTruck />, title: "Fast Delivery", desc: "Across Pakistan in 3-5 days" },
                        { icon: <FaCreditCard />, title: "Secure Payment", desc: "100% secure & encrypted payments" },
                        { icon: <FaUndo />, title: "Easy Returns", desc: "7-day hassle-free return policy" },
                    ].map((item, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="text-3xl sm:text-4xl text-[#FF5C00] mb-3 sm:mb-4">{item.icon}</div>
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recently Viewed Section */}
            {viewedProducts.length > 0 && (
                <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
                            <div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Recently Viewed</h2>
                                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Continue your shopping journey</p>
                            </div>
                            <div className="text-gray-500 text-sm flex items-center gap-2">
                                <FaEye /> <span>Based on your activity</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {viewedProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom CTA with FOMO */}
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-10 rounded-full -translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-40 sm:h-40 bg-white bg-opacity-10 rounded-full translate-x-14 translate-y-14"></div>
                    
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 relative z-10">
                        Join {products.length}+ Happy Shoppers!
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">
                        Discover amazing deals across {categories.length} categories. 
                        Shop with confidence on Pakistan's favorite e-commerce platform.
                    </p>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-10 relative z-10">
                        <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-xl min-w-[80px] sm:min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-bold">{products.length}+</div>
                            <div className="text-xs sm:text-sm">Products</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-xl min-w-[80px] sm:min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-bold">{categories.length}</div>
                            <div className="text-xs sm:text-sm">Categories</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-xl min-w-[80px] sm:min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-bold">24/7</div>
                            <div className="text-xs sm:text-sm">Support</div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-xl min-w-[80px] sm:min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-bold">7 Days</div>
                            <div className="text-xs sm:text-sm">Returns</div>
                        </div>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-10">
                        <Link 
                            to="/products" 
                            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-[#FF5C00] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Start Shopping Now <FaArrowRight />
                        </Link>
                        <Link 
                            to="/categories" 
                            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-transparent border border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-[#FF5C00] transition-all duration-300"
                        >
                            Browse Categories
                        </Link>
                    </div>
                    
                    <div className="mt-6 sm:mt-8 text-xs sm:text-sm opacity-80 relative z-10 flex items-center justify-center gap-2">
                        <FaBolt className="animate-pulse" /> New deals added daily
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;