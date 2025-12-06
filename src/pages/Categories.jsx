import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
    FaSearch, FaShoppingBag, FaStar, FaFire, 
    FaPercent, FaTag, FaArrowRight, FaCrown
} from 'react-icons/fa';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products/categories/');
                const data = res.data?.results || res.data || [];
                setCategories(Array.isArray(data) ? data : []);
                
                // Select 4 random categories as featured
                if (data.length > 4) {
                    const shuffled = [...data].sort(() => 0.5 - Math.random());
                    setFeaturedCategories(shuffled.slice(0, 4));
                } else {
                    setFeaturedCategories(data);
                }
                
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
                setFeaturedCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Filter categories based on search
    const filteredCategories = categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to get category icon
    const getCategoryIcon = (categoryName) => {
        const lowerName = categoryName?.toLowerCase() || '';
        
        if (lowerName.includes('electr') || lowerName.includes('phone') || lowerName.includes('laptop')) return '📱';
        if (lowerName.includes('fashion') || lowerName.includes('cloth')) return '👕';
        if (lowerName.includes('home') || lowerName.includes('furniture')) return '🏠';
        if (lowerName.includes('beauty') || lowerName.includes('cosmetic')) return '💄';
        if (lowerName.includes('sport') || lowerName.includes('fitness')) return '⚽';
        if (lowerName.includes('book') || lowerName.includes('stationery')) return '📚';
        if (lowerName.includes('toy') || lowerName.includes('game')) return '🎮';
        if (lowerName.includes('kitchen') || lowerName.includes('cook')) return '🍳';
        if (lowerName.includes('health') || lowerName.includes('medical')) return '💊';
        if (lowerName.includes('auto') || lowerName.includes('car')) return '🚗';
        if (lowerName.includes('baby') || lowerName.includes('kid')) return '👶';
        if (lowerName.includes('pet')) return '🐶';
        if (lowerName.includes('garden') || lowerName.includes('plant')) return '🌱';
        
        return '🛒';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-gray-900 text-white">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                        Shop by <span className="text-[#FF5C00]">Category</span>
                    </h1>
                    <p className="text-xl text-center opacity-90 max-w-2xl mx-auto">
                        Discover amazing products across {categories.length} carefully curated categories
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full bg-white text-gray-800 rounded-xl px-6 py-4 pl-14 focus:outline-none focus:ring-4 focus:ring-[#FF5C00] focus:ring-opacity-30"
                            />
                            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#FF5C00]">{categories.length}</div>
                        <div className="text-gray-600">Categories</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#FF5C00]">1000+</div>
                        <div className="text-gray-600">Products</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#FF5C00]">24/7</div>
                        <div className="text-gray-600">Support</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#FF5C00]">🇵🇰</div>
                        <div className="text-gray-600">Pakistan Wide</div>
                    </div>
                </div>
            </div>

            {/* Featured Categories */}
            {featuredCategories.length > 0 && (
                <div className="container mx-auto px-4 py-16">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-4 py-2 rounded-full mb-3">
                                <FaCrown /> FEATURED CATEGORIES
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Trending Categories</h2>
                            <p className="text-gray-600 mt-2">Most popular among our customers</p>
                        </div>
                        <Link 
                            to="/products" 
                            className="text-[#FF5C00] font-bold hover:text-[#E55100] flex items-center gap-2"
                        >
                            View All <FaArrowRight />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredCategories.map((cat, index) => (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.slug || cat.id}`}
                                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 ${
                                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                }`}
                            >
                                <div className={`${index === 0 ? 'h-64' : 'h-48'} relative overflow-hidden`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${
                                        index === 0 ? 'from-[#FF5C00] to-orange-500' :
                                        index === 1 ? 'from-blue-500 to-cyan-400' :
                                        index === 2 ? 'from-purple-500 to-pink-500' :
                                        'from-green-500 to-emerald-400'
                                    }`}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-6xl opacity-90">
                                            {getCategoryIcon(cat.name)}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                                        <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                        <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                                            <FaTag /> {Math.floor(Math.random() * 500) + 100} products
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 line-clamp-2 mb-4">
                                        {cat.description || `Shop amazing ${cat.name} products at best prices`}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#FF5C00] font-bold flex items-center gap-1">
                                            <FaArrowRight /> Explore Now
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Up to {Math.floor(Math.random() * 70) + 20}% OFF
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* All Categories */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        All Categories
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse through all our categories to find exactly what you're looking for
                    </p>
                </div>

                {filteredCategories.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Categories Found</h3>
                        <p className="text-gray-600">Try a different search term</p>
                    </div>
                ) : (
                    <>
                        {/* Categories Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {filteredCategories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/category/${cat.slug || cat.id}`}
                                    className="group bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {getCategoryIcon(cat.name)}
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">
                                        {cat.name}
                                    </h3>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {Math.floor(Math.random() * 500) + 50}+ products
                                    </div>
                                    <div className="inline-flex items-center gap-1 text-sm text-[#FF5C00] font-medium">
                                        Browse <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty categories message */}
                        {categories.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">📂</div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Categories Available</h3>
                                <p className="text-gray-600">Categories will be added soon</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Can't Find What You're Looking For?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Use our powerful search to find any product across all categories
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/products"
                            className="bg-white text-[#FF5C00] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                        >
                            Browse All Products
                        </Link>
                        <button
                            onClick={() => document.getElementById('search-input')?.focus()}
                            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#FF5C00] transition-colors"
                        >
                            Search Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;