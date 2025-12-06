import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaCalendar,
  FaUser,
  FaPhone,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPaperPlane,
  FaTag,
  FaReply,
  FaHistory,
  FaCopy,
  FaShareAlt,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import api from "../../api/axios";

const ContactMessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/contact/messages/${id}/`);
      setMessage(response.data);
    } catch (error) {
      console.error("Error fetching message:", error);
      if (error.response?.status === 404) {
        navigate("/contact/messages");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setSendingReply(true);
    try {
      await api.post(`/api/contact/messages/${id}/respond/`, {
        response: reply.trim(),
      });

      setReply("");
      fetchMessage(); // Refresh message
      alert("Reply sent successfully! Admin will review it.");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Error sending reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(`Ticket #${id}`);
    alert("Ticket ID copied to clipboard!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "text-blue-600 bg-blue-100";
      case "in_progress":
        return "text-yellow-600 bg-yellow-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      case "closed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF5C00] mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Loading Message Details
            </h3>
            <p className="text-gray-600">Fetching ticket information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Message Not Found
            </h3>
            <p className="text-gray-600 mb-8">
              The requested message does not exist or you don't have permission
              to view it.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/contact/messages")}
                className="w-full bg-[#FF5C00] text-white py-3 rounded-xl font-bold hover:bg-[#E55100] transition-colors"
              >
                Back to Messages
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Create New Message
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
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/contact/messages")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF5C00] transition-colors"
          >
            <FaArrowLeft />
            Back to Messages
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyTicketId}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FaCopy />
              Copy ID
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FaPrint />
              Print
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FaShareAlt />
              Share
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      {message.subject}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-2">
                        <FaEnvelope />
                        Ticket #{message.id}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaCalendar />
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                        message.status
                      )}`}
                    >
                      {message.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(
                        message.priority
                      )}`}
                    >
                      {message.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                {/* Sender Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaUser className="text-[#FF5C00]" />
                      Sender Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{message.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{message.email}</div>
                      </div>
                      {message.phone && (
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            {message.phone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaHistory className="text-[#FF5C00]" />
                      Ticket Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="font-medium">
                          {new Date(message.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Last Updated
                        </div>
                        <div className="font-medium">
                          {new Date(message.updated_at).toLocaleString()}
                        </div>
                      </div>
                      {message.category && (
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="font-medium flex items-center gap-2">
                            <FaTag className="text-gray-400" />
                            {message.category}
                          </div>
                        </div>
                      )}
                      {message.resolved_at && (
                        <div>
                          <div className="text-sm text-gray-500">Resolved</div>
                          <div className="font-medium">
                            {new Date(message.resolved_at).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    Original Message
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-700 whitespace-pre-line">
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* Admin Response */}
                {message.admin_response ? (
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaExclamationTriangle className="text-blue-500" />
                      Admin Response
                    </h3>
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <p className="text-gray-700 whitespace-pre-line">
                        {message.admin_response}
                      </p>
                      {message.responded_by_name && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-sm text-gray-600">
                            Responded by:{" "}
                            <span className="font-medium">
                              {message.responded_by_name}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-xl text-center">
                    <FaClock className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">
                      Awaiting Response
                    </h4>
                    <p className="text-gray-600">
                      Our support team is reviewing your message. You'll receive
                      a response soon.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Reply Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaReply className="text-[#FF5C00]" />
                Add Additional Information
              </h3>
              <div className="space-y-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Add any additional information or questions..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    This will be added to your ticket for the admin to review.
                  </p>
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !reply.trim()}
                    className="bg-[#FF5C00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E55100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sendingReply ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Update
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Status Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Ticket Status</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">Ticket Created</div>
                      <div className="text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {message.status === "in_progress" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaClock className="text-yellow-500" />
                      </div>
                      <div>
                        <div className="font-medium">In Progress</div>
                        <div className="text-sm text-gray-500">
                          Being reviewed by support
                        </div>
                      </div>
                    </div>
                  )}

                  {message.status === "resolved" && message.resolved_at && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">Resolved</div>
                        <div className="text-sm text-gray-500">
                          {new Date(message.resolved_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    Mark as Urgent
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    Request Callback
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    Download Conversation
                  </button>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white rounded-2xl p-6">
                <h3 className="font-bold mb-4">Need Immediate Help?</h3>
                <p className="text-orange-100 mb-6">
                  Our support team is available 24/7
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-white text-[#FF5C00] py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    <a href="https://wa.me/+923131471263" target="_blank">
                      Live Chat
                    </a>
                  </button>
                  <button className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
                    Call Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessageDetail;
