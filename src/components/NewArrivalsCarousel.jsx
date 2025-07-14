import React from "react";
import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import clothesData from "../data/clothes.json";


const NewArrivalsCarousel = () => {
  const newArrivals = clothesData.filter((item) => item.isNewArrival);

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
      <Typography
        variant="h4"
        sx={{
          color: "deeppink",
          textAlign: "center",
          fontWeight: 800,
          mb: 4,
          letterSpacing: 1,
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        New Arrivals
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        style={{
          paddingBottom: 40, // Space for pagination
          "--swiper-navigation-color": "deeppink",
          "--swiper-pagination-color": "deeppink",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-horizontal-gap": "6px"
        }}
      >
        {newArrivals.map((item) => (
          <SwiperSlide key={item.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(255, 20, 147, 0.2)",
                },
              }}
            >
              <Box sx={{ position: "relative", pt: "125%", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                {item.isNewArrival && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "deeppink",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      zIndex: 1,
                    }}
                  >
                    NEW
                  </Box>
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, px: 2, py: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  ₹{item.price.toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "deeppink",
                    color: "white",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    py: 1,
                    boxShadow: "0 4px 12px rgba(255, 20, 147, 0.3)",
                    "&:hover": {
                      backgroundColor: "#c71585",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(255, 20, 147, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default NewArrivalsCarousel;