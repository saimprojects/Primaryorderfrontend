import { Link } from 'react-router-dom';
import { FaStar, FaFire, FaShoppingCart, FaClock, FaUsers, FaPalette, FaRuler } from 'react-icons/fa';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    
    // 🔴 FIXED: Calculate actual discount with correct field names
    const calculateDiscount = (product) => {
        let price = 0;
        let discountPrice = 0;
        
        // 🔴 FIXED: Use base_price instead of price
        if (product.has_variants) {
            // Use base_price for variant products
            price = parseFloat(product.base_price || 0);
            discountPrice = parseFloat(product.discount_price || 0);
        } else {
            // 🔴 FIXED: Use base_price for non-variant products
            price = parseFloat(product.base_price || 0);
            discountPrice = parseFloat(product.discount_price || 0);
        }
        
        // 🔴 FIXED: Check if discount_price exists and is less than base_price
        if (discountPrice > 0 && price > 0 && discountPrice < price) {
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

    // Format price in PKR
    const formatPrice = (price) => {
        if (!price || price === 0) return "PKR 0";
        const numPrice = parseFloat(price);
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    // 🔴 FIXED: Get final price to display
    const getFinalPrice = () => {
        // First check if there's a discount
        const discount = calculateDiscount(product);
        if (discount) {
            return discount.discountedPrice;
        }
        
        // If no discount, check for variants
        const hasVariants = product.has_variants || (product.variants && product.variants.length > 0);
        if (hasVariants) {
            // For variants, use display_price or min price from variants
            if (product.variants && product.variants.length > 0) {
                const variantPrices = product.variants.map(v => parseFloat(v.discount_price || v.price || 0));
                return Math.min(...variantPrices);
            }
            return parseFloat(product.display_price || 0);
        }
        
        // For non-variant products without discount
        return parseFloat(product.base_price || product.display_price || 0);
    };

    // 🔴 FIXED: Get base/original price
    const getBasePrice = () => {
        // Check variants first
        const hasVariants = product.has_variants || (product.variants && product.variants.length > 0);
        if (hasVariants) {
            if (product.variants && product.variants.length > 0) {
                const variantPrices = product.variants.map(v => parseFloat(v.price || 0));
                return Math.max(...variantPrices);
            }
            return parseFloat(product.base_price || 0);
        }
        
        return parseFloat(product.base_price || 0);
    };

    const hasVariants = product.has_variants || (product.variants && product.variants.length > 0);
    
    const getAvailableSizes = () => {
        if (!hasVariants) return [];
        const sizes = product.variants?.map(v => v.size).filter(Boolean) || [];
        return [...new Set(sizes)].slice(0, 3);
    };
    
    const getAvailableColors = () => {
        if (!hasVariants) return [];
        const colors = product.variants?.map(v => v.color).filter(Boolean) || [];
        return [...new Set(colors)].slice(0, 3);
    };

    // Generate FOMO data
    const itemsLeft = Math.min(product.stock || 20, Math.floor(Math.random() * 20) + 1);
    const soldToday = Math.floor(Math.random() * 100) + 50;
    const discount = calculateDiscount(product);
    const isHot = Math.random() > 0.7;
    const isFlashSale = discount && discount.percentage >= 20;
    const basePrice = getBasePrice();
    const finalPrice = getFinalPrice();
    
    // 🔴 FIXED: Handle add to cart
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (hasVariants) {
            window.open(`/product/${product.slug}`, '_blank');
            return;
        }
        
        const success = await addToCart(product, 1);
        if (success) {
            console.log('Added to cart:', product.title);
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden">
            {/* FOMO Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {discount && discount.percentage > 0 && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        {discount.percentage}% OFF
                    </div>
                )}
                {isHot && (
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <FaFire /> HOT
                    </div>
                )}
                {isFlashSale && (
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        ⚡ FLASH SALE
                    </div>
                )}
                {hasVariants && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <FaPalette /> Options
                    </div>
                )}
            </div>

            {/* Low Stock Warning */}
            {itemsLeft <= 10 && (
                <div className="absolute top-3 right-3 z-10 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaClock /> Only {itemsLeft} left!
                </div>
            )}

            {/* Product Image */}
            <Link to={`/product/${product.slug}`}>
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                        src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button 
                            onClick={handleAddToCart}
                            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-[#FF5C00] text-white p-3 rounded-full hover:bg-[#E55100] shadow-lg"
                            title={hasVariants ? "View Options" : "Add to cart"}
                        >
                            <FaShoppingCart size={20} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                    {/* Category */}
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                        {product.category_name || 'General'}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 h-14 group-hover:text-[#FF5C00] transition-colors">
                        {product.title}
                        {hasVariants && (
                            <span className="text-xs text-gray-500 ml-2">(Multiple Options)</span>
                        )}
                    </h3>

                    {/* Variant Options Preview */}
                    {hasVariants && (
                        <div className="mb-3">
                            {/* Sizes Preview */}
                            {getAvailableSizes().length > 0 && (
                                <div className="flex items-center gap-2 mb-2">
                                    <FaRuler className="text-gray-400 text-xs" />
                                    <div className="flex gap-1">
                                        {getAvailableSizes().map((size, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {size}
                                            </span>
                                        ))}
                                        {getAvailableSizes().length > 3 && (
                                            <span className="text-xs text-gray-500">+{getAvailableSizes().length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Colors Preview */}
                            {getAvailableColors().length > 0 && (
                                <div className="flex items-center gap-2 mb-2">
                                    <FaPalette className="text-gray-400 text-xs" />
                                    <div className="flex gap-1">
                                        {getAvailableColors().map((color, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {color}
                                            </span>
                                        ))}
                                        {getAvailableColors().length > 3 && (
                                            <span className="text-xs text-gray-500">+{getAvailableColors().length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <FaStar 
                                    key={i} 
                                    size={14} 
                                    className={i < Math.floor(product.average_rating || 0) ? 'fill-current' : 'text-gray-300'}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                            ({product.average_rating?.toFixed(1) || '0.0'})
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                            ({product.review_count || 0})
                        </span>
                    </div>

                    {/* 🔴 FIXED: Price Display */}
                    <div className="mb-4">
                        <div className="text-2xl font-bold text-[#1A1A1A]">
                            {formatPrice(finalPrice)}
                        </div>
                        
                        {/* Show original price only if there's a discount */}
                        {discount && discount.percentage > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(discount.originalPrice)}
                                </span>
                                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                    Save {formatPrice(discount.savings)}
                                </span>
                            </div>
                        )}
                        
                        {/* Price Range for Variants */}
                        {hasVariants && product.variants && product.variants.length > 1 && !discount && (
                            <div className="text-sm text-gray-500 mt-1">
                                From {formatPrice(finalPrice)}
                            </div>
                        )}
                    </div>

                    {/* Progress Bar for Popular Items */}
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span className="flex items-center gap-1">
                                <FaUsers size={10} /> {soldToday} sold today
                            </span>
                            <span>{Math.floor(Math.random() * 50) + 50}% claimed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-[#FF5C00] to-orange-400 h-2 rounded-full" 
                                style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            🚚 Free shipping over PKR 2000
                        </span>
                        <span className="text-green-600 font-bold">
                            🇵🇰 Pakistan
                        </span>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <div className="px-5 pb-5">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-3 rounded-xl hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <FaShoppingCart />
                    {hasVariants ? 'View Options' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;