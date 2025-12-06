import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, 
    FaEye, FaEyeSlash, FaCheck, FaArrowRight, FaGift,
    FaShieldAlt, FaTruck, FaStar, FaShoppingBag, FaPercent
} from 'react-icons/fa';

const Register = () => {
    const { register, loading, authError } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!acceptTerms) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        // Prepare registration data
        const registrationData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            username: formData.email // Using email as username
        };

        const result = await register(registrationData);
        
        if (result.success) {
            toast.success(
                <div>
                    <div className="font-bold">🎉 Welcome to PrimaryOrder!</div>
                    <div className="text-sm">Your account has been created successfully!</div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "colored",
                }
            );
            
            // Auto-login and redirect
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            toast.error(result.error || 'Registration failed. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return 0;
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Brand Bar */}
            <div className="bg-[#1A1A1A] text-white">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="text-2xl text-[#FF5C00]">
                                <FaShoppingBag />
                            </div>
                            <span className="text-xl font-bold">PrimaryOrder</span>
                        </Link>
                        <div className="text-sm">
                            <span className="text-gray-400">Already have an account? </span>
                            <Link to="/login" className="text-[#FF5C00] font-bold hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Left Column - Registration Form */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-3">
                                Join PrimaryOrder 🎉
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Create your account and start shopping smarter
                            </p>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <FaUser />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

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
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full border-2 border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>


                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
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
                                
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-2 mt-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Password strength:</span>
                                            <span className={`font-bold ${
                                                passwordStrength === 0 ? 'text-red-500' :
                                                passwordStrength === 1 ? 'text-orange-500' :
                                                passwordStrength === 2 ? 'text-yellow-500' :
                                                'text-green-500'
                                            }`}>
                                                {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    strengthColors[passwordStrength - 1] || 'bg-red-500'
                                                }`}
                                                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCheck className={`text-xs ${
                                                    formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'
                                                }`} />
                                                <span>8+ characters</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCheck className={`text-xs ${
                                                    /[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'
                                                }`} />
                                                <span>Uppercase letter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCheck className={`text-xs ${
                                                    /[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'
                                                }`} />
                                                <span>Number</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCheck className={`text-xs ${
                                                    /[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'
                                                }`} />
                                                <span>Special character</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        className={`w-full border-2 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                            formData.confirmPassword && formData.password !== formData.confirmPassword
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 focus:border-[#FF5C00] focus:ring-[#FF5C00]/20'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <div className="text-red-500 text-sm mt-1 animate-shake">
                                        Passwords do not match
                                    </div>
                                )}
                            </div>



                            {/* Terms & Conditions */}
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        className="w-5 h-5 mt-1 rounded border-gray-300 text-[#FF5C00] focus:ring-[#FF5C00]"
                                    />
                                    <label htmlFor="terms" className="ml-2 text-gray-700 text-sm">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-[#FF5C00] hover:underline font-medium">
                                            Terms of Service
                                        </Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className="text-[#FF5C00] hover:underline font-medium">
                                            Privacy Policy
                                        </Link>
                                        . I understand that my data will be processed securely.
                                    </label>
                                </div>

                                {authError && (
                                    <div className="text-red-500 text-sm font-medium animate-shake p-3 bg-red-50 rounded-lg">
                                        {authError}
                                    </div>
                                )}
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading || !acceptTerms}
                                className={`w-full bg-gradient-to-r from-[#FF5C00] to-orange-500 text-white font-bold py-4 rounded-xl text-lg hover:from-[#E55100] hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                                    (loading || !acceptTerms) && 'opacity-70 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="text-center pt-8 mt-8 border-t">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-[#FF5C00] font-bold hover:text-[#E55100] hover:underline"
                                >
                                    Sign In Now
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Benefits & FOMO */}
                    <div className="space-y-8">
                        {/* Welcome Offer */}
                        <div className="bg-gradient-to-r from-[#FF5C00] to-orange-500 rounded-3xl p-8 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <FaGift className="text-2xl" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">WELCOME OFFER</div>
                                    <div className="text-sm opacity-90">For new members only</div>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-4">
                                20% OFF + Free Shipping 🎁
                            </h3>
                            <p className="mb-6 opacity-90">
                                Create your account today and get instant benefits on your first purchase!
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/20 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold">20%</div>
                                    <div className="text-sm">First Order</div>
                                </div>
                                <div className="bg-white/20 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold">FREE</div>
                                    <div className="text-sm">Shipping</div>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                                ✨ Why Join PrimaryOrder?
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <FaTruck className="text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Fast & Free Delivery</div>
                                        <div className="text-gray-600 text-sm">Free shipping on orders over PKR 2,000</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <FaShieldAlt className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Secure Shopping</div>
                                        <div className="text-gray-600 text-sm">100% safe & protected transactions</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <FaPercent className="text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Exclusive Deals</div>
                                        <div className="text-gray-600 text-sm">Member-only discounts & early access</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <FaStar className="text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Rewards Program</div>
                                        <div className="text-gray-600 text-sm">Earn points on every purchase</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-6">📈 Join Our Community</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">100K+</div>
                                    <div className="text-sm opacity-90">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">50K+</div>
                                    <div className="text-sm opacity-90">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">4.8★</div>
                                    <div className="text-sm opacity-90">Average Rating</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">24/7</div>
                                    <div className="text-sm opacity-90">Support</div>
                                </div>
                            </div>
                        </div>

                        {/* FOMO Banner */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-green-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">
                                🔥 LIMITED TIME
                            </div>
                            <div className="relative z-10 pt-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    Don't Miss Out!
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Register now to get exclusive access to flash sales and limited stock items.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span>124 people joined today</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-500 text-sm">
                    <p className="mb-2">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-[#FF5C00] hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-[#FF5C00] hover:underline">Privacy Policy</Link>
                    </p>
                    <p>© 2024 PrimaryOrder. Shop Smart. Shop Primary.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;