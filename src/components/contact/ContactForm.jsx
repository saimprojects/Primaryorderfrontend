import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaTag, FaExclamation, FaComment, FaWhatsapp, FaTicketAlt, FaHistory } from 'react-icons/fa';
import api from '../../api/axios';

const ContactForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });

  // WhatsApp link
  const whatsappLink = "https://wa.me/+923131471263";

  const categories = [
    { value: '', label: 'Select Category (Optional)' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Issue' },
    { value: 'payment', label: 'Payment Problem' },
    { value: 'account', label: 'Account Help' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'refund', label: 'Refund Request' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low - General Question', icon: '💬' },
    { value: 'medium', label: 'Medium - Need Assistance', icon: '⚠️' },
    { value: 'high', label: 'High - Urgent Issue', icon: '🚨' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/contact/messages/', formData);
      
      if (response.status === 201) {
        setMessageId(response.data.id);
        setSubmitted(true);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            category: '',
            message: '',
            priority: 'medium'
          });
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      if (error.response?.data) {
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Error submitting form. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h2>
              <p className="text-gray-600">
                Ticket ID: <span className="font-bold text-[#FF5C00]">#{messageId}</span>
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  ✅ We've received your message and will respond within <span className="font-bold">24 hours</span>.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  📧 Check your email <span className="font-bold">{formData.email}</span> for updates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Track Status</h3>
                <p className="text-sm text-gray-600">Monitor your ticket progress</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Response Time</h3>
                <p className="text-sm text-gray-600">24-48 hours</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">Reference</h3>
                <p className="text-sm text-gray-600">Keep Ticket #{messageId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/contact/messages`)}
                className="w-full bg-[#FF5C00] text-white py-4 rounded-xl font-bold hover:bg-[#E55100] transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-3"
              >
                <FaHistory />
                Track Your Messages
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessageId(null);
                }}
                className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Send Another Message
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Track Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact <span className="text-[#FF5C00]">Support</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Have questions or need assistance? Our support team is here to help you 24/7.
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/contact/messages')}
            className="bg-gradient-to-r from-[#1A1A1A] to-[#333] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
          >
            <FaHistory />
            Track Existing Messages
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaUser className="text-[#FF5C00]" />
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-[#FF5C00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email Support</h4>
                    <p className="text-gray-600 text-sm">saimpkf@gmail.com</p>
                    <p className="text-gray-500 text-xs mt-1">Response: Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-[#FF5C00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phone Support</h4>
                    <p className="text-gray-600 text-sm">+92 313 147 1263</p>
                    <p className="text-gray-500 text-xs mt-1">Mon-Fri: 9AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaTag className="text-[#FF5C00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Quick Response</h4>
                    <p className="text-gray-600 text-sm">Average: 12 hours</p>
                    <p className="text-gray-500 text-xs mt-1">High priority: 4 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Before Submitting</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Check your email for typos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Include order number if applicable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Be specific about your issue
                  </li>
                </ul>
              </div>
            </div>

            {/* WhatsApp Live Support */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <FaWhatsapp className="text-2xl" />
                WhatsApp Live Support
              </h3>
              <p className="text-green-100 mb-6">
                Get instant help on WhatsApp. Click to chat with our support team.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-[#25D366] py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
              >
                <FaWhatsapp className="text-xl" />
                Chat on WhatsApp
              </a>
              <p className="text-green-100 text-sm mt-3 text-center">
                Available 24/7
              </p>
            </div>

            {/* Track Messages Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#FF5C00]">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaTicketAlt className="text-[#FF5C00]" />
                Track Your Messages
              </h3>
              <p className="text-gray-600 mb-6">
                Already contacted us? Track the status of your previous messages.
              </p>
              <button
                onClick={() => navigate('/contact/messages')}
                className="w-full bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <FaHistory />
                View Message History
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                <p className="text-gray-600">All fields marked with * are required</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-bold mb-2">
                      <FaUser className="inline mr-2 text-gray-400" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-2">
                      <FaEnvelope className="inline mr-2 text-gray-400" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-bold mb-2">
                      <FaPhone className="inline mr-2 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all"
                      placeholder="+92 300 1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-2">
                      <FaTag className="inline mr-2 text-gray-400" />
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-900 font-bold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all"
                    placeholder="Briefly describe your issue"
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-gray-900 font-bold mb-2">
                    <FaExclamation className="inline mr-2 text-gray-400" />
                    Priority Level
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {priorities.map(priority => (
                      <label
                        key={priority.value}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                          formData.priority === priority.value
                            ? 'border-[#FF5C00] bg-orange-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{priority.icon}</span>
                          <div>
                            <div className="font-bold text-gray-900">
                              {priority.label.split('-')[0].trim()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {priority.label.split('-')[1].trim()}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-900 font-bold mb-2">
                    <FaComment className="inline mr-2 text-gray-400" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Please provide detailed information about your issue. Include any relevant order numbers, screenshots descriptions, or error messages..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    The more details you provide, the faster we can help you.
                  </p>
                </div>

                {/* Terms */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-1"
                    />
                    <span className="text-gray-700 text-sm">
                      I agree to the terms and conditions. I understand that my personal information will be processed according to the privacy policy and that I may receive updates about my request via email.
                    </span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Support Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white p-4 rounded-xl text-center hover:bg-[#128C7E] transition-colors"
              >
                <FaWhatsapp className="text-2xl mx-auto mb-2" />
                <div className="font-bold">WhatsApp</div>
                <div className="text-sm">Instant Chat</div>
              </a>
              
              <button
                onClick={() => navigate('/contact/messages')}
                className="bg-[#FF5C00] text-white p-4 rounded-xl text-center hover:bg-[#E55100] transition-colors"
              >
                <FaHistory className="text-2xl mx-auto mb-2" />
                <div className="font-bold">Track Messages</div>
                <div className="text-sm">Check Status</div>
              </button>
              
              <button className="bg-[#1A1A1A] text-white p-4 rounded-xl text-center hover:bg-black transition-colors">
                <FaPhone className="text-2xl mx-auto mb-2" />
                <div className="font-bold">Call Us</div>
                <div className="text-sm">9AM-6PM</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;