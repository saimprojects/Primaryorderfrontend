import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
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

// 🔥 META PIXEL
import { initMetaPixel, trackPageView } from "./utils/metaPixel";

// 🔥 SCROLL TO TOP
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();

  // ✅ Init Meta Pixel ONCE
  useEffect(() => {
    initMetaPixel();
  }, []);

  // ✅ Track PageView on EVERY route change (SPA fix)
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <ScrollToTop />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Contact */}
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/contact/messages" element={<ContactMessages />} />
          <Route
            path="/contact/messages/:id"
            element={<ContactMessageDetail />}
          />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />

          {/* Categories */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryProducts />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* User */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Extra */}
          <Route path="/flash-sale" element={<Products />} />
          <Route path="/deals" element={<Products />} />

          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route
            path="/shipping-policy"
            element={<ShippingServicePolicy />}
          />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          {/* 404 */}
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
                      className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#E55100]"
                    >
                      Go Home
                    </a>
                    <a
                      href="/products"
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
                    >
                      Browse Products
                    </a>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
