import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageMagnifier from "../utilities/ImageMagnifier"; // adjust path as needed

import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Grid,
  Paper,
  Rating,
  IconButton,
  useMediaQuery,
  useTheme,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import {
  Add,
  Remove,
  LocalShipping,
  ShoppingCartOutlined,
  ExpandMore,
  InfoOutlined,
  ArrowBack,
} from "@mui/icons-material";

import data from "../data/clothes.json";
import colors from "../colors";
import Header from "./Header";
import Footer from "./Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = data.find((item) => item.id === id);
  const [mainImage, setMainImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Product not found
        </Typography>
      </Box>
    );
  }

  const discount =
    product.marketPrice > product.price
      ? Math.round(
          ((product.marketPrice - product.price) / product.marketPrice) * 100
        )
      : 0;

  // Create images array with main image first
  const allImages = [
    product.image,
    ...(product.images?.filter((img) => img !== product.image) || []),
  ];

  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: colors.background,
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Back button for mobile */}
        {isMobile && (
          <IconButton
            onClick={() => window.history.back()}
            sx={{
              position: "fixed",
              top: 70,
              left: 16,
              zIndex: 100,
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.1)",
              width: 40,
              height: 40,
            }}
          >
            <ArrowBack />
          </IconButton>
        )}

        <Grid container justifyContent="center">
          <Grid item xs={12} md={11} lg={10}>
            <Fade in timeout={500}>
              <Grid
                container
                spacing={isMobile ? 0 : 1}
                direction={isMobile ? "column" : "row"}
                alignItems="stretch"
              >
                {/* LEFT: Product Image */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: isMobile ? 0 : 3,
                      overflow: "hidden",
                      backgroundColor: "#fef4ee",
                      height: isMobile
                        ? isSmallMobile
                          ? "45vh"
                          : "50vh"
                        : 560,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isMobile
                        ? "none"
                        : "0 4px 24px rgba(0,0,0,0.08)",
                      border: isMobile ? "none" : "1px solid #f0e6e0",
                      mb: isMobile ? 1 : 2,
                      flexDirection: "column",
                    }}
                  >
                    {/* Main Image */}

                    <ImageMagnifier
                      src={mainImage}
                      zoom={2.5}
                      magnifierSize={180}
                    />

                    {product.isNewArrival && (
                      <Chip
                        label="New Arrival"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          backgroundColor: colors.badge,
                          color: colors.badgeText,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          zIndex: 10,
                        }}
                        size="small"
                      />
                    )}
                  </Box>

                  {/* Thumbnails */}
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{
                      overflowX: "auto",
                      pb: 1,
                      px: isMobile ? 1 : 0,
                      mt: 1,
                    }}
                  >
                    {allImages.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setMainImage(img)}
                        sx={{
                          width: isMobile ? 48 : 64,
                          height: isMobile ? 48 : 64,
                          borderRadius: 2,
                          objectFit: "cover",
                          border:
                            mainImage === img
                              ? `2px solid ${colors.primary}`
                              : "1px solid #ccc",
                          cursor: "pointer",
                          transition: "0.3s",
                          ":hover": {
                            opacity: 0.9,
                            borderColor: colors.primary,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>

                {/* RIGHT: Product Details */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={isMobile ? 0 : 2}
                    sx={{
                      p: { xs: 2, md: 4 },
                      borderRadius: isMobile ? 0 : 4,
                      backgroundColor: isMobile ? "transparent" : colors.cardBg,
                      boxShadow: isMobile
                        ? "none"
                        : "0px 6px 20px rgba(0, 0, 0, 0.05)",
                      height: "100%",
                    }}
                  >
                    <Stack spacing={3} sx={{ height: "100%" }}>
                      <Box>
                        <Typography
                          component="h1"
                          variant={isMobile ? "h5" : "h4"}
                          fontWeight={600}
                          color={colors.icon}
                          mb={1}
                          textAlign="left"
                          sx={{
                            pt: isMobile ? 1 : 0,
                            fontSize: isSmallMobile ? "1.3rem" : null,
                          }}
                        >
                          {product.name}
                        </Typography>

                        {/* Price */}
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography
                            fontWeight={700}
                            sx={{
                              color: colors.primary,
                              fontSize: isMobile ? "1.3rem" : "1.6rem",
                            }}
                          >
                            ₹{product.price.toLocaleString()}
                          </Typography>
                          {discount > 0 && (
                            <>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#888",
                                  textDecoration: "line-through",
                                  fontSize: isMobile ? "0.9rem" : "1rem",
                                }}
                              >
                                ₹{product.marketPrice.toLocaleString()}
                              </Typography>
                              <Chip
                                label={`${discount}% OFF`}
                                size="small"
                                sx={{
                                  backgroundColor: "#fff0e9",
                                  color: colors.primary,
                                  fontWeight: 600,
                                }}
                              />
                            </>
                          )}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <InfoOutlined fontSize="small" color="action" />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textAlign: "left" }}
                          >
                            Inclusive of all taxes. Free shipping over ₹999.
                          </Typography>
                        </Stack>
                        {/* Ratings */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          mt={1}
                        >
                          <Rating
                            value={5}
                            readOnly
                            size={isMobile ? "small" : "medium"}
                          />
                          <Typography variant="body2" color="text.secondary">
                            (5.0)
                          </Typography>
                        </Stack>
                      </Box>

                      <Divider sx={{ borderColor: colors.border }} />

                      {/* Sizes */}
                      <Box>
                        <Typography
                          fontWeight={600}
                          gutterBottom
                          style={{ textAlign: "left" }}
                        >
                          Select Size:
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {product.sizes.map((size) => (
                            <Chip
                              key={size}
                              label={size}
                              clickable
                              onClick={() => setSelectedSize(size)}
                              variant={
                                selectedSize === size ? "filled" : "outlined"
                              }
                              sx={{
                                px: 2,
                                py: isMobile ? 0.5 : 1,
                                fontWeight: 600,
                                borderRadius: 2,
                                backgroundColor:
                                  selectedSize === size
                                    ? colors.primary
                                    : "transparent",
                                color:
                                  selectedSize === size
                                    ? "#fff"
                                    : colors.primary,
                                borderColor: colors.primary,
                                transition: "all 0.3s ease",
                                fontSize: isMobile ? "0.9rem" : "1rem",
                                mb: 1,
                                ":hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>

                      {/* Quantity */}
                      <Box>
                        <Typography
                          fontWeight={600}
                          gutterBottom
                          style={{ textAlign: "left" }}
                        >
                          Quantity:
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            onClick={() =>
                              setQuantity((prev) => Math.max(1, prev - 1))
                            }
                            sx={{
                              border: `1px solid ${colors.primary}`,
                              color: colors.primary,
                              borderRadius: 2,
                              width: 36,
                              height: 36,
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography
                            variant="body1"
                            width={30}
                            textAlign="center"
                          >
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={() => setQuantity((prev) => prev + 1)}
                            sx={{
                              border: `1px solid ${colors.primary}`,
                              color: colors.primary,
                              borderRadius: 2,
                              width: 36,
                              height: 36,
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Stack>
                      </Box>

                      {/* Shipping Info */}
                      <Stack spacing={1}>
                        <Chip
                          icon={<LocalShipping fontSize="small" />}
                          label="Dispatch in 3–4 days"
                          sx={{
                            backgroundColor: "#fdf2ec",
                            color: colors.primary,
                            fontWeight: 500,
                            px: 1.5,
                            py: 1,
                            width: "fit-content",
                            borderRadius: 2,
                          }}
                        />
                      </Stack>

                      {selectedSize && (
                        <Typography variant="body2" mt={0.5}>
                          Selected Size:{" "}
                          <span
                            style={{ color: colors.primary, fontWeight: 500 }}
                          >
                            {selectedSize}
                          </span>
                        </Typography>
                      )}

                      {!isMobile && (
                        <Stack
                          direction="column"
                          spacing={1}
                          sx={{
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            disabled={!product.inStock || !selectedSize}
                            sx={{
                              background: `linear-gradient(90deg, ${colors.primary} 0%, #ff7043 100%)`,
                              fontWeight: 600,
                              py: 1.4,
                              borderRadius: 3,
                              textTransform: "none",
                              fontSize: "1rem",
                              transition: "0.3s",
                              ":hover": {
                                transform: "scale(1.01)",
                                background: "#a83200",
                              },
                            }}
                          >
                            Buy Now
                          </Button>
                          <Button
                            variant="outlined"
                            disabled={!product.inStock || !selectedSize}
                            startIcon={<ShoppingCartOutlined />}
                            sx={{
                              fontWeight: 600,
                              py: 1.4,
                              borderColor: colors.primary,
                              color: colors.primary,
                              borderRadius: 3,
                              textTransform: "none",
                              fontSize: "1rem",
                              ":hover": {
                                backgroundColor: colors.accent,
                              },
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Stack>
                      )}

                      {/* Description Accordion */}
                      <Accordion
                        defaultExpanded={!isMobile}
                        sx={{
                          backgroundColor: isMobile ? "transparent" : "#fff",
                          mt: 3,
                          borderRadius: 2,
                          border: isMobile ? "none" : "1px solid #f0e6e0",
                          boxShadow: "none",
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography fontWeight={600}>
                            Product Description
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            backgroundColor: isMobile
                              ? "transparent"
                              : "#f9f9f9",
                            p: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            lineHeight={1.8}
                            color="text.secondary"
                          >
                            {product.description}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Fade>
          </Grid>
        </Grid>
        <Footer />
        {/* Sticky Action Buttons for Mobile */}
        {isMobile && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              p: 2,
              zIndex: 1000,
              borderTop: `1px solid ${colors.border}`,
              boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: colors.primary }}
                >
                  ₹{product.price.toLocaleString()}
                </Typography>
                {discount > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#888", textDecoration: "line-through" }}
                  >
                    ₹{product.marketPrice.toLocaleString()}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={1} flex={1} maxWidth={300}>
                <Button
                  variant="outlined"
                  disabled={!product.inStock || !selectedSize}
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    py: 1.2,
                    borderColor: colors.primary,
                    color: colors.primary,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.9rem",
                    minWidth: "auto",
                    ":hover": {
                      backgroundColor: colors.accent,
                    },
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  disabled={!product.inStock || !selectedSize}
                  sx={{
                    flex: 1,
                    background: `linear-gradient(90deg, ${colors.primary} 0%, #ff7043 100%)`,
                    fontWeight: 600,
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.9rem",
                    minWidth: "auto",
                    transition: "0.3s",
                    ":hover": {
                      transform: "scale(1.01)",
                      background: "#a83200",
                    },
                  }}
                >
                  Buy Now
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ProductDetail;
