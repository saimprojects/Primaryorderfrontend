import React from 'react';
import { FaGavel, FaUser, FaShoppingCart, FaCreditCard, FaBan, FaExclamationTriangle, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaGavel className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & <span className="text-[#FF5C00]">Conditions</span>
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Acceptance Notice */}
          <div className="mb-10 bg-blue-50 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-2xl text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Acceptance of Terms</h3>
                <p className="text-gray-700">
                  By accessing and using <span className="font-bold text-[#FF5C00]">primaryorder.com</span>, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our website.
                </p>
              </div>
            </div>
          </div>

          {/* Account Terms */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaUser className="text-[#FF5C00]" />
              1. Account Terms
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Account Creation</h4>
                <p className="text-gray-700">
                  You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Account Security</h4>
                <p className="text-gray-700">
                  You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Account Termination</h4>
                <p className="text-gray-700">
                  We reserve the right to terminate accounts that violate our terms or engage in fraudulent activities.
                </p>
              </div>
            </div>
          </div>

          {/* Ordering & Pricing */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaShoppingCart className="text-[#FF5C00]" />
              2. Ordering & Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Order Confirmation
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Orders are confirmed via email/SMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>We reserve the right to cancel any order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Prices are subject to change without notice</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-yellow-500" />
                  Pricing & Payment
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">$</span>
                    <span>All prices are in Pakistani Rupees (₨)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">$</span>
                    <span>We accept cash on delivery & online payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">$</span>
                    <span>Payment must be completed for order processing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaBan className="text-[#FF5C00]" />
              3. Prohibited Activities
            </h2>
            
            <div className="bg-red-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Strictly Prohibited</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Fraudulent transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Using others' payment methods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Creating fake accounts</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Website Misuse</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Hacking or unauthorized access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Spamming or phishing attempts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Copying website content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Limitation of Liability</h2>
            
            <div className="bg-gray-900 text-white p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <FaExclamationTriangle className="text-2xl text-yellow-400" />
                <h3 className="text-xl font-bold">Important Disclaimer</h3>
              </div>
              
              <div className="space-y-4">
                <p>
                  <span className="font-bold">PrimaryOrder</span> shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the website.
                </p>
                <p>
                  We are not responsible for delays caused by third-party shipping carriers, natural disasters, or events beyond our control.
                </p>
                <p>
                  Our total liability shall not exceed the amount paid for the product in question.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Governing Law</h2>
            
            <div className="p-6 border-2 border-gray-200 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <FaGavel className="text-2xl text-[#FF5C00]" />
                <div>
                  <h3 className="font-bold text-gray-900">Jurisdiction</h3>
                  <p className="text-gray-600">These terms are governed by the laws of Pakistan</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Any disputes shall be resolved in the courts of Pakistan. By using our website, you submit to the jurisdiction of these courts.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Changes to Terms</h2>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <FaQuestionCircle className="text-2xl text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Updates & Modifications</h3>
                  <p className="text-gray-700 mb-4">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-700 font-medium">
                      It is your responsibility to review these terms periodically for changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <h3 className="font-bold mb-2">Company Name</h3>
                <p>PrimaryOrder</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold mb-2">Email</h3>
                <p>saimpkf@gmail.com</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold mb-2">Phone</h3>
                <p>+92 313 147 1263</p>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold mb-2">Website</h3>
              <p className="text-xl">primaryorder.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;