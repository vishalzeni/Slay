import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import { useCart } from "../hooks/useCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import colors from "../colors";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DiscountIcon from "@mui/icons-material/Discount";
import CelebrationIcon from "@mui/icons-material/Celebration";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage = () => {
  const {
    cartItems = [],
    removeFromCart = () => {},
    clearCart = () => {},
  } = useCart() || {};

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.qty || 1),
    0
  );

  // Mock discount calculation (you can replace with real logic)
  const finalTotal = total;

  return (
    <>
    <Header/>
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: `${colors.background}80`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "40%",
          background: `radial-gradient(circle at center, ${colors.primary}20 0%, transparent 70%)`,
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header with decorative elements */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            position: "relative",
          }}
        >
          <IconButton
            component={Link}
            to="/"
            sx={{
              mr: 2,
              color: colors.primary,
              "&:hover": {
                backgroundColor: colors.accent,
                transform: "rotate(-10deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: colors.primary,
              letterSpacing: 1,
              fontSize: { xs: "1.6rem", sm: "2.2rem" },
              flex: 1,
              textShadow: `1px 1px 2px ${colors.primary}20`,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: "60px",
                height: "4px",
                background: colors.primary,
                borderRadius: 2,
              },
            }}
          >
            Your Shopping Cart
          </Typography>
          {/* Clear Cart Button */}
          <Button
            variant="text"
            onClick={clearCart}
            sx={{
              color: colors.primary,
              fontWeight: 600,
              borderRadius: 3,
              py: 1,
              "&:hover": {
                background: colors.error + "10",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: `1px solid ${colors.primary}`,
            }}
          >
            <DeleteIcon fontSize="small" />
            Clear Cart
          </Button>
        </Box>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                mb: 3,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -20,
                  left: -20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
                  zIndex: 0,
                },
              }}
            >
              <ShoppingCartIcon
                sx={{
                  fontSize: 80,
                  color: colors.icon,
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: colors.primary,
                fontSize: { xs: "1.4rem", sm: "1.8rem" },
                mb: 2,
                fontWeight: 600,
              }}
            >
              Your cart feels lonely
            </Typography>
            <Typography
              sx={{
                color: colors.icon,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                mb: 4,
                maxWidth: 400,
              }}
            >
              Add some amazing products to make it happy!
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/"
              sx={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, #d84315 100%)`,
                color: colors.badgeText,
                fontWeight: 600,
                borderRadius: 50,
                px: 5,
                py: 1.5,
                boxShadow: `0 4px 15px ${colors.primary}40`,
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: `0 6px 20px ${colors.primary}60`,
                },
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background:
                    "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.6s ease",
                },
                "&:hover::after": {
                  transform: "translateX(100%)",
                },
              }}
            >
              Explore Products
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 4,
              alignItems: "start",
            }}
          >
            {/* Left Column - Items */}
            <Box>
              {/* Promo Banner */}
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.accent}20 100%)`,
                  border: `1px dashed ${colors.primary}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CelebrationIcon sx={{ color: colors.primary, fontSize: 30 }} />
                <Box>
                  <Typography fontWeight={600} sx={{ color: colors.primary }}>
                    Special Offer!
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.icon }}>
                    Get 10% off on orders above ₹2000. Add more items to unlock
                    discount!
                  </Typography>
                </Box>
              </Paper>

              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.productId + (item.size || "")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.05, type: "spring" }}
                    layout
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        mb: 2,
                        p: 2,
                        borderRadius: 3,
                        gap: 2,
                        transition: "all 0.3s ease",
                        background: colors.background,
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: `0 8px 24px ${colors.primary}30`,
                          transform: "translateY(-3px)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "4px",
                          height: "100%",
                          background: colors.primary,
                          transition: "all 0.3s ease",
                        },
                        "&:hover::before": {
                          width: "6px",
                        },
                      }}
                    >
                      {/* Product Image */}
                      <Box
                        component={Link}
                        to={`/product/${item.productId}`}
                        sx={{
                          width: { xs: "100%", sm: 120 },
                          height: { xs: 200, sm: 120 },
                          borderRadius: 2,
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${colors.primary}20`,
                        }}
                      >
                        <Box
                          component="img"
                          src={item.product?.image}
                          alt={item.product?.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        />
                      </Box>

                      {/* Product Details */}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          position: "relative",
                        }}
                      >
                        <Typography
                          component={Link}
                          to={`/product/${item.productId}`}
                          fontWeight={700}
                          sx={{
                            color: colors.primary,
                            fontSize: { xs: "1.1rem", sm: "1.2rem" },
                            mb: 1,
                            display: "block",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                              color: "#d84315",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {item.product?.name}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          alignItems="center"
                          mb={1.5}
                          sx={{
                            "& > *": {
                              mb: 1,
                            },
                          }}
                        >
                          <CartChip
                            label={`Size: ${item.size || "N/A"}`}
                            bg={colors.accent}
                            color={colors.primary}
                            icon={<DiscountIcon fontSize="small" />}
                          />
                          <CartChip
                            label={`Qty: ${item.qty || 1}`}
                            bg="#f5f5f5"
                            color={colors.icon}
                          />
                          <CartChip
                            label={`₹${(
                              item.product?.price || 0
                            ).toLocaleString()}`}
                            bg={colors.primary}
                            color={colors.badgeText}
                            bold
                          />
                        </Stack>

                        <Typography
                          color="text.secondary"
                          fontSize={{ xs: "1rem", sm: "1.05rem" }}
                          fontWeight={600}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          Subtotal:
                          <Box
                            component="span"
                            sx={{
                              color: colors.primary,
                              fontSize: "1.1em",
                            }}
                          >
                            ₹
                            {(
                              (item.product?.price || 0) * (item.qty || 1)
                            ).toLocaleString()}
                          </Box>
                        </Typography>
                      </Box>

                      {/* Delete Button */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                      >
                        <IconButton
                          onClick={() =>
                            removeFromCart(item.productId, item.size)
                          }
                          sx={{
                            "&:hover": {
                              backgroundColor: colors.error + "20",
                              color: colors.error,
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <DeleteIcon
                            sx={{
                              color: colors.error || "#d32f2f",
                              fontSize: 26,
                            }}
                          />
                        </IconButton>
                      </motion.div>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            {/* Right Column - Summary */}
            <Box
              sx={{
                position: "sticky",
                top: 20,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Order Summary Card */}
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 8px 24px ${colors.primary}15`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: colors.primary,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocalOfferIcon />
                  Order Summary
                </Typography>

                <Divider
                  sx={{
                    my: 2,
                    borderColor: colors.border,
                    borderBottomWidth: 2,
                  }}
                />

                {/* Price Breakdown */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <PriceRow
                    label="Subtotal"
                    value={`₹${total.toLocaleString()}`}
                  />

                  <PriceRow label="Shipping" value="FREE" />
                </Box>

                <Divider
                  sx={{
                    my: 2,
                    borderColor: colors.border,
                    borderBottomWidth: 2,
                  }}
                />

                {/* Total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: colors.primary }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                      color: colors.primary,
                      background: `linear-gradient(135deg, ${colors.primary} 0%, #d84315 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹{finalTotal.toLocaleString()}
                  </Typography>
                </Box>

                {/* Checkout Button */}
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/checkout"
                  disabled={cartItems.length === 0}
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, #d84315 100%)`,
                    color: colors.badgeText,
                    fontWeight: 700,
                    borderRadius: 3,
                    py: 1.5,
                    mb: 2,
                    boxShadow: `0 4px 15px ${colors.primary}40`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 20px ${colors.primary}60`,
                    },
                    "&:disabled": {
                      background: `${colors.icon}40`,
                      color: `${colors.badgeText}80`,
                    },
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "-50%",
                      left: "-50%",
                      width: "200%",
                      height: "200%",
                      background:
                        "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    },
                    "&:hover::after": {
                      transform: "translateX(100%)",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>

                {/* Secure Payment Info */}
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.icon,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  🔒 Secure Payment
                </Typography>
              </Paper>

              {/* Continue Shopping Button */}
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/"
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontWeight: 600,
                  borderRadius: 3,
                  py: 1.5,
                  "&:hover": {
                    background: colors.accent,
                    borderColor: colors.primary,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
    <Footer/>
    </>
  );
};

// Reusable Price Row Component
const PriceRow = ({ label, value, highlight = false, disabled = false }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: colors.icon,
        fontWeight: highlight ? 600 : 400,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: highlight ? colors.primary : colors.icon,
        fontWeight: highlight ? 700 : 500,
      }}
    >
      {value}
    </Typography>
  </Box>
);

// Enhanced Chip Component
const CartChip = ({ label, bg, color, bold, icon }) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <Chip
      label={label}
      icon={icon}
      size="small"
      sx={{
        bgcolor: bg,
        color,
        fontWeight: bold ? 700 : 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "& .MuiChip-icon": {
          color: `${color} !important`,
          fontSize: "16px !important",
          marginLeft: "4px !important",
        },
        "&:hover": {
          boxShadow: `0 2px 8px ${colors.primary}20`,
        },
      }}
    />
  </motion.div>
);

export default CartPage;
