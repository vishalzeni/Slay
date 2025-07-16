import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import colors from "../colors";

const banners = [
  "https://yashnira.com/cdn/shop/files/yashnira-banner-2.jpg?v=1751443973&width=2000",
  "https://yashnira.com/cdn/shop/files/Second_Desktop_Landing_edf21aa0-75b8-490f-96d9-9d5975ccec30.jpg?v=1746795639&width=2000",
  "https://yashnira.com/cdn/shop/files/yashnira-banner_2.jpg?v=1751444725&width=2000",
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
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
      <SwipeableViews
        index={index}
        onChangeIndex={setIndex}
        enableMouseEvents
        style={{ height: "100%" }}
        containerStyle={{ height: "100%" }}
      >
        {banners.map((image, i) => (
          <Box
            key={i}
            sx={{
              height: "100%",
              width: "100%",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </SwipeableViews>

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
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: index === i ? colors.primary : "#ccc",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Hero;
