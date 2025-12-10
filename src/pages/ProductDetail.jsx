import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { 
    FaStar, FaShoppingCart, FaTruck, FaShieldAlt, FaUndo, 
    FaClock, FaFire, FaPercent, FaUsers, FaEye, 
    FaChevronRight, FaChevronLeft, FaTag, FaCrown, 
    FaShareAlt, FaHeart, FaBoxOpen, FaCheckCircle, 
    FaRegHeart, FaRegStar, FaStarHalfAlt,
    FaPalette, FaRuler, FaLayerGroup, FaExclamationTriangle,
    FaWhatsapp
} from "react-icons/fa";

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    // 🔥 UPDATED: Variants State
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [availableVariants, setAvailableVariants] = useState([]);
    const [filteredVariants, setFilteredVariants] = useState([]);
    const [variantImages, setVariantImages] = useState([]);
    
    // FOMO states
    const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 100) + 50);
    const [stockLeft, setStockLeft] = useState(0);
    const saleEndTime = useRef(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

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

    // 🔥 UPDATED: Fetch product with variants
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                
                // Fetch product details with variants
                const productRes = await api.get(`/products/${slug}/`);
                const productData = productRes.data;
                setProduct(productData);
                
                // Set variants data
                if (productData.has_variants && productData.variants && productData.variants.length > 0) {
                    setAvailableVariants(productData.variants || []);
                    
                    // Reset selections
                    setSelectedVariant(null);
                    setSelectedSize("");
                    setSelectedColor("");
                    setSelectedMaterial("");
                    
                    // Get unique available options
                    const sizes = [...new Set(productData.variants.map(v => v.size).filter(Boolean))];
                    const colors = [...new Set(productData.variants.map(v => v.color).filter(Boolean))];
                    const materials = [...new Set(productData.variants.map(v => v.material).filter(Boolean))];
                    
                    // Set initial filtered variants (all in stock)
                    const initialFiltered = productData.variants.filter(v => v.stock > 0);
                    setFilteredVariants(initialFiltered);
                    
                    // Auto-select first available variant
                    if (initialFiltered.length > 0) {
                        const firstVariant = initialFiltered[0];
                        setSelectedVariant(firstVariant);
                        setSelectedSize(firstVariant.size || "");
                        setSelectedColor(firstVariant.color || "");
                        setSelectedMaterial(firstVariant.material || "");
                        setStockLeft(firstVariant.stock);
                        
                        // Set images
                        setVariantImages(
                            firstVariant.images && firstVariant.images.length > 0 
                                ? firstVariant.images 
                                : productData.images || []
                        );
                    }
                    
                } else {
                    // For non-variant products
                    setStockLeft(productData.stock || 20);
                    setVariantImages(productData.images || []);
                }
                
                // Fetch related products (by category)
                if (productData.category) {
                    try {
                        const relatedRes = await api.get(`/products/?category=${productData.category_slug || productData.category}`);
                        const relatedData = relatedRes.data?.results || relatedRes.data || [];
                        setRelatedProducts(
                            relatedData
                                .filter(p => p.id !== productData.id)
                                .slice(0, 4)
                        );
                    } catch (error) {
                        console.log('Error fetching related products:', error);
                    }
                }

                // Simulate decreasing stock
                const stockInterval = setInterval(() => {
                    setStockLeft(prev => {
                        if (prev > 1 && Math.random() > 0.9) {
                            const newStock = prev - 1;
                            if (newStock <= 3) {
                                toast.warning(
                                    <div>
                                        <div className="font-bold">⚠️ Low Stock Alert!</div>
                                        <div className="text-sm">Only {newStock} items left at this price!</div>
                                    </div>,
                                    { autoClose: 5000 }
                                );
                            }
                            return newStock;
                        }
                        return prev;
                    });
                }, 30000);

                // Simulate viewer count changes
                const viewerInterval = setInterval(() => {
                    setViewerCount(prev => {
                        const change = Math.floor(Math.random() * 3) - 1;
                        return Math.max(1, prev + change);
                    });
                }, 20000);

                return () => {
                    clearInterval(stockInterval);
                    clearInterval(viewerInterval);
                };

            } catch (err) {
                console.error("Error fetching product:", err);
                toast.error("Product not found!");
                navigate("/products");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [slug, navigate]);

    // 🔥 UPDATED: Handle variant selection
    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        setSelectedSize(variant.size || "");
        setSelectedColor(variant.color || "");
        setSelectedMaterial(variant.material || "");
        setStockLeft(variant.stock || 0);
        setQuantity(1);
        
        // Update images based on variant
        if (variant.images && variant.images.length > 0) {
            setVariantImages(variant.images);
        } else if (product && product.images) {
            setVariantImages(product.images);
        }
        setActiveImageIndex(0);
    };

    // 🔥 UPDATED: Handle size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        
        // Filter variants based on selected attributes
        let filtered = availableVariants;
        
        if (size) {
            filtered = filtered.filter(v => v.size === size);
        }
        if (selectedColor) {
            filtered = filtered.filter(v => v.color === selectedColor);
        }
        if (selectedMaterial) {
            filtered = filtered.filter(v => v.material === selectedMaterial);
        }
        
        // Filter for available stock
        filtered = filtered.filter(v => v.stock > 0);
        setFilteredVariants(filtered);
        
        // Auto-select first available variant after filtering
        if (filtered.length > 0) {
            const availableVariant = filtered[0];
            if (availableVariant && availableVariant.id !== selectedVariant?.id) {
                handleVariantSelect(availableVariant);
            }
        } else {
            // No variants available with these filters
            setSelectedVariant(null);
            setStockLeft(0);
            toast.warning("No variants available with these options. Please select different options.");
        }
    };

    // 🔥 UPDATED: Handle color selection
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        
        let filtered = availableVariants;
        
        if (color) {
            filtered = filtered.filter(v => v.color === color);
        }
        if (selectedSize) {
            filtered = filtered.filter(v => v.size === selectedSize);
        }
        if (selectedMaterial) {
            filtered = filtered.filter(v => v.material === selectedMaterial);
        }
        
        // Filter for available stock
        filtered = filtered.filter(v => v.stock > 0);
        setFilteredVariants(filtered);
        
        if (filtered.length > 0) {
            const availableVariant = filtered[0];
            if (availableVariant && availableVariant.id !== selectedVariant?.id) {
                handleVariantSelect(availableVariant);
            }
        } else {
            setSelectedVariant(null);
            setStockLeft(0);
            toast.warning("No variants available with these options. Please select different options.");
        }
    };

    // 🔥 UPDATED: Handle material selection
    const handleMaterialSelect = (material) => {
        setSelectedMaterial(material);
        
        let filtered = availableVariants;
        
        if (material) {
            filtered = filtered.filter(v => v.material === material);
        }
        if (selectedSize) {
            filtered = filtered.filter(v => v.size === selectedSize);
        }
        if (selectedColor) {
            filtered = filtered.filter(v => v.color === selectedColor);
        }
        
        // Filter for available stock
        filtered = filtered.filter(v => v.stock > 0);
        setFilteredVariants(filtered);
        
        if (filtered.length > 0) {
            const availableVariant = filtered[0];
            if (availableVariant && availableVariant.id !== selectedVariant?.id) {
                handleVariantSelect(availableVariant);
            }
        } else {
            setSelectedVariant(null);
            setStockLeft(0);
            toast.warning("No variants available with these options. Please select different options.");
        }
    };

    // 🔥 UPDATED: Get unique available sizes
    const getAvailableSizes = () => {
        if (!product?.has_variants) return [];
        return [...new Set(availableVariants
            .filter(v => v.stock > 0)
            .map(v => v.size)
            .filter(Boolean)
        )];
    };

    // 🔥 UPDATED: Get unique available colors
    const getAvailableColors = () => {
        if (!product?.has_variants) return [];
        return [...new Set(availableVariants
            .filter(v => v.stock > 0)
            .map(v => v.color)
            .filter(Boolean)
        )];
    };

    // 🔥 UPDATED: Get unique available materials
    const getAvailableMaterials = () => {
        if (!product?.has_variants) return [];
        return [...new Set(availableVariants
            .filter(v => v.stock > 0)
            .map(v => v.material)
            .filter(Boolean)
        )];
    };

    // 🔥 NEW: Reset filters
    const resetFilters = () => {
        setSelectedSize("");
        setSelectedColor("");
        setSelectedMaterial("");
        const allAvailable = availableVariants.filter(v => v.stock > 0);
        setFilteredVariants(allAvailable);
        if (allAvailable.length > 0) {
            handleVariantSelect(allAvailable[0]);
        }
    };

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = saleEndTime.current.getTime();
            const difference = target - now;

            if (difference > 0) {
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 🔥 NEW: WhatsApp Click Handler
    const handleWhatsAppClick = () => {
        const phoneNumber = "+923131471263";
        const message = `Hi! I'm interested in this product: ${product?.title || 'Product'}\n\nLink: ${window.location.href}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
    };

    // 🔥 UPDATED: Add to Cart Handler with Variants
    const handleAddToCart = async () => {
        if (!user) {
            toast.info("Please login to add items to cart!");
            navigate("/login", { state: { from: `/product/${slug}` } });
            return;
        }

        // 🔥 IMPORTANT FIX: Check for variant selection
        if (product?.has_variants && !selectedVariant) {
            toast.error("Please select a variant (size/color) first!");
            return;
        }

        if (stockLeft === 0) {
            toast.error("This variant is out of stock!");
            return;
        }

        if (quantity > stockLeft) {
            toast.error(`Only ${stockLeft} items available for this variant!`);
            return;
        }

        setAddingToCart(true);
        try {
            // Prepare product data for cart
            const cartData = {
                ...product,
                selectedVariant: selectedVariant,
                // Pass variant information
                variant: selectedVariant
            };

            const success = await addToCart(cartData, quantity, selectedVariant);
            
            if (success) {
                const variantInfo = selectedVariant 
                    ? `${selectedSize ? `Size: ${selectedSize}` : ''}${selectedColor ? `, Color: ${selectedColor}` : ''}${selectedMaterial ? `, Material: ${selectedMaterial}` : ''}`.replace(/^,\s*/, '')
                    : product.title;
                
                toast.success(
                    <div>
                        <div className="font-bold">✅ Added to Cart!</div>
                        <div className="text-sm">{variantInfo}</div>
                        <div className="text-sm">Only {stockLeft - quantity} left in stock!</div>
                    </div>,
                    {
                        autoClose: 3000,
                        theme: "colored"
                    }
                );
                
                // Decrease stock locally
                if (selectedVariant) {
                    setStockLeft(prev => Math.max(0, prev - quantity));
                }
                
                // Show low stock warning
                if (stockLeft - quantity <= 3 && stockLeft - quantity > 0) {
                    setTimeout(() => {
                        toast.warning(
                            <div>
                                <div className="font-bold">🔥 Almost Gone!</div>
                                <div className="text-sm">Only {stockLeft - quantity} items left for this variant!</div>
                            </div>,
                            { autoClose: 5000 }
                        );
                    }, 1000);
                }
            }
        } catch (err) {
            console.error("Add to cart error:", err);
            toast.error("Failed to add to cart. Please try again!");
        } finally {
            setAddingToCart(false);
        }
    };

    // 🔥 UPDATED: Buy Now Handler with Variants
    const handleBuyNow = async () => {
        if (!user) {
            toast.info("Please login to proceed!");
            navigate("/login", { state: { from: `/product/${slug}` } });
            return;
        }

        // Check variant selection
        if (product?.has_variants && !selectedVariant) {
            toast.error("Please select a variant first!");
            return;
        }

        if (stockLeft === 0) {
            toast.error("This variant is out of stock!");
            return;
        }

        if (quantity > stockLeft) {
            toast.error(`Only ${stockLeft} items available for this variant!`);
            return;
        }

        const cartData = {
            ...product,
            selectedVariant: selectedVariant,
            variant: selectedVariant
        };

        const success = await addToCart(cartData, quantity, selectedVariant);
        if (success) {
            navigate("/checkout");
        }
    };

    // Toggle Wishlist
    const toggleWishlist = () => {
        setWishlisted(!wishlisted);
        toast.success(
            !wishlisted 
                ? "❤️ Added to wishlist!" 
                : "💔 Removed from wishlist!"
        );
    };

    // Share product
    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                text: `Check out ${product.title} on PrimaryOrder!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    // Render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 fill-current" />);
        }
        
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 fill-current" />);
        }
        
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
        }
        
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#FF5C00]"></div>
                    <p className="mt-6 text-xl text-gray-600 font-medium">Loading product details...</p>
                    <p className="text-gray-500 mt-2">Fetching the best deal for you!</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                    <div className="text-9xl mb-6 text-gray-300">😕</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
                    <div className="space-y-3">
                        <Link 
                            to="/products" 
                            className="block bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E55100] transition-colors"
                        >
                            Browse Products
                        </Link>
                        <Link 
                            to="/" 
                            className="block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 🔥 UPDATED: Calculate prices based on variant or base price
    const originalPrice = selectedVariant 
        ? parseFloat(selectedVariant.price || 0)
        : parseFloat(product.base_price || product.price || 0);
    
    const discountPrice = selectedVariant 
        ? parseFloat(selectedVariant.discount_price || 0)
        : parseFloat(product.discount_price || 0);
    
    const finalPrice = discountPrice > 0 ? discountPrice : originalPrice;
    const discountPercentage = discountPrice > 0 && originalPrice > 0
        ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
        : 0;
    const savings = discountPrice > 0 ? originalPrice - discountPrice : 0;

    // 🔥 UPDATED: Use variant images or product images
    const images = variantImages.length > 0 ? variantImages : 
                  (product.images && product.images.length > 0 ? product.images : 
                  [{ image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop' }]);

    // 🔥 NEW: Check if all variants are out of stock
    const allVariantsOutOfStock = product.has_variants && 
        availableVariants.length > 0 && 
        availableVariants.every(v => v.stock === 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
            {/* 🔥 FIXED: WhatsApp Button with highest z-index */}
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

            {/* FOMO Banner */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base">
                        <span className="flex items-center gap-2">
                            <FaFire /> <span className="font-bold">FLASH SALE</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-2">
                            <FaClock /> Ends in:{" "}
                            <span className="font-mono font-bold bg-black/20 px-2 py-1 rounded">
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-2">
                            <FaEye /> <span className="font-bold">{viewerCount}</span> people viewing
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-2">
                            <FaUsers /> <span className="font-bold">{Math.floor(Math.random() * 200) + 100}</span> bought today
                        </span>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link to="/" className="hover:text-[#FF5C00] transition-colors">Home</Link>
                    <FaChevronRight className="text-xs" />
                    <Link to="/categories" className="hover:text-[#FF5C00] transition-colors">Categories</Link>
                    <FaChevronRight className="text-xs" />
                    {product.category_name && (
                        <>
                            <Link 
                                to={`/category/${product.category_slug}`}
                                className="hover:text-[#FF5C00] transition-colors"
                            >
                                {product.category_name}
                            </Link>
                            <FaChevronRight className="text-xs" />
                        </>
                    )}
                    <span className="text-gray-800 font-medium truncate">{product.title}</span>
                </nav>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group">
                            <img
                                src={images[activeImageIndex]?.image_url || images[activeImageIndex]?.image?.url}
                                alt={product.title}
                                className="w-full h-[500px] object-contain p-8"
                            />
                            
                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 space-y-2">
                                {discountPercentage > 0 && (
                                    <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-xl animate-pulse">
                                        {discountPercentage}% OFF
                                    </div>
                                )}
                                {stockLeft <= 10 && stockLeft > 0 && (
                                    <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2">
                                        <FaFire /> Only {stockLeft} left!
                                    </div>
                                )}
                                {/* 🔥 UPDATED: Variant Badge */}
                                {selectedVariant && (
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                                        <FaLayerGroup /> {selectedVariant.sku}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 space-y-2">
                                <button
                                    onClick={toggleWishlist}
                                    className="bg-white/90 hover:bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                                >
                                    {wishlisted ? (
                                        <FaHeart className="text-red-500 text-xl" />
                                    ) : (
                                        <FaRegHeart className="text-gray-600 text-xl" />
                                    )}
                                </button>
                                <button
                                    onClick={shareProduct}
                                    className="bg-white/90 hover:bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                                >
                                    <FaShareAlt className="text-gray-600 text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {images.map((img, index) => (
                                    <button
                                        key={img.id || index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative rounded-xl overflow-hidden border-4 transition-all ${
                                            activeImageIndex === index
                                                ? "border-[#FF5C00] shadow-lg"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={img.image_url || img.image?.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {product.title}
                                {selectedVariant && (
                                    <span className="text-lg text-gray-600 ml-3 font-normal">
                                        {selectedSize ? `• ${selectedSize}` : ''}
                                        {selectedColor ? ` • ${selectedColor}` : ''}
                                        {selectedMaterial ? ` • ${selectedMaterial}` : ''}
                                    </span>
                                )}
                            </h1>
                            
                            {/* 🔥 UPDATED: SKU Display */}
                            {selectedVariant && (
                                <div className="mb-3">
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                        SKU: {selectedVariant.sku}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                    {renderStars(product.average_rating || 0)}
                                    <span className="font-bold ml-1">{product.average_rating || '0.0'}</span>
                                    <span className="text-gray-600">({product.review_count || 0} reviews)</span>
                                </div>
                                <div className={`font-bold flex items-center gap-2 ${
                                    stockLeft > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <FaCheckCircle /> 
                                    {stockLeft > 0 ? 'In Stock' : 
                                     allVariantsOutOfStock ? 'All variants out of stock' : 'Out of Stock'}
                                </div>
                            </div>

                            {/* 🔥 UPDATED: Variants Selection */}
                            {product.has_variants && (
                                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-800 text-lg">Select Options:</h3>
                                        {(selectedSize || selectedColor || selectedMaterial) && (
                                            <button
                                                onClick={resetFilters}
                                                className="text-sm text-[#FF5C00] hover:text-[#E55100] font-medium"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* 🔥 NEW: Warning if all variants out of stock */}
                                    {allVariantsOutOfStock && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <FaExclamationTriangle className="text-red-500" />
                                                <div>
                                                    <div className="font-bold text-red-700">All variants are out of stock</div>
                                                    <div className="text-sm text-red-600">Please check back later</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Size Selection */}
                                    {getAvailableSizes().length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FaRuler className="text-gray-500" />
                                                <label className="font-medium text-gray-700">Size:</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {getAvailableSizes().map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => handleSizeSelect(size)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                            selectedSize === size
                                                                ? 'bg-[#FF5C00] text-white shadow-md'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF5C00]'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Selection */}
                                    {getAvailableColors().length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FaPalette className="text-gray-500" />
                                                <label className="font-medium text-gray-700">Color:</label>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {getAvailableColors().map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorSelect(color)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                                            selectedColor === color
                                                                ? 'bg-[#FF5C00] text-white shadow-md'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF5C00]'
                                                        }`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Material Selection */}
                                    {getAvailableMaterials().length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FaLayerGroup className="text-gray-500" />
                                                <label className="font-medium text-gray-700">Material:</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {getAvailableMaterials().map((material) => (
                                                    <button
                                                        key={material}
                                                        onClick={() => handleMaterialSelect(material)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                            selectedMaterial === material
                                                                ? 'bg-[#FF5C00] text-white shadow-md'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FF5C00]'
                                                        }`}
                                                    >
                                                        {material}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 🔥 UPDATED: Available Variants List */}
                                    {filteredVariants.length > 0 && (
                                        <div className="mt-4">
                                            <label className="font-medium text-gray-700 mb-2 block">Available Variants:</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2">
                                                {filteredVariants.map((variant) => (
                                                    <button
                                                        key={variant.id}
                                                        onClick={() => handleVariantSelect(variant)}
                                                        className={`p-3 rounded-lg border text-left transition-all ${
                                                            selectedVariant?.id === variant.id
                                                                ? 'border-[#FF5C00] bg-orange-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        } ${variant.stock === 0 ? 'opacity-60' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <div className="font-medium">
                                                                    {[variant.size, variant.color, variant.material]
                                                                        .filter(Boolean)
                                                                        .join(' • ')}
                                                                </div>
                                                                <div className={`text-sm ${variant.stock > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                                                                    {variant.stock > 0 ? `Stock: ${variant.stock}` : 'Out of stock'}
                                                                </div>
                                                            </div>
                                                            <div className="font-bold">
                                                                {formatPrice(variant.discount_price || variant.price)}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 🔥 NEW: No variants available message */}
                                    {filteredVariants.length === 0 && availableVariants.length > 0 && (
                                        <div className="mt-4 text-center py-4 bg-gray-100 rounded-lg">
                                            <FaExclamationTriangle className="text-yellow-500 text-xl mx-auto mb-2" />
                                            <p className="text-gray-600">No variants available with the selected options.</p>
                                            <button
                                                onClick={resetFilters}
                                                className="mt-2 text-[#FF5C00] hover:text-[#E55100] font-medium"
                                            >
                                                Clear filters to see all variants
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Seller Info */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    P
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold">Sold by PrimaryOrder</div>
                                    <div className="text-sm text-gray-600">Pakistan • 98% Positive Seller Rating</div>
                                </div>
                                <button className="text-[#FF5C00] font-bold hover:text-[#E55100]">
                                    Visit Store
                                </button>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border-2 border-orange-100">
                            <div className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">
                                    {formatPrice(finalPrice)}
                                </div>
                                
                                {discountPercentage > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl text-gray-500 line-through">
                                                {formatPrice(originalPrice)}
                                            </span>
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                                                Save {formatPrice(savings)}!
                                            </span>
                                        </div>
                                        <div className="text-green-600 font-bold text-lg">
                                            <FaPercent className="inline mr-2" />
                                            You save {discountPercentage}% ({formatPrice(savings)})
                                        </div>
                                    </div>
                                )}
                                
                                {/* 🔥 UPDATED: Price Range for Variants */}
                                {product.has_variants && product.variants && product.variants.length > 1 && (
                                    <div className="text-sm text-gray-600 mt-2">
                                        Price Range: {formatPrice(product.min_price || 0)} - {formatPrice(
                                            Math.max(...product.variants.map(v => 
                                                parseFloat(v.discount_price || v.price || 0)
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stock Warning */}
                        {stockLeft > 0 && stockLeft <= 15 && (
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 p-2 rounded-full">
                                            <FaFire className="text-red-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">
                                                {stockLeft <= 5 ? 'HURRY! Almost Gone!' : 'Limited stock available'}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {stockLeft} items left • {viewerCount} people viewing now
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000" 
                                                style={{ width: `${(stockLeft / 25) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-600 text-center mt-1">{stockLeft}/25 left</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 🔥 NEW: Variant Selection Reminder */}
                        {product.has_variants && !selectedVariant && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <FaExclamationTriangle className="text-yellow-500" />
                                    <div>
                                        <div className="font-bold text-yellow-700">Please select a variant</div>
                                        <div className="text-sm text-yellow-600">
                                            Choose size, color, or material options before adding to cart
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="space-y-6">
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Quantity:</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            disabled={stockLeft === 0}
                                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            -
                                        </button>
                                        <span className="px-6 py-3 text-xl font-bold min-w-[60px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(prev => Math.min(stockLeft, prev + 1))}
                                            disabled={stockLeft === 0}
                                            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className={`${stockLeft === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {stockLeft === 0 ? 'Out of Stock' : `Max ${stockLeft} per customer`}
                                    </div>
                                </div>
                            </div>

                            {/* 🔥 UPDATED: Add to Cart Button with Variant Check */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || stockLeft === 0 || (product.has_variants && !selectedVariant)}
                                    className={`bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                                        (addingToCart || stockLeft === 0 || (product.has_variants && !selectedVariant)) && 'opacity-70 cursor-not-allowed'
                                    }`}
                                >
                                    <FaShoppingCart />
                                    {addingToCart ? 'Adding...' : 
                                     stockLeft === 0 ? 'Out of Stock' :
                                     product.has_variants && !selectedVariant ? 'Select Variant' : 
                                     'Add to Cart'}
                                </button>
                                
                                <button
                                    onClick={handleBuyNow}
                                    disabled={stockLeft === 0 || (product.has_variants && !selectedVariant)}
                                    className={`bg-gradient-to-r from-[#1A1A1A] to-gray-800 text-white font-bold py-4 rounded-xl text-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                                        (stockLeft === 0 || (product.has_variants && !selectedVariant)) && 'opacity-70 cursor-not-allowed'
                                    }`}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <FaTruck className="text-green-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">Free Delivery</div>
                                <div className="text-xs text-gray-600">Over Rs 2000</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <FaUndo className="text-blue-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">7-Day Returns</div>
                                <div className="text-xs text-gray-600">Easy Returns</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <FaShieldAlt className="text-purple-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">Warranty</div>
                                <div className="text-xs text-gray-600">Varies by product</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <FaBoxOpen className="text-orange-600 text-2xl mx-auto mb-2" />
                                <div className="font-bold text-sm">Cash on Delivery</div>
                                <div className="text-xs text-gray-600">Available</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description & Details */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
                            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.description || 'No detailed description available.'}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                                <button 
                                    onClick={() => {
                                        if (!user) {
                                            toast.info("Please login to write a review!");
                                            navigate("/login");
                                            return;
                                        }
                                        toast.info("Review feature coming soon!");
                                    }}
                                    className="bg-[#FF5C00] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#E55100] transition-colors"
                                >
                                    Write a Review
                                </button>
                            </div>
                            
                            {/* Rating Summary */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-gray-900">{product.average_rating || '0.0'}</div>
                                        <div className="flex justify-center mt-2">
                                            {renderStars(product.average_rating || 0)}
                                        </div>
                                        <div className="text-gray-600 mt-1">{product.review_count || 0} reviews</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-gray-700 font-medium mb-2">Rating Breakdown</div>
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className="flex items-center gap-3 mb-1">
                                                <div className="text-sm w-8">{star}★</div>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-yellow-400 h-2 rounded-full" 
                                                        style={{ 
                                                            width: `${(product.reviews?.filter(r => r.stars === star).length || 0) / (product.review_count || 1) * 100}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-gray-600 w-10 text-right">
                                                    {product.reviews?.filter(r => r.stars === star).length || 0}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Reviews List */}
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {product.reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-6 last:border-0">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {review.user_name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{review.user_name || 'Anonymous'}</div>
                                                        <div className="flex text-yellow-400 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar 
                                                                    key={i} 
                                                                    className={i < review.stars ? 'fill-current' : 'text-gray-300'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {new Date(review.created_at).toLocaleDateString('en-PK', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mb-3">{review.text}</p>
                                            {review.image_url && (
                                                <img 
                                                    src={review.image_url} 
                                                    alt="Review" 
                                                    className="w-32 h-32 object-cover rounded-lg mt-2"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaRegStar className="text-5xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
                                    <button 
                                        onClick={() => {
                                            if (!user) {
                                                toast.info("Please login to write a review!");
                                                navigate("/login");
                                                return;
                                            }
                                            toast.info("Review feature coming soon!");
                                        }}
                                        className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Be the first to review
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specifications & Related Products */}
                    <div className="space-y-8">
                        {/* Specifications */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium">{product.category_name || 'N/A'}</span>
                                </div>
                                {/* 🔥 UPDATED: Stock Display */}
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">Stock:</span>
                                    <span className={`font-medium ${stockLeft > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stockLeft > 0 ? `${stockLeft} available` : 'Out of stock'}
                                    </span>
                                </div>
                                {/* 🔥 UPDATED: Variant Info */}
                                {selectedVariant && (
                                    <>
                                        <div className="flex justify-between border-b pb-3">
                                            <span className="text-gray-600">Variant SKU:</span>
                                            <span className="font-medium">{selectedVariant.sku}</span>
                                        </div>
                                        {selectedSize && (
                                            <div className="flex justify-between border-b pb-3">
                                                <span className="text-gray-600">Size:</span>
                                                <span className="font-medium">{selectedSize}</span>
                                            </div>
                                        )}
                                        {selectedColor && (
                                            <div className="flex justify-between border-b pb-3">
                                                <span className="text-gray-600">Color:</span>
                                                <span className="font-medium">{selectedColor}</span>
                                            </div>
                                        )}
                                        {selectedMaterial && (
                                            <div className="flex justify-between border-b pb-3">
                                                <span className="text-gray-600">Material:</span>
                                                <span className="font-medium">{selectedMaterial}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-medium text-green-600">
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-600">Product ID:</span>
                                    <span className="font-medium">{product.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                                <div className="space-y-4">
                                    {relatedProducts.map((related) => (
                                        <Link
                                            key={related.id}
                                            to={`/product/${related.slug}`}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                        >
                                            <img
                                                src={related.images?.[0]?.image_url || related.images?.[0]?.image?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'}
                                                alt={related.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium group-hover:text-[#FF5C00] transition-colors line-clamp-2">
                                                    {related.title}
                                                </div>
                                                {/* 🔥 UPDATED: Price Display */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="font-bold text-[#FF5C00]">
                                                        {formatPrice(
                                                            related.has_variants ? related.display_price || related.min_price || 0 : 
                                                            (related.discount_price || related.base_price || related.price || 0)
                                                        )}
                                                    </div>
                                                    {related.discount_price && related.price && (
                                                        <div className="text-sm text-gray-500 line-through">
                                                            {formatPrice(related.price)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom FOMO Banner */}
                {stockLeft > 0 && (
                    <div className="mt-16 bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-3xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">⚠️ Don't Miss Out!</h3>
                        <p className="text-xl mb-6 opacity-90">
                            {stockLeft <= 5 
                                ? `Only ${stockLeft} left at this price!` 
                                : `This price is only available for the next ${timeLeft.hours}h ${timeLeft.minutes}m`
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleAddToCart}
                                disabled={stockLeft === 0 || (product.has_variants && !selectedVariant)}
                                className={`bg-white text-[#FF5C00] px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors ${
                                    (stockLeft === 0 || (product.has_variants && !selectedVariant)) && 'opacity-70 cursor-not-allowed'
                                }`}
                            >
                                Add to Cart Now
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={stockLeft === 0 || (product.has_variants && !selectedVariant)}
                                className={`bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors ${
                                    (stockLeft === 0 || (product.has_variants && !selectedVariant)) && 'opacity-70 cursor-not-allowed'
                                }`}
                            >
                                Buy Now & Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;