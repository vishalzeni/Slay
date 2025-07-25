import { Link } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import clothesData from "../data/clothes.json";
import colors from "../colors";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const NewArrivalsCarousel = ({ id }) => {
  const newArrivals = clothesData.filter((item) => item.isNewArrival);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 6 },
        maxWidth: "1440px",
        mx: "auto",
        background: colors.background,
        position: "relative",
      }}
      id={id}
    >
      <Typography
        variant="h4"
        sx={{
          color: colors.primary,
          textAlign: "center",
          fontWeight: 800,
          mb: 4,
          textTransform: "uppercase",
        }}
      >
        New Arrivals
      </Typography>

      {/* Custom Nav Buttons */}
      <IconButton
        className="new-arrivals-prev"
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "#fff",
          color: colors.primary,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: colors.primary,
            color: "#fff",
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        className="new-arrivals-next"
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "#fff",
          color: colors.primary,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: colors.primary,
            color: "#fff",
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".new-arrivals-prev",
          nextEl: ".new-arrivals-next",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        style={{
          paddingBottom: 40,
        }}
      >
        {newArrivals.map((item) => (
          <SwiperSlide key={item.id}>
            <Link to={`/product/${item.id}`} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.cardBg,
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ position: "relative", pt: "125%" }}>
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
                      transition: "transform 0.4s ease",
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
                        backgroundColor: colors.primary,
                        color: "#fff",
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
                      color: "#222",
                      mb: 0.5,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: 400, // not bold
                    }}
                  >
                    {item.name}
                  </Typography>

                  {/* Price + Offer */}
                  <Box sx={{ mb: 0.5, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.primary,
                        fontSize: "1rem",
                        fontWeight: 600, // not bold
                      }}
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
                            fontSize: "0.85rem",
                            fontWeight: 400,
                          }}
                        >
                          ₹{item.marketPrice.toLocaleString()}
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
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #ddd !important;
            opacity: 1 !important;
          }

          .swiper-pagination-bullet-active {
            background-color: ${colors.primary} !important;
          }

          .swiper-pagination {
            bottom: 8px !important;
          }
        `}
      </style>
    </Box>
  );
};

export default NewArrivalsCarousel;
