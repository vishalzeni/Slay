import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    JSON.parse(localStorage.getItem("user"))?.accessToken;

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setCartItems(
        Array.isArray(data)
          ? data.map((item) => ({
              ...item,
              qty: item.qty || item.quantity || 1,
              size: item.size || (item.product && item.product.size) || "",
            }))
          : []
      );
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productOrId, quantity = 1, size = "") => {
    const token = getToken();
    if (!token) return;

    const productId =
      typeof productOrId === "string" ? productOrId : productOrId.id;

    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity, size }),
    });

    fetchCart();
  };

  const removeFromCart = async (productId, size = "") => {
    const token = getToken();
    if (!token) return;

    await fetch("http://localhost:5000/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, size }),
    });

    fetchCart();
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    await fetch("http://localhost:5000/api/cart/clear", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Safer version of the hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn("⚠️ useCart must be used within a <CartProvider>");
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      loading: false,
    };
  }
  return context;
};
