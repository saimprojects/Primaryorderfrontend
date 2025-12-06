import React from 'react';
import { FaShieldAlt, FaLock, FaUserShield, FaCookie, FaEye, FaDatabase, FaUserCheck } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy <span className="text-[#FF5C00]">Policy</span>
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Introduction */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to <span className="font-bold text-[#FF5C00]">PrimaryOrder</span> ("we," "our," "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <span className="font-bold">primaryorder.com</span>.
            </p>
            <p className="text-gray-700">
              By using our website, you consent to the data practices described in this policy. If you do not agree with the terms of this policy, please do not access the site.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaDatabase className="text-[#FF5C00]" />
              2. Information We Collect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUserCheck className="text-blue-500" />
                  Personal Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Full name and contact details</li>
                  <li>• Email address and phone number</li>
                  <li>• Shipping and billing addresses</li>
                  <li>• Payment information (processed securely)</li>
                  <li>• Account credentials</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaEye className="text-green-500" />
                  Technical Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• IP address and browser type</li>
                  <li>• Device information and operating system</li>
                  <li>• Pages visited and time spent</li>
                  <li>• Referring website addresses</li>
                  <li>• Cookies and tracking data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaUserShield className="text-[#FF5C00]" />
              3. How We Use Your Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="text-blue-500 font-bold text-xl">01</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Order Processing</h4>
                  <p className="text-gray-700">To process and fulfill your orders, including shipping and delivery</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="text-green-500 font-bold text-xl">02</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Customer Support</h4>
                  <p className="text-gray-700">To provide customer service and respond to your inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl">
                <div className="text-yellow-500 font-bold text-xl">03</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Personalization</h4>
                  <p className="text-gray-700">To personalize your shopping experience and show relevant products</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="text-purple-500 font-bold text-xl">04</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Security</h4>
                  <p className="text-gray-700">To protect against fraud and ensure website security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaLock className="text-[#FF5C00]" />
              4. Data Protection & Security
            </h2>
            
            <div className="bg-gray-900 text-white p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <FaLock className="text-2xl text-green-400" />
                <h3 className="text-xl font-bold">We Implement Security Measures</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">SSL</div>
                  <p className="text-gray-300">256-bit Encryption</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">PCI</div>
                  <p className="text-gray-300">DSS Compliant</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">GDPR</div>
                  <p className="text-gray-300">Data Protection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaCookie className="text-[#FF5C00]" />
              5. Cookies Policy
            </h2>
            
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-3">Types of Cookies We Use</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900">Essential Cookies</h4>
                  <p className="text-gray-700">Required for the website to function properly</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Performance Cookies</h4>
                  <p className="text-gray-700">Help us understand how visitors interact with our website</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Functional Cookies</h4>
                  <p className="text-gray-700">Enable enhanced functionality and personalization</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-gray-700">
                  You can control cookies through your browser settings. However, disabling cookies may affect your experience on our website.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-2">Email</h3>
                <p>saimpkf@gmail.com</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Phone</h3>
                <p>+92 313 147 1263</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Website</h3>
                <p>primaryorder.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;