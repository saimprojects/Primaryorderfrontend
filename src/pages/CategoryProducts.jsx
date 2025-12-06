import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { 
    FaArrowLeft, FaFilter, FaSortAmountDown, FaTag,
    FaFire, FaPercent, FaShoppingBag, FaStar,
    FaArrowRight, FaHome, FaTimes
} from 'react-icons/fa';

const CategoryProducts = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);

    // Fetch category details and products
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Try to fetch category by slug
                let categoryData;
                try {
                    // First try to get category by slug
                    const catRes = await api.get(`/products/categories/${slug}/`);
                    categoryData = catRes.data;
                } catch (catError) {
                    // If slug not found, try to get from categories list
                    const allCatsRes = await api.get('/products/categories/');
                    const allCats = allCatsRes.data?.results || allCatsRes.data || [];
                    categoryData = allCats.find(cat => cat.slug === slug || cat.id.toString() === slug);
                    
                    if (!categoryData) {
                        throw new Error('Category not found');
                    }
                }
                
                setCategory(categoryData);
                
                // Fetch products for this category
                const params = new URLSearchParams();
                params.append('category', slug);
                
                if (searchParams.get('search')) {
                    params.append('search', searchParams.get('search'));
                }
                
                const productsRes = await api.get(`/products/?${params.toString()}`);
                const productsData = productsRes.data?.results || productsRes.data || [];
                setProducts(Array.isArray(productsData) ? productsData : []);
                
                // Simulate subcategories (in real app, this would come from API)
                const fakeSubCats = [
                    { name: 'Sub Category 1', productCount: Math.floor(Math.random() * 100) + 50 },
                    { name: 'Sub Category 2', productCount: Math.floor(Math.random() * 100) + 50 },
                    { name: 'Sub Category 3', productCount: Math.floor(Math.random() * 100) + 50 },
                ];
                setSubCategories(fakeSubCats);
                
            } catch (err) {
                console.error('Error fetching category data:', err);
                setError('Category not found or failed to load');
                setCategory(null);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCategoryData();
        }
    }, [slug, searchParams]);

    // Apply sorting
    const sortedProducts = useCallback(() => {
        const productsCopy = [...products];
        
        switch(sortBy) {
            case 'price_low':
                return productsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price_high':
                return productsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'popular':
                return productsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'discount':
                return productsCopy.sort((a, b) => 
                    (b.discount_percentage || 0) - (a.discount_percentage || 0)
                );
            default: // newest
                return productsCopy;
        }
    }, [products, sortBy]);

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Newest First', icon: <FaSortAmountDown /> },
        { value: 'price_low', label: 'Price: Low to High', icon: <FaTag /> },
        { value: 'price_high', label: 'Price: High to Low', icon: <FaTag /> },
        { value: 'popular', label: 'Most Popular', icon: <FaStar /> },
        { value: 'discount', label: 'Best Discount', icon: <FaPercent /> }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-4 text-gray-600">Loading category...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Category Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The category you are looking for does not exist'}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/categories"
                            className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E55100] transition-colors"
                        >
                            Browse Categories
                        </Link>
                        <Link 
                            to="/"
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-[#FF5C00] transition-colors">
                            <FaHome />
                        </Link>
                        <span>/</span>
                        <Link to="/categories" className="hover:text-[#FF5C00] transition-colors">
                            Categories
                        </Link>
                        <span>/</span>
                        <span className="text-gray-800 font-medium">{category.name}</span>
                    </nav>
                </div>
            </div>

            {/* Category Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-gray-800 text-white">
                <div className="container mx-auto px-4 py-12">
                    <Link 
                        to="/categories"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <FaArrowLeft /> Back to Categories
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
                            <p className="text-xl opacity-90 max-w-2xl">
                                {category.description || `Discover amazing ${category.name} products at best prices in Pakistan`}
                            </p>
                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <FaShoppingBag />
                                    <span>{products.length} Products</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaFire />
                                    <span>🔥 {Math.floor(Math.random() * 100) + 50} sold today</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-center">
                                <div className="text-4xl mb-2">
                                    {category.name?.includes('Electr') ? '⚡' : 
                                     category.name?.includes('Fashion') ? '👕' : 
                                     category.name?.includes('Home') ? '🏠' : 
                                     category.name?.includes('Sport') ? '⚽' : '🛒'}
                                </div>
                                <div className="text-2xl font-bold">{products.length}</div>
                                <div className="text-sm opacity-80">Products Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Categories (if any) */}
            {subCategories.length > 0 && (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sub Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {subCategories.map((subCat, index) => (
                            <Link
                                key={index}
                                to={`/category/${slug}/${subCat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border border-gray-100 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{subCat.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{subCat.productCount} products</p>
                                    </div>
                                    <FaArrowRight className="text-gray-400 group-hover:text-[#FF5C00] transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Filters</h3>
                            
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

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range (PKR)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        placeholder="Min"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                                    />
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        placeholder="Max"
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                                    />
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <button
                                onClick={() => {/* Apply price filter logic */}}
                                className="w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-3 rounded-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300"
                            >
                                Apply Filters
                            </button>

                            {/* Stats */}
                            <div className="mt-8 pt-6 border-t">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Products</span>
                                        <span className="font-bold">{products.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Average Price</span>
                                        <span className="font-bold">
                                            PKR {products.length > 0 
                                                ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toLocaleString()
                                                : '0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discounts</span>
                                        <span className="font-bold text-green-600">
                                            Up to {Math.floor(Math.random() * 70) + 20}% OFF
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Bar */}
                        <div className="lg:hidden mb-6">
                            <div className="flex items-center justify-between bg-white rounded-xl shadow p-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    <FaFilter />
                                    Filters & Sort
                                </button>
                                
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
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
                                                    Sort By
                                                </label>
                                                <div className="space-y-2">
                                                    {sortOptions.map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setSortBy(option.value);
                                                                setShowFilters(false);
                                                            }}
                                                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                                                                sortBy === option.value
                                                                    ? 'bg-[#FF5C00] text-white'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            {option.icon}
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Price Range (PKR)
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        value={priceRange.min}
                                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                                        placeholder="Min"
                                                        className="border rounded-lg px-3 py-2"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={priceRange.max}
                                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                                        placeholder="Max"
                                                        className="border rounded-lg px-3 py-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-3">
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="w-full bg-[#FF5C00] text-white font-bold py-3 rounded-lg"
                                            >
                                                Apply Filters
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPriceRange({ min: '', max: '' });
                                                    setSortBy('newest');
                                                }}
                                                className="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-lg"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Products Count */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Products ({products.length})
                            </h2>
                            <div className="text-gray-600 text-sm hidden lg:block">
                                Sorted by: {sortOptions.find(o => o.value === sortBy)?.label}
                            </div>
                        </div>

                        {/* Products Grid */}
                        {sortedProducts().length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                                <p className="text-gray-600 mb-6">
                                    No products available in {category.name} category
                                </p>
                                <Link
                                    to="/categories"
                                    className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E55100] transition-colors"
                                >
                                    Browse Other Categories
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {sortedProducts().map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Related Categories */}
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Categories</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Link
                                        key={index}
                                        to={`/category/sample-category-${index + 1}`}
                                        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all text-center group"
                                    >
                                        <div className="text-3xl mb-2">
                                            {['📱', '👕', '🏠', '⚽', '💄', '📚'][index]}
                                        </div>
                                        <div className="font-medium text-gray-800 text-sm">
                                            Related {index + 1}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {Math.floor(Math.random() * 200) + 50} products
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryProducts;