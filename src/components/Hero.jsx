import React from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CircleIcon from "@mui/icons-material/Circle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Hero_Img from "../assets/Hero_Section.jpg"; // Ensure this path is correct

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(-5px); }
  50% { transform: translateY(5px); }
  100% { transform: translateY(-5px); }
`;

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0px rgba(255, 20, 147, 0.3), 0 0 20px rgba(255, 20, 147, 0.3);
  }
  50% {
    box-shadow: 0 0 4px rgba(255, 20, 147, 0.6), 0 0 40px rgba(255, 20, 147, 0.4);
  }
  100% {
    box-shadow: 0 0 0px rgba(255, 20, 147, 0.3), 0 0 20px rgba(255, 20, 147, 0.3);
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
`;

const Hero = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: { xs: "column-reverse", md: "row" },
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        pt: { xs: 10, sm: 8, md: 6 }, // Added top padding for navbar (64px+)
        pb: { xs: 4, sm: 6, md: 10 },
        gap: { xs: 4, sm: 6, md: 8 },
        minHeight: { xs: "auto", md: "calc(100vh - 64px)" }, // Adjust for navbar
        background: "linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: { xs: -50, md: -100 },
          right: { xs: -50, md: -100 },
          width: { xs: 200, md: 300 },
          height: { xs: 200, md: 300 },
          borderRadius: "50%",
          background: "rgba(255, 20, 147, 0.1)",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: { xs: -25, md: -50 },
          left: { xs: -25, md: -50 },
          width: { xs: 150, md: 200 },
          height: { xs: 150, md: 200 },
          borderRadius: "50%",
          background: "rgba(255, 20, 147, 0.08)",
          zIndex: 0,
        },
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          gap: { xs: 2, sm: 3 },
          py: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 1,
          width: { xs: "100%", md: "50%" }, // Ensure full width on mobile
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "deeppink",
            fontWeight: 600,
            letterSpacing: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          <CircleIcon sx={{ fontSize: { xs: 6, sm: 8 } }} /> NEW COLLECTION
        </Typography>

        <Box sx={{ maxWidth: { xs: "100%", sm: "500px", md: "600px" } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: "deeppink",
              fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem", lg: "4rem" },
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            Unleash Your{" "}
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              Inner Glam{" "}
              <AutoAwesomeIcon
                sx={{
                  fontSize: { xs: "0.9em", sm: "1em" },
                  verticalAlign: "middle",
                  color: "linear-gradient(90deg, #ff7931ff, #ffee33ff)",
                  animation: `${floatAnimation} 3s ease-in-out infinite`,
                }}
              />
            </Box>
          </Typography>

          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "text.secondary",
              mb: 3,
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
              lineHeight: 1.6,
            }}
          >
            Elevate your wardrobe with our exclusive collection designed for the
            modern trendsetter. Discover premium fabrics and contemporary
            designs that redefine elegance.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          sx={{ mb: 3, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "deeppink",
              color: "white",
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 1, sm: 1.5 },
              fontWeight: 700,
              borderRadius: "50px",
              textTransform: "none",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              position: "relative",
              overflow: "hidden",
              animation: `${pulseGlow} 2.5s ease-in-out infinite`,
              transition: "all 0.3s ease",
              width: { xs: "100%", sm: "auto" },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
                transform: "skewX(-20deg)",
                animation: `${shimmer} 2.5s infinite`,
              },
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            Shop Collection
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "deeppink",
              color: "deeppink",
              backgroundColor: "white",
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 1, sm: 1.5 },
              fontWeight: 700,
              borderRadius: "50px",
              textTransform: "none",
              borderWidth: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "rgba(255, 20, 147, 0.05)",
                borderWidth: "2px",
                boxShadow: "0 0 15px rgba(255, 20, 147, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View Lookbook
          </Button>
        </Stack>

        <Divider
          sx={{
            width: "100%",
            borderColor: "rgba(255, 20, 147, 0.3)",
            borderBottomWidth: 3,
            my: { xs: 1.5, sm: 2 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 4 },
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {[
            { value: "200+", label: "New Arrivals" },
            { value: "50%", label: "Summer Sale" },
            { value: "24/7", label: "Support" },
          ].map((item, index) => (
            <Box key={index} sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "deeppink",
                  mb: 0.5,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {item.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: { xs: 1.5, sm: 2 },
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              "& svg": {
                color: "gold",
                fontSize: { xs: "1rem", sm: "1.25rem" },
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
              },
            }}
          >
            {[...Array(5)].map((_, i) => (
              <AutoAwesomeIcon key={i} />
            ))}
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              letterSpacing: "0.3px",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            Trusted by 10,000+ fashion lovers
          </Typography>
        </Box>
      </Box>

      {/* Right Side Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          width: { xs: "100%", md: "50%" }, // Ensure full width on mobile
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "80%", md: "100%" },
            maxWidth: { xs: "400px", sm: "500px", md: "600px" },
            "&::before": {
              content: '""',
              position: "absolute",
              top: { xs: -10, sm: -15, md: -20 },
              left: { xs: -10, sm: -15, md: -20 },
              right: { xs: 10, sm: 15, md: 20 },
              bottom: { xs: 10, sm: 15, md: 20 },
              border: "2px solid deeppink",
              borderRadius: "2rem",
              zIndex: -1,
              opacity: 0.5,
            },
          }}
        >
          <img
            src={Hero_Img}
            alt="Fashion Model"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: { xs: "400px", sm: "500px", md: "600px", lg: "700px" },
              borderRadius: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transform: "perspective(1000px) rotateY(-5deg)",
              transition: "transform 0.5s ease, box-shadow 0.5s ease",
            }}
            sx={{
              "&:hover": {
                transform: "perspective(1000px) rotateY(0deg)",
                boxShadow: "0 30px 60px -10px rgba(0, 0, 0, 0.3)",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;