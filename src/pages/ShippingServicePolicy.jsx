import React from 'react';
import { FaShippingFast, FaTruck, FaMapMarkerAlt, FaClock, FaBox, FaExclamationTriangle, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const ShippingServicePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShippingFast className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shipping & Service <span className="text-[#FF5C00]">Policy</span>
          </h1>
          <p className="text-lg text-gray-600">
            Fast, Reliable, and Transparent Shipping Services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Quick Overview */}
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">3-5 Days</div>
                <p className="text-gray-700 text-sm">Standard Delivery</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">24-48 Hours</div>
                <p className="text-gray-700 text-sm">Express Delivery</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">Free</div>
                <p className="text-gray-700 text-sm">Over ₨5,000</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">Cash on Delivery</div>
                <p className="text-gray-700 text-sm">Available</p>
              </div>
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#FF5C00]" />
              Delivery Areas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Major Cities (2-3 Days)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <span className="bg-white px-3 py-2 rounded-lg text-center">Karachi</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-center">Lahore</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-center">Islamabad</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-center">Rawalpindi</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-center">Faisalabad</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-center">Multan</span>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaTruck className="text-blue-500" />
                  Other Cities (3-5 Days)
                </h3>
                <p className="text-gray-700 mb-4">
                  We deliver to all major cities across Pakistan. Delivery time may vary based on location.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    <FaExclamationTriangle className="inline mr-2 text-yellow-500" />
                    Remote areas may take 5-7 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Methods</h2>
            
            <div className="space-y-6">
              <div className="p-6 border-2 border-green-200 rounded-xl bg-green-50">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white p-3 rounded-lg">
                    <FaTruck className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Standard Shipping</h3>
                        <p className="text-gray-600">3-5 business days</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                        ₨200
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      Free on orders above ₨5,000. Tracked delivery with SMS updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-2 border-blue-200 rounded-xl bg-blue-50">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    <FaShippingFast className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Express Shipping</h3>
                        <p className="text-gray-600">24-48 hours</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                        ₨500
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      Priority handling with same-day dispatch. Available in major cities only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaClock className="text-[#FF5C00]" />
              Order Processing Timeline
            </h2>
            
            <div className="relative">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="text-center mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-blue-600">1-2 Hours</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Order Confirmation</h4>
                  <p className="text-gray-600 text-sm">Email & SMS sent</p>
                </div>
                
                <div className="hidden md:block flex-1 h-1 bg-gray-300 mx-4"></div>
                <div className="md:hidden my-4">↓</div>
                
                <div className="text-center mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-green-600">24 Hours</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Processing</h4>
                  <p className="text-gray-600 text-sm">Order prepared</p>
                </div>
                
                <div className="hidden md:block flex-1 h-1 bg-gray-300 mx-4"></div>
                <div className="md:hidden my-4">↓</div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-orange-600">Dispatch</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Shipping</h4>
                  <p className="text-gray-600 text-sm">Handed to courier</p>
                </div>
              </div>
            </div>
          </div>

          {/* Packaging & Handling */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaBox className="text-[#FF5C00]" />
              Packaging & Handling
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">📦</div>
                  <h4 className="font-bold text-gray-900">Secure Packaging</h4>
                  <p className="text-gray-700 text-sm">Bubble wrap & corrugated boxes</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🛡️</div>
                  <h4 className="font-bold text-gray-900">Damage Protection</h4>
                  <p className="text-gray-700 text-sm">Fragile item handling</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <h4 className="font-bold text-gray-900">Invoice Included</h4>
                  <p className="text-gray-700 text-sm">Complete documentation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Notes</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                <FaExclamationTriangle className="text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Delivery Attempts</h4>
                  <p className="text-gray-700">We attempt delivery twice. After that, item returns to our warehouse.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                <FaExclamationTriangle className="text-red-500 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Address Accuracy</h4>
                  <p className="text-gray-700">Ensure correct address. Wrong addresses may cause delays.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <FaExclamationTriangle className="text-blue-500 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Business Days</h4>
                  <p className="text-gray-700">Delivery times are business days (Monday-Friday).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Shipping Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="font-bold mb-2">Track Order</h3>
                <p>+92 313 147 1263</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-bold mb-2">Email Support</h3>
                <p>saimpkf@gmail.com</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="font-bold mb-2">Support Hours</h3>
                <p>9 AM - 6 PM (PKT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingServicePolicy;