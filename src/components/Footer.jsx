import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-[#FF5C00]">Primary<span className="text-white">Order</span></h2>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner for quality products. We deliver excellence with every order, 
              ensuring customer satisfaction and premium shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-full hover:bg-[#FF5C00] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-full hover:bg-[#FF5C00] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-full hover:bg-[#FF5C00] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-full hover:bg-[#FF5C00] transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-full hover:bg-[#FF5C00] transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FF5C00]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>



          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[#FF5C00]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-[#FF5C00] mt-1" />
                <span className="text-gray-400">Kasur , Punjab, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-[#FF5C00]" />
                <span className="text-gray-400">+92 313 147 1263</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaWhatsapp className="text-[#FF5C00]" />
                <span className="text-gray-400">+92 313 147 1263</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-[#FF5C00]" />
                <span className="text-gray-400">saimpkf@gmail.com</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4 text-[#FF5C00]">Newsletter</h4>
              <p className="text-gray-400 mb-3">Subscribe for updates & offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                />
                <button className="bg-[#FF5C00] px-4 py-2 rounded-r-lg font-bold hover:bg-[#E55100] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Legal Links */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/shipping-policy" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
              Shipping Policy
            </Link>
            <Link to="/return-refund-policy" className="text-gray-400 hover:text-[#FF5C00] transition-colors">
              Return & Refund Policy
            </Link>

          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} PrimaryOrder. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Secure Payments:</span>
                <div className="flex space-x-2">
                  <div className="bg-white p-1 rounded">
                    <span className="text-xs font-bold text-gray-900">VISA</span>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <span className="text-xs font-bold text-gray-900">MC</span>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <span className="text-xs font-bold text-gray-900">PP</span>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">
                <span className="text-green-500">●</span> 24/7 Support
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <div className="text-2xl text-[#FF5C00] font-bold">✓</div>
              <div className="text-xs text-gray-400 mt-1">Secure Payment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#FF5C00] font-bold">✓</div>
              <div className="text-xs text-gray-400 mt-1">Quality Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#FF5C00] font-bold">✓</div>
              <div className="text-xs text-gray-400 mt-1">Free Shipping*</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#FF5C00] font-bold">✓</div>
              <div className="text-xs text-gray-400 mt-1">Easy Returns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#FF5C00] font-bold">✓</div>
              <div className="text-xs text-gray-400 mt-1">24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-[#FF5C00] text-white p-3 rounded-full shadow-lg hover:bg-[#E55100] transition-colors z-50"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;