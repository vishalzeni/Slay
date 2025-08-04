import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Slider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Drawer,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import colors from "../colors";
import Header from "./Header";
import Footer from "./Footer";

const PremiumCard = styled(Card)({
  width: "100%",
  borderRadius: 5,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  overflow: "visible",
  position: "relative",
  background: colors.cardBg,
  border: `1px solid ${colors.border}`,
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    borderColor: colors.primary,
  },
});

const CategoryPage = () => {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);
  const isMobile = useMediaQuery("(max-width:768px)");

  const [productsInCategory, setProductsInCategory] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    newArrivalOnly: false,
    sort: "default",
  });

  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    // Fetch products for this category from backend
    fetch(
      `http://localhost:5000/api/products?category=${encodeURIComponent(
        decodedCategory
      )}&limit=1000`
    )
      .then((res) => res.json())
      .then((res) => setProductsInCategory(res.products || []))
      .catch(() => setProductsInCategory([]));
  }, [decodedCategory]);

  const handlePriceChange = (_, newValue) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    setFilters((prev) => ({ ...prev, newArrivalOnly: e.target.checked }));
  };

  const filteredProducts = useMemo(() => {
    let result = productsInCategory.filter(
      (item) =>
        item.price >= filters.priceRange[0] &&
        item.price <= filters.priceRange[1]
    );

    if (filters.newArrivalOnly) {
      result = result.filter((item) => item.isNewArrival);
    }

    switch (filters.sort) {
      case "lowToHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "highToLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [productsInCategory, filters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderFilters = (
    <Box
      sx={{
        p: 2,
        minWidth: 240,
        bgcolor: colors.drawerBg,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: colors.primary }}
      >
        Filters & Sorting
      </Typography>

      {/* ---- Price Range ---- */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, color: colors.icon, fontWeight: 500 }}
        >
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={5000}
          step={100}
          sx={{ color: colors.primary }}
        />
        <Typography variant="caption" sx={{ color: colors.icon }}>
          ₹{filters.priceRange[0]} – ₹{filters.priceRange[1]}
        </Typography>
      </Box>

      <Divider
        sx={{ my: 2, borderBottomWidth: "2px", borderColor: colors.border }}
      />

      {/* ---- New Arrival Only ---- */}
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.newArrivalOnly}
            onChange={handleCheckboxChange}
            size="small"
            sx={{
              color: colors.primary,
              "&.Mui-checked": { color: colors.primary },
            }}
          />
        }
        label="New Arrivals Only"
        sx={{ color: colors.icon }}
      />

      <Divider
        sx={{ my: 2, borderBottomWidth: "2px", borderColor: colors.border }}
      />

      {/* ---- Sort Options ---- */}
      <FormControl component="fieldset">
        <FormLabel
          component="legend"
          sx={{
            fontSize: "0.9rem",
            mb: 1,
            color: colors.icon,
            fontWeight: 500,
          }}
        >
          Sort By
        </FormLabel>
        <RadioGroup value={filters.sort} onChange={handleSortChange}>
          {[
            { value: "default", label: "Default" },
            { value: "lowToHigh", label: "Price: Low to High" },
            { value: "highToLow", label: "Price: High to Low" },
            { value: "nameAsc", label: "Name: A–Z" },
            { value: "nameDesc", label: "Name: Z–A" },
          ].map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: colors.primary,
                    "&.Mui-checked": { color: colors.primary },
                  }}
                />
              }
              label={option.label}
              sx={{ color: colors.icon }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );

  return (
    <>
      <Header />
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
          bgcolor: colors.background,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: colors.primary,
            textTransform: "uppercase",
            mb: 4,
          }}
        >
          {decodedCategory}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {!isMobile && <Box sx={{ width: 240 }}>{renderFilters}</Box>}

          {isMobile && (
            <>
              <Box sx={{ mb: 3 }}>
                <IconButton
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    color: colors.primary,
                  }}
                >
                  <FilterListIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">Filters</Typography>
                </IconButton>
              </Box>

              <Drawer
                anchor="left"
                open={isFilterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{ sx: { bgcolor: colors.drawerBg } }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ color: colors.primary }}>
                    Filters
                  </Typography>
                  <IconButton onClick={() => setFilterDrawerOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider />
                {renderFilters}
              </Drawer>
            </>
          )}

          <Box sx={{ flexGrow: 1 }}>
            {filteredProducts.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 4, color: "#666" }}>
                No products found with selected filters.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {filteredProducts.map((item) => (
                  <Link
                    to={`/product/${item.id}`}
                    key={item.id}
                    style={{ textDecoration: "none" }}
                  >
                    <PremiumCard>
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{
                          height: { xs: 220, sm: 300 },
                          objectFit: "cover",
                          borderRadius: "5px 5px 0 0",
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
                            backgroundColor: colors.badge,
                            color: colors.badgeText,
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
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default CategoryPage;
