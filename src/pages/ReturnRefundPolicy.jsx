import React from 'react';
import { FaUndo, FaMoneyBillWave, FaShippingFast, FaClock, FaBoxOpen, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const ReturnRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUndo className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Return & Refund <span className="text-[#FF5C00]">Policy</span>
          </h1>
          <p className="text-lg text-gray-600">
            Simple, Fair, and Customer-Friendly Returns
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Important Notice */}
          <div className="mb-10 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-2xl text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700">
                  We offer a <span className="font-bold text-[#FF5C00]">3-day return policy</span> from the date of delivery. All items must be in original condition with tags attached and in original packaging.
                </p>
              </div>
            </div>
          </div>

          {/* Return Timeline */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaClock className="text-[#FF5C00]" />
              Return Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-green-600">Day 1</span>
                  </div>
                  <p className="text-sm text-gray-600">Delivery Day</p>
                </div>
                
                <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-blue-600">Day 2</span>
                  </div>
                  <p className="text-sm text-gray-600">Inspection Day</p>
                </div>
                
                <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-red-600">Day 3</span>
                  </div>
                  <p className="text-sm text-gray-600">Last Return Day</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="font-bold text-red-600">
                  ⚠️ Returns will NOT be accepted after 3 days from delivery
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility for Returns</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-2xl text-green-500" />
                  <h3 className="font-bold text-gray-900">Returnable Items</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Damaged or defective products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Wrong item received</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Items in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Unused and unworn items</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FaExclamationTriangle className="text-2xl text-red-500" />
                  <h3 className="font-bold text-gray-900">Non-Returnable Items</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Used or worn items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Items without original tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Personalized/customized products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Perishable goods</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaBoxOpen className="text-[#FF5C00]" />
              Return Process
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Initiate Return</h4>
                  <p className="text-gray-700">Contact our support within 3 days at <span className="font-bold">saimpkf@gmail.com</span> or call <span className="font-bold">+92 313 147 1263</span></p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Get Return Label</h4>
                  <p className="text-gray-700">We'll email you a return authorization and shipping label</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl">
                <div className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Package & Ship</h4>
                  <p className="text-gray-700">Pack item securely with all original packaging and tags attached</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Receive Refund</h4>
                  <p className="text-gray-700">Refund processed within 5-7 business days after inspection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaMoneyBillWave className="text-[#FF5C00]" />
              Refund Information
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF5C00] mb-2">100%</div>
                  <p className="text-gray-700">Product Price</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">0%</div>
                  <p className="text-gray-700">Shipping Cost</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">5-7 Days</div>
                  <p className="text-gray-700">Processing Time</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Refund Methods</h4>
                <div className="flex flex-wrap gap-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Original Payment Method</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Bank Transfer</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Store Credit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping for Returns */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaShippingFast className="text-[#FF5C00]" />
              Shipping for Returns
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Free Return Shipping</h4>
                <p className="text-gray-700">We provide free return shipping for defective or wrong items</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Customer-Paid Returns</h4>
                <p className="text-gray-700">For change of mind returns, customer pays return shipping</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Pickup Service</h4>
                <p className="text-gray-700">Available in major cities for eligible returns</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Need Help with Returns?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-bold mb-2">Email</h3>
                <p>saimpkf@gmail.com</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="font-bold mb-2">Phone</h3>
                <p>+92 313 147 1263</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="font-bold mb-2">Response Time</h3>
                <p>Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;