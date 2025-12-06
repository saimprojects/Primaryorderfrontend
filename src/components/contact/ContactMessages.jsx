import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaUser,
  FaEye,
  FaTimes,
  FaPlus,
  FaTicketAlt,
} from "react-icons/fa";
import api from "../../api/axios";

const ContactMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    checkAuthAndFetchMessages();
  }, []);

  const checkAuthAndFetchMessages = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await fetchUserMessages();
      } catch (error) {
        console.log("Not logged in or session expired");
        setShowEmailForm(true);
      }
    } else {
      setShowEmailForm(true);
    }
  };

  const fetchUserMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/contact/messages/my_messages/");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesByEmail = async (email) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/contact/messages/?email=${encodeURIComponent(email)}`
      );
      setMessages(response.data);
      setShowEmailForm(false);
    } catch (error) {
      console.error("Error fetching messages by email:", error);
      alert("No messages found for this email or the email is invalid.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      fetchMessagesByEmail(searchEmail.trim());
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case "in_progress":
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      case "resolved":
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      case "closed":
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-300"></div>;
    }
  };

  const getStatusBadge = (status) => {
    const statusText = status.replace("_", " ");
    const colors = {
      new: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status]}`}
      >
        {statusText.toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${colors[priority]}`}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filterStatus === "all") return true;
    return msg.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF5C00] mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Loading Messages
            </h3>
            <p className="text-gray-600">Fetching your contact history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTicketAlt className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Track Your Tickets
              </h2>
              <p className="text-gray-600">
                Enter your email to view all contact messages
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-900 font-bold mb-2">
                  <FaEnvelope className="inline mr-2 text-gray-400" />
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5C00] focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter the email you used to contact us
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <FaSearch className="inline mr-2" />
                Search Messages
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-3">Have an account?</p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#FF5C00] hover:underline font-bold"
                >
                  Login to view all messages
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My <span className="text-[#FF5C00]">Messages</span>
            </h1>
            <p className="text-gray-600">
              Track and manage all your contact requests
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <FaPlus />
              New Message
            </Link>
            <button
              onClick={() => setShowEmailForm(true)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Switch Email
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {messages.length}
            </div>
            <div className="text-gray-600 text-sm">Total Messages</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {messages.filter((m) => m.status === "new").length}
            </div>
            <div className="text-gray-600 text-sm">New</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {messages.filter((m) => m.status === "in_progress").length}
            </div>
            <div className="text-gray-600 text-sm">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {messages.filter((m) => m.status === "resolved").length}
            </div>
            <div className="text-gray-600 text-sm">Resolved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-lg font-bold text-gray-900">Filter Messages</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-[#FF5C00] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("new")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "new"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilterStatus("in_progress")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "in_progress"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus("resolved")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "resolved"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Messages Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filterStatus !== "all"
                ? `No ${filterStatus.replace("_", " ")} messages found.`
                : "You haven't sent any messages yet. Contact us for assistance."}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Send Your First Message
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-[#FF5C00] transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        {getStatusIcon(message.status)}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {message.subject}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <FaCalendar className="text-gray-400" />
                              {formatDate(message.created_at)}
                            </span>
                            <span className="flex items-center gap-2">
                              <FaUser className="text-gray-400" />
                              Ticket #{message.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-4">
                        {message.message}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        {getStatusBadge(message.status)}
                        {getPriorityBadge(message.priority)}
                      </div>
                      {message.category && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {message.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {message.admin_response && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FaExclamationTriangle className="text-blue-500" />
                        <h4 className="font-bold text-gray-900">
                          Admin Response
                        </h4>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-gray-700 line-clamp-2">
                          {message.admin_response}
                        </p>
                        {message.responded_by_name && (
                          <p className="text-sm text-gray-600 mt-2">
                            - {message.responded_by_name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(message.updated_at)}
                      </div>

                      <Link
                        to={`/contact/messages/${message.id}`}
                        className="text-[#FF5C00] hover:text-[#E55100] font-bold inline-flex items-center gap-2 group"
                      >
                        <FaEye />
                        View Details
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white rounded-2xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need More Assistance?
            </h2>
            <p className="mb-6 opacity-90 text-lg">
              Our support team is available 24/7 to help you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1"
              >
                Send New Message
              </Link>
              <button className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all transform hover:-translate-y-1">
                <a href="https://wa.me/+923131471263" target="_blank">
                  {" "}
                  Live Chat Support
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
