import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import colors from "../colors";

const banners = [
  "https://yashnira.com/cdn/shop/files/yashnira-banner-2.jpg?v=1751443973&width=2000",
  "https://yashnira.com/cdn/shop/files/Second_Desktop_Landing_edf21aa0-75b8-490f-96d9-9d5975ccec30.jpg?v=1746795639&width=2000",
  "https://yashnira.com/cdn/shop/files/yashnira-banner_2.jpg?v=1751444725&width=2000",
];

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const extendedBanners = [banners[banners.length - 1], ...banners, banners[0]];
  const [index, setIndex] = useState(1); // start at first real slide
  const sliderRef = useRef(null);
  const timerRef = useRef(null);

  // Handle auto-slide
  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  // Smooth infinite loop handler (no flick)
  useEffect(() => {
    const total = extendedBanners.length;
    const slider = sliderRef.current;

    if (!slider) return;

    slider.style.transition = "transform 0.6s ease";
    slider.style.transform = `translateX(-${index * (100 / total)}%)`;

    // After transition ends, reset instantly without transition
    const handleTransitionEnd = () => {
      if (index === 0) {
        slider.style.transition = "none";
        setIndex(banners.length);
        slider.style.transform = `translateX(-${banners.length * (100 / total)}%)`;
      } else if (index === total - 1) {
        slider.style.transition = "none";
        setIndex(1);
        slider.style.transform = `translateX(-${100 / total}%)`;
      }
    };

    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [index, extendedBanners.length]);

  // Swipe support
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((prev) => prev + 1),
    onSwipedRight: () => setIndex((prev) => prev - 1),
    trackMouse: true,
  });

  return (
    <Box
      {...swipeHandlers}
      sx={{
        width: "100%",
        height: {
          sm: "calc(100vh - 64px)",
          md: "calc(100vh - 72px)",
        },
        minHeight: isMobile ? "300px" : "400px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Slide container */}
      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          width: `${extendedBanners.length * 100}%`,
          height: "100%",
        }}
      >
        {extendedBanners.map((img, i) => (
          <Box
            key={i}
            sx={{
              width: `${100 / extendedBanners.length}%`,
              height: "100%",
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </Box>

      {/* Dot Indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 10, sm: 20 },
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1.5,
        }}
      >
        {banners.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i + 1)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: index === i + 1 ? colors.primary : "#ccc",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Hero;
