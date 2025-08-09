import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link, useNavigate } from "react-router-dom";
import colors from "../colors"; // adjust path
import Header from "./Header";
import Footer from "./Footer";
import { UserContext } from "../App";
import CircularProgress from "@mui/material/CircularProgress";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      alert("Aap login nahi hai, pehle login kare.");
      navigate("/login");
      return;
    }
    setLoading(true);

    // Always get token from localStorage for wishlist fetch
    const token = JSON.parse(localStorage.getItem("user"))?.accessToken;

    fetch("http://localhost:5000/api/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // Defensive: filter out nulls and ensure product exists
        setWishlistItems((Array.isArray(data) ? data : []).filter(item => item.product));
      })
      .catch(err => {
        setWishlistItems([]);
        console.error("Error fetching wishlist:", err);
      }) 
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    // Always get token from localStorage for toggle
    const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      const result = await res.json();
      if (result.wishlisted === false) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      }
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: colors.background,
          minHeight: "100vh"
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: colors.primary,
            textAlign: "center"
          }}
        >
          Your Wishlist
        </Typography>

        {loading ? (
  <Box display="flex" justifyContent="center" p={4}>
    <CircularProgress />
  </Box>
) :wishlistItems.length === 0 ? (
          <Typography
            variant="body1"
            sx={{
              color: colors.icon,
              textAlign: "center"
            }}
          >
            Your wishlist is empty. Start adding products!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {wishlistItems.map(({ product }) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    position: "relative",
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s",
                    height: "100%",
                    "&:hover": { transform: "translateY(-4px)" }
                  }}
                >
                  <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        height: 250,
                        objectFit: "cover",
                        backgroundColor: colors.accent
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: colors.icon,
                          mb: 1
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: colors.primary
                        }}
                      >
                        ₹{product.price}
                      </Typography>
                    </CardContent>
                  </Link>
                  <IconButton
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)"
                      },
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}
                  >
                    <FavoriteIcon sx={{ color: colors.badge }} />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
      </Box>
      <Footer />
    </>
  );
};

export default WishlistPage;
