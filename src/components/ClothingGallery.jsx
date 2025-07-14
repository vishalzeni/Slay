import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import clothesData from "../data/clothes.json";

const ClothingGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredClothes, setFilteredClothes] = useState(clothesData);

  // Extract unique categories from JSON
  const categories = ["All", ...new Set(clothesData.map((item) => item.category))];

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredClothes(clothesData);
    } else {
      setFilteredClothes(
        clothesData.filter((item) => item.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 6 },
        maxWidth: "1440px",
        mx: "auto",
        background: "linear-gradient(to bottom, #fff0f5 0%, #ffffff 50%)",
      }}
    >
      {/* Section Heading */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color: "deeppink",
          fontWeight: 800,
          mb: 3,
          letterSpacing: 1,
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        Our Collection
      </Typography>

      {/* Category Chips */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "center",
          mb: 4,
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            sx={{
              fontWeight: 600,
              textTransform: "capitalize",
              borderRadius: "20px",
              px: 2,
              cursor: "pointer",
              backgroundColor: selectedCategory === category ? "deeppink" : "transparent",
              color: selectedCategory === category ? "white" : "deeppink",
              border: selectedCategory === category ? "none" : "2px solid deeppink",
              "&:hover": {
                backgroundColor: selectedCategory === category ? "#c71585" : "rgba(255, 20, 147, 0.1)",
              },
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>

      {/* Clothing Grid - Centered Cards Section */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        {filteredClothes.map((item) => (
          <Grid item key={item.id} xs={12} sm={4} md={3}>
            <Card
              sx={{
                width: { xs: 300, md: 250 }, // Fixed 300px on mobile, 250px on larger screens
                minHeight: 400, // Allow card to grow taller for image
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(255, 20, 147, 0.2)",
                },
              }}
            >
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: "auto", // Let image height adjust to aspect ratio
                    transition: "transform 0.5s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, px: 2, py: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontWeight: 600,
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                  }}
                >
                  ₹{item.price.toLocaleString()}
                </Typography>
                {!item.inStock && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "red",
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                      mt: 0.5,
                    }}
                  >
                    Out of Stock
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!item.inStock}
                  sx={{
                    backgroundColor: item.inStock ? "deeppink" : "grey.400",
                    color: "white",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    py: 0.75,
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
                    boxShadow: item.inStock ? "0 4px 12px rgba(255, 20, 147, 0.3)" : "none",
                    "&:hover": item.inStock
                      ? {
                          backgroundColor: "#c71585",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(255, 20, 147, 0.4)",
                        }
                      : {},
                    transition: item.inStock ? "all 0.3s ease" : "none",
                    cursor: item.inStock ? "pointer" : "not-allowed",
                  }}
                >
                  {item.inStock ? "Add to Cart" : "Unavailable"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClothingGallery;