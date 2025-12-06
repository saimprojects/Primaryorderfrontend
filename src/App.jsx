import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Add this import
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products"; // All products page
import Categories from "./pages/Categories"; // Categories listing page
import CategoryProducts from "./pages/CategoryProducts"; // Category specific products page
import OrderDetail from "./pages/OrderDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ShippingServicePolicy from "./pages/ShippingServicePolicy";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";

// Contact Components
import ContactForm from "./components/contact/ContactForm";
import ContactMessages from "./components/contact/ContactMessages";
import ContactMessageDetail from "./components/contact/ContactMessageDetail";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />
      
      {/* Main content with flex-grow */}
      <div className="flex-grow">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Contact Pages */}
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/contact/messages" element={<ContactMessages />} />
          <Route
            path="/contact/messages/:id"
            element={<ContactMessageDetail />}
          />

          {/* Products Pages */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />

          {/* Categories Pages */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryProducts />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* User Account */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          {/* Additional Pages (if needed in future) */}
          <Route path="/flash-sale" element={<Products />} />
          <Route path="/deals" element={<Products />} />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingServicePolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />



          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4 text-[#FF5C00]">404</div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you are looking for doesn't exist or has been moved.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/"
                      className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E55100] transition-colors"
                    >
                      Go Home
                    </a>
                    <a
                      href="/products"
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Browse Products
                    </a>
                    <a
                      href="/contact"
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Contact Support
                    </a>
                    <a
                      href="/help"
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                    >
                      Get Help
                    </a>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
      
      {/* Footer added here */}
      <Footer />
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;