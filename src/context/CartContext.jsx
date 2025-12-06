import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartSummary, setCartSummary] = useState({
        items_count: 0,
        subtotal: 0,
        shipping: 0,
        total: 0
    });

    // 🔥 **FIXED: Load cart from API**
    const fetchCartFromAPI = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            console.log('Fetching cart from API for user:', user.id);
            const res = await api.get('/cart/');
            console.log('API Cart Response Full:', res.data);
            
            const apiResponse = res.data;
            
            // Extract items from response
            const itemsFromAPI = apiResponse.items || 
                               apiResponse.cart_items || 
                               (Array.isArray(apiResponse) ? apiResponse : []);
            
            console.log('Items from API:', itemsFromAPI);
            
            // Extract summary
            if (apiResponse.summary) {
                setCartSummary({
                    items_count: apiResponse.summary.items_count || 0,
                    subtotal: apiResponse.summary.subtotal || 0,
                    shipping: apiResponse.summary.shipping || 0,
                    total: apiResponse.summary.total || 0
                });
            }
            
            // Transform API data to match frontend structure
            const formattedCart = Array.isArray(itemsFromAPI) 
                ? itemsFromAPI.map(item => ({
                    id: item.id,
                    quantity: parseInt(item.quantity) || 1,
                    product: {
                        id: item.product?.id || item.product_id,
                        title: item.product?.title || 'Unknown Product',
                        slug: item.product?.slug,
                        price: item.product?.price || item.product?.base_price || 0,
                        discount_price: item.product?.discount_price,
                        images: item.product?.images || [],
                        category_name: item.product?.category_name,
                        stock: item.product?.stock || 0,
                        has_variants: item.product?.has_variants || false
                    },
                    selectedVariant: item.variant ? {
                        id: item.variant.id,
                        size: item.variant.size,
                        color: item.variant.color,
                        material: item.variant.material,
                        sku: item.variant.sku,
                        price: item.variant.price || 0,
                        discount_price: item.variant.discount_price,
                        stock: item.variant.stock || 0
                    } : null
                }))
                : [];
            
            console.log('Formatted Cart:', formattedCart);
            setCart(formattedCart);
        } catch (err) {
            console.error('Failed to load cart from API:', err.response?.data || err.message);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 **FIXED: Load cart on user change**
    useEffect(() => {
        console.log('User changed:', user ? 'Logged in' : 'Not logged in');
        
        if (user) {
            fetchCartFromAPI();
        } else {
            // Load from localStorage for guest users
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            console.log('Local cart loaded:', localCart);
            
            // Transform local cart
            const formattedLocalCart = Array.isArray(localCart) 
                ? localCart.map(item => ({
                    id: item.id || `local_${Date.now()}`,
                    quantity: parseInt(item.quantity) || 1,
                    product: {
                        id: item.product.id,
                        title: item.product.title,
                        slug: item.product.slug,
                        price: item.product.price || item.product.base_price || 0,
                        discount_price: item.product.discount_price,
                        images: item.product.images || [],
                        category_name: item.product.category_name,
                        stock: item.product.stock || 0,
                        has_variants: item.product.has_variants || false
                    },
                    selectedVariant: item.selectedVariant || null
                }))
                : [];
            
            setCart(formattedLocalCart);
        }
    }, [user]);

    // 🔥 **FIXED: Sync local cart to server**
    const syncCart = async () => {
        if (!user) return;

        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(localCart) || localCart.length === 0) return;

        try {
            console.log('Syncing local cart to server:', localCart);
            
            const syncItems = localCart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                variant_id: item.selectedVariant?.id || null,
                variant_attributes: item.selectedVariant ? {
                    size: item.selectedVariant.size,
                    color: item.selectedVariant.color,
                    material: item.selectedVariant.material,
                    sku: item.selectedVariant.sku
                } : null
            }));
            
            await api.post('/cart/sync/', { items: syncItems });
            
            localStorage.removeItem('cart');
            await fetchCartFromAPI();
            
            toast.success('Cart synced with your account');
        } catch (err) {
            console.error('Cart sync failed:', err.response?.data || err.message);
            toast.error('Failed to sync cart with server');
        }
    };

    useEffect(() => {
        if (user) {
            syncCart();
        }
    }, [user]);

    // 🔥 **FIXED: Add to Cart function**
    const addToCart = async (product, quantity = 1, variant = null) => {
        if (!product || !product.id) {
            console.error('Invalid product:', product);
            toast.error('Invalid product');
            return false;
        }

        console.log('Adding to cart:', { product, quantity, variant });

        // Prepare cart item data
        const cartItemData = {
            product_id: product.id,
            quantity: parseInt(quantity)
        };

        if (variant && variant.id) {
            cartItemData.variant_id = variant.id;
            cartItemData.variant_attributes = {
                size: variant.size || null,
                color: variant.color || null,
                material: variant.material || null,
                sku: variant.sku || null
            };
        }

        if (user) {
            try {
                console.log('Sending to API:', cartItemData);
                
                const response = await api.post('/cart/add/', cartItemData);
                console.log('API Response:', response.data);
                
                await fetchCartFromAPI();
                
                toast.success('Product added to cart');
                return true;
            } catch (error) {
                console.error('Add to cart API error:', error.response?.data || error.message);
                
                if (error.response?.status === 400) {
                    toast.error(error.response.data.error || 'Failed to add to cart');
                } else if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                } else {
                    toast.error('Failed to add item to cart. Please try again.');
                }
                return false;
            }
        } else {
            // Guest user
            const localCart = Array.isArray(cart) ? [...cart] : [];
            
            const cartItemId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const existingItemIndex = localCart.findIndex(item => {
                if (item.product.id !== product.id) return false;
                
                if (variant && item.selectedVariant) {
                    return variant.id === item.selectedVariant.id;
                }
                
                return !variant && !item.selectedVariant;
            });

            if (existingItemIndex !== -1) {
                localCart[existingItemIndex].quantity += parseInt(quantity);
            } else {
                const newItem = {
                    id: cartItemId,
                    product: {
                        id: product.id,
                        title: product.title,
                        slug: product.slug,
                        price: variant ? (variant.price || 0) : (product.price || product.base_price || 0),
                        discount_price: variant ? variant.discount_price : product.discount_price,
                        images: product.images || [],
                        category_name: product.category_name,
                        stock: variant ? variant.stock : product.stock,
                        has_variants: product.has_variants || false
                    },
                    selectedVariant: variant ? {
                        id: variant.id,
                        size: variant.size,
                        color: variant.color,
                        material: variant.material,
                        sku: variant.sku,
                        price: variant.price || 0,
                        discount_price: variant.discount_price,
                        stock: variant.stock || 0
                    } : null,
                    quantity: parseInt(quantity)
                };
                localCart.push(newItem);
            }

            console.log('Updated local cart:', localCart);
            setCart(localCart);
            localStorage.setItem('cart', JSON.stringify(localCart));
            
            toast.success('Product added to cart');
            return true;
        }
    };

    // 🔥 **FIXED: Update Quantity (POST method use karo)**
    const updateQuantity = async (itemId, productId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(itemId, productId);
            return;
        }

        console.log('Updating quantity:', itemId, newQuantity);

        if (user) {
            try {
                // 🔥 IMPORTANT: POST method use karo kyunke aapke backend mein POST allowed hai
                await api.post('/cart/update/', { 
                    id: itemId, 
                    quantity: parseInt(newQuantity)
                });
                
                await fetchCartFromAPI();
            } catch (error) {
                console.error('Update quantity error:', error.response?.data || error.message);
                toast.error('Failed to update quantity');
            }
        } else {
            const localCart = Array.isArray(cart)
                ? cart.map(item => 
                    item.id === itemId 
                        ? { ...item, quantity: parseInt(newQuantity) } 
                        : item
                  )
                : [];
            
            setCart(localCart);
            localStorage.setItem('cart', JSON.stringify(localCart));
        }
    };

    // 🔥 **FIXED: Remove from Cart (POST method use karo)**
    const removeFromCart = async (itemId, productId) => {
        console.log('Removing item:', itemId);
        
        if (user) {
            try {
                // 🔥 IMPORTANT: POST method use karo
                await api.post('/cart/remove/', { id: itemId });
                
                await fetchCartFromAPI();
                toast.success('Item removed from cart');
            } catch (error) {
                console.error('Remove from cart error:', error.response?.data || error.message);
                toast.error('Failed to remove item');
            }
        } else {
            const localCart = Array.isArray(cart) 
                ? cart.filter(item => item.id !== itemId) 
                : [];
            
            setCart(localCart);
            localStorage.setItem('cart', JSON.stringify(localCart));
            toast.success('Item removed from cart');
        }
    };

    // 🔥 **FIXED: Clear Cart**
    const clearCart = async () => {
        if (user) {
            try {
                await api.post('/cart/clear/');
                await fetchCartFromAPI();
                toast.success('Cart cleared');
            } catch (error) {
                console.error('Clear cart error:', error.response?.data || error.message);
                toast.error('Failed to clear cart');
            }
        } else {
            setCart([]);
            localStorage.removeItem('cart');
            toast.success('Cart cleared');
        }
    };

    // Helper functions
    const itemCount = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (parseInt(item?.quantity) || 0), 0)
        : 0;

    const getCartTotal = () => {
        if (!Array.isArray(cart) || cart.length === 0) return 0;
        
        return cart.reduce((acc, item) => {
            const price = item.selectedVariant 
                ? (parseFloat(item.selectedVariant.discount_price) || parseFloat(item.selectedVariant.price) || 0)
                : (parseFloat(item.product?.discount_price) || parseFloat(item.product?.price) || 0);
            const quantity = parseInt(item.quantity) || 0;
            return acc + (price * quantity);
        }, 0);
    };

    const getShippingFee = () => {
        const total = getCartTotal();
        return total >= 2000 ? 0 : 200;
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartSummary,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            loading,
            itemCount,
            getCartTotal,
            getShippingFee,
            isFreeShippingEligible: () => getCartTotal() >= 2000
        }}>
            {children}
        </CartContext.Provider>
    );
};