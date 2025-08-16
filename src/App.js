import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // ⬅ Added Navigate
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import React, { useState, useEffect } from "react";
import Home from "./Home";
import ProductDetail from "./components/ProductDetail";
import CategoryPage from "./components/CategoryPage";
import About from "./pages/About";
import AdminPanel from "./admin/AdminPanel";
import Signup from "./Signup";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import WishlistPage from "./components/WishlistPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./hooks/useCart";
import Contact from "./pages/Contact";

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleAuth = ({ user, accessToken }) => {
    const userObj = {
      ...user,
      accessToken,
      createdAt: user.createdAt,
      userId: user.userId,
    };
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleAuth, handleLogout }}>
      <div className="App">
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route
                path="/category/:categoryName"
                element={<CategoryPage />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />

            </Routes>
          </Router>
        </CartProvider>
      </div>
    </UserContext.Provider>
  );
}

export default App;
