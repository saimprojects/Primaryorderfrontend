import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaBoxOpen, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    // SAFEST FIX — always convert to array
    const cartItems = Array.isArray(cart) ? cart : [];
    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0), 0);

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            {/* Top Promo Bar */}
            <div className="bg-[#FF5C00] text-white">
                <div className="container mx-auto px-4">
                    <div className="py-2 text-center text-sm md:text-base">
                        <span className="font-bold">FREE SHIPPING</span> on all orders over 2000/- • <span className="font-semibold">NEW CUSTOMERS GET 20% OFF</span> 
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="flex items-center">
                            <HiOutlineShoppingBag className="text-4xl md:text-5xl text-[#FF5C00] transition-transform group-hover:scale-110 duration-300" />
                            <div className="ml-2 md:ml-3">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight">PrimaryOrder</h1>
                                <p className="text-xs md:text-sm text-gray-600 -mt-1">Shop Smart. Shop Primary</p>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Home Link */}
                        <Link 
                            to="/" 
                            className="text-[#1A1A1A] font-medium hover:text-[#FF5C00] transition-colors duration-200 px-2 py-1"
                        >
                            Home
                        </Link>

                        {/* Orders Link - Only for logged in users */}
                        {user && (
                            <Link 
                                to="/orders" 
                                className="flex items-center space-x-2 text-[#1A1A1A] font-medium hover:text-[#FF5C00] transition-colors duration-200 px-2 py-1"
                            >
                                <FaBoxOpen className="text-lg" />
                                <span>Orders</span>
                            </Link>
                        )}

                        {/* CART */}
                        <Link to="/cart" className="relative group">
                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200">
                                <div className="relative">
                                    <FaShoppingCart size={26} className="text-[#1A1A1A] group-hover:text-[#FF5C00] transition-colors duration-200" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#FF5C00] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm text-gray-600">My Cart</div>
                                    <div className="font-bold text-[#1A1A1A] text-lg">
                                        ${cartTotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* AUTH */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-[#FF5C00] bg-opacity-10 flex items-center justify-center">
                                        <span className="text-[#FF5C00] font-bold text-lg">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-[#1A1A1A]">Hi, {user.name?.split(' ')[0] || 'User'}</div>
                                        <div className="text-xs text-gray-500">Welcome back!</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={logout} 
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-[#1A1A1A] hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                    title="Logout"
                                >
                                    <FaSignOutAlt />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className="flex items-center space-x-2 px-6 py-2.5 rounded-lg border-2 border-gray-200 text-[#1A1A1A] hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all duration-200 font-medium"
                                >
                                    <FaUser />
                                    <span>Login</span>
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-6 py-2.5 rounded-lg bg-[#FF5C00] text-white hover:bg-[#E55100] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Sign Up Free
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center space-x-4">
                        {/* Mobile Cart */}
                        <Link to="/cart" className="relative p-2">
                            <FaShoppingCart size={24} className="text-[#1A1A1A]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#FF5C00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <div className="relative group">
                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                <div className="space-y-1.5">
                                    <div className="w-6 h-0.5 bg-[#1A1A1A]"></div>
                                    <div className="w-6 h-0.5 bg-[#1A1A1A]"></div>
                                    <div className="w-6 h-0.5 bg-[#1A1A1A]"></div>
                                </div>
                            </button>
                            
                            {/* Mobile Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 hidden group-hover:block">
                                <div className="p-4">
                                    {user ? (
                                        <>
                                            <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
                                                <div className="w-12 h-12 rounded-full bg-[#FF5C00] bg-opacity-10 flex items-center justify-center">
                                                    <span className="text-[#FF5C00] font-bold text-xl">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#1A1A1A]">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                            
                                            <Link 
                                                to="/orders" 
                                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-[#1A1A1A] mb-2"
                                            >
                                                <FaBoxOpen className="text-[#FF5C00]" />
                                                <span className="font-medium">My Orders</span>
                                            </Link>
                                            
                                            <button 
                                                onClick={logout} 
                                                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 mt-4"
                                            >
                                                <FaSignOutAlt />
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                to="/login" 
                                                className="block w-full text-center py-3 rounded-lg border-2 border-gray-200 text-[#1A1A1A] hover:border-[#FF5C00] hover:text-[#FF5C00] mb-3 font-medium"
                                            >
                                                Login
                                            </Link>
                                            <Link 
                                                to="/register" 
                                                className="block w-full text-center py-3 rounded-lg bg-[#FF5C00] text-white hover:bg-[#E55100] font-medium"
                                            >
                                                Sign Up Free
                                            </Link>
                                        </>
                                    )}
                                    
                                    <div className="pt-4 mt-4 border-t">
                                        <div className="text-xs text-gray-500 text-center">
                                            © 2024 PrimaryOrder
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation Links for Mobile */}
                <div className="md:hidden py-3 border-t">
                    <div className="flex items-center justify-around">
                        <Link 
                            to="/" 
                            className="flex flex-col items-center text-[#1A1A1A] hover:text-[#FF5C00] transition-colors"
                        >
                            <div className="text-2xl">🏠</div>
                            <span className="text-xs mt-1">Home</span>
                        </Link>
                        
                        {user && (
                            <Link 
                                to="/orders" 
                                className="flex flex-col items-center text-[#1A1A1A] hover:text-[#FF5C00] transition-colors"
                            >
                                <FaBoxOpen className="text-xl" />
                                <span className="text-xs mt-1">Orders</span>
                            </Link>
                        )}
                        
                        <Link 
                            to="/cart" 
                            className="flex flex-col items-center text-[#1A1A1A] hover:text-[#FF5C00] transition-colors relative"
                        >
                            <div className="relative">
                                <FaShoppingCart className="text-xl" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#FF5C00] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs mt-1">Cart</span>
                        </Link>
                        
                        {!user ? (
                            <Link 
                                to="/login" 
                                className="flex flex-col items-center text-[#1A1A1A] hover:text-[#FF5C00] transition-colors"
                            >
                                <FaUser className="text-xl" />
                                <span className="text-xs mt-1">Login</span>
                            </Link>
                        ) : (
                            <button 
                                onClick={logout}
                                className="flex flex-col items-center text-[#1A1A1A] hover:text-red-600 transition-colors"
                            >
                                <FaSignOutAlt className="text-xl" />
                                <span className="text-xs mt-1">Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Bottom Bar */}
            <div className="hidden md:block bg-gray-50 border-t">
                <div className="container mx-auto px-4">
                    <div className="py-3">
                        <div className="flex items-center justify-center space-x-8">
                            <Link to="/" className="text-[#1A1A1A] font-medium hover:text-[#FF5C00] transition-colors">Home</Link>
                            <Link to="/products" className="text-[#1A1A1A] hover:text-[#FF5C00] transition-colors">All Products</Link>
                            <Link to="/products" className="text-[#FF5C00] font-bold">🔥 Today's Deals</Link>
                            <Link to="/products" className="text-[#1A1A1A] hover:text-[#FF5C00] transition-colors">Trending</Link>
                            <Link to="/contact" className="text-[#1A1A1A] hover:text-[#FF5C00] transition-colors">Help Center</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;