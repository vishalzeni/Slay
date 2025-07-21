import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import data from "../data/clothes.json";
import colors from "../colors";

const groupByCategory = (items) => {
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return grouped;
};

const PremiumCard = styled(Card)(({ theme }) => ({
  width: 270,
  borderRadius: 12,
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  overflow: "visible",
  position: "relative",
  background: colors.cardBg,
  border: `1px solid ${colors.border}`,
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 16px 30px rgba(0,0,0,0.15)",
    borderColor: colors.primary,
  },
  [theme.breakpoints.down("sm")]: {
    width: 200,
  },
}));

const ClothingGallery = () => {
  const groupedItems = groupByCategory(data);
  const scrollRefs = useRef({});
  const [showNav, setShowNav] = useState({});

  useEffect(() => {
    const checkOverflow = () => {
      const result = {};
      Object.keys(scrollRefs.current).forEach((category) => {
        const el = scrollRefs.current[category];
        if (el && el.scrollWidth > el.clientWidth) {
          result[category] = true;
        } else {
          result[category] = false;
        }
      });
      setShowNav(result);
    };
    setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [groupedItems]);

  const handleScroll = (category, direction) => {
    const container = scrollRefs.current[category];
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 1, md: 4 },
        py: { xs: 4, md: 6 },
        bgcolor: colors.background,
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {Object.entries(groupedItems).map(([category, items]) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: colors.primary,
              textTransform: "uppercase",
              mb: 3,
              letterSpacing: 1,
            }}
          >
            {category}
          </Typography>

          <Box sx={{ position: "relative" }}>
            {showNav[category] && (
              <IconButton
                onClick={() => handleScroll(category, "left")}
                sx={{
                  position: "absolute",
                  left: -28,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  backgroundColor: "#fff",
                  color: colors.primary,
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: colors.primary,
                    color: "#fff",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
            )}

            <Box
              ref={(el) => (scrollRefs.current[category] = el)}
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: { xs: 2, md: 3 },
                px: { xs: 1, md: 2 },
                pb: 3,
                scrollSnapType: "x mandatory",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{ flex: "0 0 auto", scrollSnapAlign: "start", mt: 2 }}
                >
                  <Link
                    to={`/product/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <PremiumCard>
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{
                          height: { xs: 220, sm: 300 }, // Increased height
                          objectFit: "cover",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      />

                      {item.isNewArrival && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            backgroundColor: colors.primary,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      )}

                      <CardContent sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          {item.name}
                        </Typography>

                        <Box sx={{ textAlign: "center", mb: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ color: colors.primary }}
                          >
                            ₹{item.price.toLocaleString()}
                          </Typography>

                          {item.marketPrice > item.price && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#888",
                                  textDecoration: "line-through",
                                }}
                              >
                                ₹{item.marketPrice}
                              </Typography>
                              <Chip
                                label={`${Math.round(
                                  ((item.marketPrice - item.price) /
                                    item.marketPrice) *
                                    100
                                )}% OFF`}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(190, 57, 0, 0.1)",
                                  color: colors.primary,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </PremiumCard>
                  </Link>
                </Box>
              ))}
            </Box>

            {showNav[category] && (
              <IconButton
                onClick={() => handleScroll(category, "right")}
                sx={{
                  position: "absolute",
                  right: -28,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  backgroundColor: "#fff",
                  color: colors.primary,
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: colors.primary,
                    color: "#fff",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Link
              to={`/category/${encodeURIComponent(category)}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                component="button"
                sx={{
                  backgroundColor: colors.primary,
                  color: colors.badgeText,
                  px: 3.5,
                  py: 1.5,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#a83200",
                  },
                }}
              >
                View All
              </Box>
            </Link>
          </Box>
          <Divider sx={{ my: 4, borderBottomWidth:"2px", borderColor: colors.border }} />
        </Box>
      ))}
    </Box>
  );
};

export default ClothingGallery;
