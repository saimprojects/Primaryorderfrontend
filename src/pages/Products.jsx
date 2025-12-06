import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { 
    FaFilter, FaSortAmountDown, FaSortAmountUp, FaSearch,
    FaTimes, FaStar, FaFire, FaPercent, FaTag
} from 'react-icons/fa';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [showFilters, setShowFilters] = useState(false);
    
    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/products/categories/');
                const data = res.data?.results || res.data || [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products with filters
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (sortBy) params.append('ordering', getOrderingParam(sortBy));
            
            // Update URL params
            setSearchParams(params);
            
            const url = `/products/${params.toString() ? `?${params.toString()}` : ''}`;
            const res = await api.get(url);
            
            const data = res.data?.results || res.data || [];
            setProducts(Array.isArray(data) ? data : []);
            
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, setSearchParams]);

    // Initial fetch and on filter change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Helper function for sorting
    const getOrderingParam = (sort) => {
        switch(sort) {
            case 'price_low': return 'price';
            case 'price_high': return '-price';
            case 'popular': return '-rating';
            case 'discount': return '-discount_percentage';
            default: return '-created_at';
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('newest');
        setSearchParams({});
    };

    // Apply filters
    const applyFilters = () => {
        setShowFilters(false);
        fetchProducts();
    };

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Newest First', icon: <FaSortAmountDown /> },
        { value: 'price_low', label: 'Price: Low to High', icon: <FaSortAmountUp /> },
        { value: 'price_high', label: 'Price: High to Low', icon: <FaSortAmountDown /> },
        { value: 'popular', label: 'Most Popular', icon: <FaStar /> },
        { value: 'discount', label: 'Best Discount', icon: <FaPercent /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
                    <p className="text-xl opacity-90">
                        Discover {products.length}+ amazing products across {categories.length} categories
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                                <button 
                                    onClick={clearFilters}
                                    className="text-sm text-[#FF5C00] hover:text-[#E55100]"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Products
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categories
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug || cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range (PKR)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <div className="space-y-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                                sortBy === option.value
                                                    ? 'bg-[#FF5C00] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {option.icon}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-3 rounded-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300"
                            >
                                Apply Filters
                            </button>

                            {/* Active Filters */}
                            {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                Search: {searchTerm}
                                                <button onClick={() => setSearchTerm('')}>
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {selectedCategory && (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                                                <button onClick={() => setSelectedCategory('')}>
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {(minPrice || maxPrice) && (
                                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                                Price: {minPrice || '0'} - {maxPrice || '∞'} PKR
                                                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Bar */}
                        <div className="lg:hidden mb-6">
                            <div className="flex items-center justify-between bg-white rounded-xl shadow p-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        <FaFilter />
                                        Filters
                                        {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                                            <span className="bg-[#FF5C00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                !
                                            </span>
                                        )}
                                    </button>
                                    
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="text-gray-600">
                                    {products.length} products
                                </div>
                            </div>

                            {/* Mobile Filters Panel */}
                            {showFilters && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                                    <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold">Filters</h2>
                                            <button 
                                                onClick={() => setShowFilters(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FaTimes size={20} />
                                            </button>
                                        </div>

                                        {/* Mobile Filters Content */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Search
                                                </label>
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Search products..."
                                                    className="w-full border rounded-lg px-4 py-2"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full border rounded-lg px-4 py-2"
                                                >
                                                    <option value="">All Categories</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.slug || cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Price Range (PKR)
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(e.target.value)}
                                                        placeholder="Min"
                                                        className="border rounded-lg px-3 py-2"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(e.target.value)}
                                                        placeholder="Max"
                                                        className="border rounded-lg px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-3">
                                            <button
                                                onClick={applyFilters}
                                                className="w-full bg-[#FF5C00] text-white font-bold py-3 rounded-lg"
                                            >
                                                Apply Filters
                                            </button>
                                            <button
                                                onClick={clearFilters}
                                                className="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-lg"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Products Count and Sort - Desktop */}
                        <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {products.length} Products Found
                                </h2>
                                {selectedCategory && (
                                    <p className="text-gray-600">
                                        in "{categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}" category
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl shadow animate-pulse">
                                        <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                                        <div className="p-4">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                            <div className="h-8 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E55100] transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination would go here */}
                                {products.length > 0 && (
                                    <div className="mt-12 text-center">
                                        <p className="text-gray-600">
                                            Showing {products.length} of many amazing products
                                        </p>
                                        <button className="mt-4 bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                            Load More Products
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Featured Categories */}
                        {categories.length > 0 && !selectedCategory && (
                            <div className="mt-16">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {categories.slice(0, 12).map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/products?category=${cat.slug || cat.id}`}
                                            className="bg-white rounded-xl p-4 text-center shadow hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
                                        >
                                            <div className="text-3xl mb-2">
                                                {cat.name?.includes('Electr') ? '⚡' : 
                                                 cat.name?.includes('Fashion') ? '👕' : 
                                                 cat.name?.includes('Home') ? '🏠' : 
                                                 cat.name?.includes('Sport') ? '⚽' : 
                                                 cat.name?.includes('Beauty') ? '💄' : 
                                                 cat.name?.includes('Book') ? '📚' : '🛒'}
                                            </div>
                                            <div className="font-medium text-gray-800 text-sm">
                                                {cat.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {Math.floor(Math.random() * 500) + 50}+ items
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;