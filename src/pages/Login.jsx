import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaApple,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaGift,
  FaShoppingBag,
  FaStar,
  FaUserPlus,
  FaArrowCircleRight,
  FaPlusCircle,
  FaCheckCircle,
  FaRocket
} from "react-icons/fa";

const Login = () => {
    const { login, loading, authError } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        const result = await login(email, password);
        
        if (result.success) {
            toast.success('Welcome back! Shopping continues...', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            
            // Redirect to previous page or home
            const from = new URLSearchParams(window.location.search).get('from') || '/';
            navigate(from);
        } else {
            toast.error(result.error || 'Login failed. Please check your credentials.', {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
        }
    };

    // Demo credentials for testing
    const handleDemoLogin = (role) => {
        if (role === 'user') {
            setEmail('user@primaryorder.com');
            setPassword('password123');
        } else if (role === 'admin') {
            setEmail('admin@primaryorder.com');
            setPassword('admin123');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Brand Bar - Enhanced with stronger register CTA */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] text-white shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="text-3xl text-[#FF5C00] group-hover:scale-110 transition-transform duration-300">
                                <FaShoppingBag />
                            </div>
                            <div>
                                <span className="text-2xl font-bold block">PrimaryOrder</span>
                                <span className="text-xs text-gray-300">Premium Shopping Experience</span>
                            </div>
                        </Link>
                        
                        {/* Prominent Register Button */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-right">
                                <p className="text-sm text-gray-300">New to PrimaryOrder?</p>
                                <p className="text-lg font-bold text-white">Join thousands of happy shoppers</p>
                            </div>
                            <Link 
                                to="/register" 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group whitespace-nowrap"
                            >
                                <FaUserPlus className="text-xl" />
                                <span className="font-extrabold">CREATE FREE ACCOUNT</span>
                                <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Register Banner */}
            <div className="md:hidden bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <FaPlusCircle />
                            </div>
                            <div>
                                <p className="font-bold text-sm">NEW HERE? GET STARTED!</p>
                                <p className="text-xs opacity-90">Create account in 30 seconds</p>
                            </div>
                        </div>
                        <Link 
                            to="/register" 
                            className="bg-white text-[#FF5C00] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 text-sm shadow-md"
                        >
                            SIGN UP FREE
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
                    {/* Left Column - Login Form with Prominent Register CTA */}
                    <div className="space-y-8">
                        {/* Prominent Register Card for New Users */}
                        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                            {/* Animated Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 translate-y-20"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-white/30 p-3 rounded-full">
                                        <FaRocket className="text-2xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">New to PrimaryOrder?</h2>
                                        <p className="text-white/90">Join our community of happy shoppers</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                        <div className="font-bold text-lg">🚀 Quick Setup</div>
                                        <div className="text-sm opacity-90">30 seconds registration</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                        <div className="font-bold text-lg">🎁 Welcome Bonus</div>
                                        <div className="text-sm opacity-90">Get 20% OFF first order</div>
                                    </div>
                                </div>
                                
                                <Link 
                                    to="/register" 
                                    className="block w-full bg-white text-[#FF5C00] font-extrabold text-center py-4 rounded-xl text-lg hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                                >
                                    <span>CREATE YOUR FREE ACCOUNT</span>
                                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                                
                                <p className="text-center mt-4 text-sm opacity-90">
                                    No credit card required • 100,000+ members
                                </p>
                            </div>
                        </div>

                        {/* Login Form Card */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            {/* Header with Enhanced New Account Visibility */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                                    Welcome Back! 👋
                                </h1>
                                
                                {/* Enhanced "Create New Account" Section - MADE MORE VISIBLE */}
                                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl shadow-sm">
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaPlusCircle className="text-emerald-600 text-lg" />
                                            <span className="text-lg font-bold text-emerald-800">
                                                Don't have an account?
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCheckCircle className="text-green-600" />
                                            <span className="text-sm text-emerald-700 font-medium">
                                                Create one in 30 seconds!
                                            </span>
                                        </div>
                                    </div>
                                    <Link 
                                        to="/register" 
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg animate-pulse"
                                    >
                                        <FaUserPlus />
                                        <span className="font-extrabold">CREATE A NEW ACCOUNT</span>
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                
                                <p className="text-gray-600 text-lg">
                                    Sign in to continue your shopping journey
                                </p>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaEnvelope />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-gray-700 font-medium">
                                            Password
                                        </label>
                                        <Link 
                                            to="/forgot-password" 
                                            className="text-sm text-[#FF5C00] hover:underline font-medium"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaLock />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Error */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#FF5C00] focus:ring-[#FF5C00]"
                                        />
                                        <label htmlFor="remember" className="ml-2 text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    
                                    {authError && (
                                        <div className="text-red-500 text-sm font-medium animate-shake">
                                            {authError}
                                        </div>
                                    )}
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                                        loading && 'opacity-70 cursor-not-allowed'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <FaArrowRight />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center my-8">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="mx-4 text-gray-500 font-medium">OR CONTINUE WITH</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
                                    <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium hidden sm:inline">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 group">
                                    <FaFacebookF className="text-blue-600 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium hidden sm:inline">Facebook</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 hover:border-gray-800 hover:bg-gray-50 transition-all duration-300 group">
                                    <FaApple className="text-gray-800 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium hidden sm:inline">Apple</span>
                                </button>
                            </div>

                            {/* Enhanced Register Link */}
                            <div className="text-center pt-6 border-t border-gray-200">
                                <div className="mb-4">
                                    <p className="text-gray-600 text-lg font-semibold mb-2">
                                        Ready to join PrimaryOrder?
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Create your account and unlock exclusive benefits
                                    </p>
                                </div>
                                <Link 
                                    to="/register" 
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-bounce-slow"
                                >
                                    <FaUserPlus className="text-xl" />
                                    <span className="font-extrabold">CREATE A NEW ACCOUNT</span>
                                    <FaArrowRight />
                                </Link>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>Free</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>Quick</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>Secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Benefits & FOMO */}
                    <div className="space-y-8">
                        {/* Trust Badges */}
                        <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-3xl p-8 text-white">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                Why Sign In?
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaShoppingBag className="text-2xl" />
                                    </div>
                                    <div className="font-bold">Track Orders</div>
                                    <div className="text-sm opacity-90">Real-time updates</div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaGift className="text-2xl" />
                                    </div>
                                    <div className="font-bold">Exclusive Deals</div>
                                    <div className="text-sm opacity-90">Member-only discounts</div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaTruck className="text-2xl" />
                                    </div>
                                    <div className="font-bold">Fast Checkout</div>
                                    <div className="text-sm opacity-90">Save your details</div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaShieldAlt className="text-2xl" />
                                    </div>
                                    <div className="font-bold">Secure Account</div>
                                    <div className="text-sm opacity-90">100% protected</div>
                                </div>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">
                                📊 Live Shopping Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Active shoppers now</span>
                                    <span className="font-bold text-[#FF5C00]">1,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Orders today</span>
                                    <span className="font-bold text-[#FF5C00]">892</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Products added</span>
                                    <span className="font-bold text-[#FF5C00]">156</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Flash deals active</span>
                                    <span className="font-bold text-[#FF5C00]">24</span>
                                </div>
                            </div>
                        </div>

                        {/* FOMO Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            {/* Animated background elements */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <FaGift className="text-xl" />
                                    </div>
                                    <span className="font-bold">EXCLUSIVE OFFER</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                    Login Now & Get 20% OFF!
                                </h3>
                                <p className="mb-6 opacity-90">
                                    New members get extra discount on first purchase. Limited time offer!
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="bg-white/20 px-3 py-1 rounded-full">
                                        ⏰ Ends in 24:59:59
                                    </div>
                                    <div className="bg-white/20 px-3 py-1 rounded-full">
                                        🔥 89 people claimed
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">
                                💬 What Our Customers Say
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF5C00] to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                            A
                                        </div>
                                        <div>
                                            <div className="font-bold">Ahmed R.</div>
                                            <div className="text-sm text-gray-500">Karachi</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        "Login was seamless! Ordered my phone and got it in 2 days. Amazing service!"
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            S
                                        </div>
                                        <div>
                                            <div className="font-bold">Sara K.</div>
                                            <div className="text-sm text-gray-500">Lahore</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        "Wishlist feature saved me! Got notified when my favorite dress was on sale!"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info with Register CTA */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 text-white text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Ready to Join PrimaryOrder?</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Create your free account today and start shopping from thousands of products with exclusive member benefits.
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <FaUserPlus className="text-xl" />
                        <span className="font-extrabold">CREATE A NEW ACCOUNT - IT'S FREE!</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
                
                <div className="text-center text-gray-500 text-sm">
                    <p className="mb-2">
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="text-[#FF5C00] hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-[#FF5C00] hover:underline">Privacy Policy</Link>
                    </p>
                    <p>© 2024 PrimaryOrder. All rights reserved.</p>
                </div>
            </div>
            
            {/* Add custom CSS for smooth animation */}
            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;