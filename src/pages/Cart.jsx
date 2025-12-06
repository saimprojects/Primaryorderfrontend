import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTag,
  FaClock,
  FaFire,
  FaExclamationTriangle,
  FaArrowLeft,
  FaBoxOpen,
  FaPalette,
  FaRuler,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const Cart = () => {
  const { 
    cart, 
    cartSummary,
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    loading,
    itemCount,
    getCartTotal,
    getShippingFee,
    isFreeShippingEligible
  } = useContext(CartContext);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  // Format price in PKR
  const formatPrice = (price) => {
    if (!price && price !== 0) return "PKR 0";
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // 🔥 FIXED: Update cart items when cart changes
  useEffect(() => {
    console.log("Cart Context Data:", cart);
    
    if (Array.isArray(cart)) {
      console.log("Setting cart items:", cart);
      setCartItems(cart);
    }
  }, [cart]);

  // Calculate free shipping progress
  const freeShippingThreshold = 2000;
  const freeShippingProgress = Math.min((getCartTotal() / freeShippingThreshold) * 100, 100);

  const handleRemoveItem = async (itemId, productId) => {
    setIsRemoving(true);
    try {
      await removeFromCart(itemId, productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUpdateQuantity = async (itemId, productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(itemId);
    try {
      await updateQuantity(itemId, productId, newQuantity);
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info("Please login to proceed to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5C00]"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-9xl mb-6 text-gray-300">
              <FaShoppingCart />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Start
              shopping to discover amazing deals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <FaArrowRight className="rotate-180" />
                Continue Shopping
              </button>
              <Link
                to="/categories"
                className="bg-white border-2 border-gray-300 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaTag />
                Browse Deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const calculateItemTotal = (item) => {
    let price = 0;
    
    if (item.selectedVariant) {
      price = parseFloat(item.selectedVariant.discount_price || item.selectedVariant.price || 0);
    } else if (item.product) {
      price = parseFloat(item.product.discount_price || item.product.price || item.product.base_price || 0);
    }
    
    const quantity = parseInt(item.quantity) || 0;
    return price * quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  const shipping = getShippingFee();
  const total = subtotal + shipping;
  const itemsCount = itemCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-2xl" />
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
            <div className="text-sm">
              <span className="opacity-90">{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleContinueShopping}
                className="flex items-center gap-2 text-gray-600 hover:text-[#FF5C00] transition-colors"
              >
                <FaArrowLeft />
                Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTrash />
                Clear Cart
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaTruck className="text-green-600 text-xl" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-gray-700">
                      Free Shipping Progress
                    </span>
                    <span
                      className={`font-bold ${
                        shipping === 0 ? "text-green-600" : "text-[#FF5C00]"
                      }`}
                    >
                      {shipping === 0
                        ? "🎉 You got free shipping!"
                        : `${formatPrice(freeShippingThreshold - subtotal)} more for free shipping`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {shipping === 0
                      ? "Free shipping unlocked!"
                      : `Add ${formatPrice(freeShippingThreshold - subtotal)} more to save ${formatPrice(200)} shipping fee`}
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const selectedVariant = item.selectedVariant;
                
                let price = 0;
                let stock = 0;

                if (selectedVariant) {
                  price = parseFloat(selectedVariant.discount_price || selectedVariant.price || 0);
                  stock = selectedVariant.stock || 0;
                } else {
                  price = parseFloat(product.discount_price || product.price || product.base_price || 0);
                  stock = product.stock || 0;
                }

                const quantity = parseInt(item.quantity) || 0;
                const itemTotal = price * quantity;

                return (
                  <div
                    key={item.id || product.id || index}
                    className="border-b last:border-0"
                  >
                    <div className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              product.images?.[0]?.image_url ||
                              product.images?.[0]?.image?.url ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
                            }
                            alt={product.title}
                            className="w-32 h-32 object-cover rounded-xl shadow-sm"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-[#FF5C00] transition-colors">
                                <Link to={`/product/${product.slug}`}>
                                  {product.title}
                                </Link>
                              </h3>

                              {/* Display variant info */}
                              {selectedVariant && (
                                <div className="mb-3">
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedVariant.size && (
                                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        <FaRuler size={10} /> Size:{" "}
                                        {selectedVariant.size}
                                      </span>
                                    )}
                                    {selectedVariant.color && (
                                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                        <FaPalette size={10} /> Color:{" "}
                                        {selectedVariant.color}
                                      </span>
                                    )}
                                    {selectedVariant.material && (
                                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        Material: {selectedVariant.material}
                                      </span>
                                    )}
                                    {selectedVariant.sku && (
                                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                        SKU: {selectedVariant.sku}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="text-gray-600 text-sm mb-3">
                                {product.category_name || "General"}
                              </div>
                              <div className="text-2xl font-bold text-[#FF5C00]">
                                {formatPrice(price)}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end">
                              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-3">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      product.id,
                                      quantity - 1
                                    )
                                  }
                                  disabled={quantity <= 1 || updatingItem === item.id}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <FaMinus />
                                </button>
                                <span className="px-4 py-2 font-bold min-w-[50px] text-center">
                                  {updatingItem === item.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FF5C00] mx-auto"></div>
                                  ) : (
                                    quantity
                                  )}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      product.id,
                                      quantity + 1
                                    )
                                  }
                                  disabled={updatingItem === item.id || (stock > 0 && quantity >= stock)}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                              <div className="font-bold text-gray-800">
                                {formatPrice(itemTotal)}
                              </div>
                            </div>
                          </div>

                          {/* Stock & Remove Button */}
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                              {stock > 0 ? (
                                <span className="flex items-center gap-1">
                                  <FaCheckCircle className="text-green-500" />
                                  <span className="font-bold text-green-600">
                                    {stock} available
                                  </span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <FaExclamationCircle className="text-red-500" />
                                  <span className="font-bold text-red-600">
                                    Out of stock
                                  </span>
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.id, product.id)
                              }
                              disabled={isRemoving}
                              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                              {isRemoving ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <FaTrash />
                                  Remove
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <FaShieldAlt className="text-green-600 text-2xl mx-auto mb-2" />
                <div className="font-bold text-sm">Secure Payment</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <FaUndo className="text-blue-600 text-2xl mx-auto mb-2" />
                <div className="font-bold text-sm">Easy Returns</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <FaTruck className="text-orange-600 text-2xl mx-auto mb-2" />
                <div className="font-bold text-sm">Fast Delivery</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <FaBoxOpen className="text-purple-600 text-2xl mx-auto mb-2" />
                <div className="font-bold text-sm">Gift Ready</div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={`font-bold ${
                      shipping === 0 ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    {shipping > 0 && (
                      <span className="text-xs text-gray-500 ml-2">
                        (PKR 200 fee)
                      </span>
                    )}
                  </span>
                </div>

                {/* Shipping Progress */}
                {shipping > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">
                      Add {formatPrice(freeShippingThreshold - subtotal)} more
                      for{" "}
                      <span className="text-green-600 font-bold">
                        free shipping!
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Free shipping on orders over{" "}
                      {formatPrice(freeShippingThreshold)}
                    </div>
                  </div>
                )}

                {/* Discount Code */}
                <div className="border-t pt-4">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent"
                    />
                    <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl text-[#FF5C00]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Including all taxes
                  </div>
                  {shipping === 0 && (
                    <div className="text-sm text-green-600 mt-1 font-medium">
                      ✅ Free shipping applied
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mt-6 ${
                    cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Proceed to Checkout
                  <FaArrowRight />
                </button>

                {/* Security Message */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  <FaShieldAlt className="inline mr-2 text-green-500" />
                  Your payment is secure and encrypted
                </div>
              </div>
            </div>

            {/* FOMO Banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-2xl">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-600 text-xl mt-1" />
                <div>
                  <div className="font-bold text-gray-800 mb-2">
                    ⚠️ Items in cart may sell out!
                  </div>
                  <div className="text-sm text-gray-600">
                    These popular items are selling fast. Complete your purchase
                    to secure them.
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                📦 Shipping Policy
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Standard Shipping Fee:</span>
                  <span className="font-bold">{formatPrice(200)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Shipping Threshold:</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(freeShippingThreshold)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-4 border-t pt-4">
                  • 2-5 business days delivery<br />
                  • Cash on Delivery available<br />
                  • Easy returns within 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;