import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";

const socialIcons = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: YouTube, label: "YouTube" },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)",
        mt: 6,
        pt: { xs: 4, md: 6 },
        pb: 4,
        px: { xs: 3, sm: 5, md: 8 },
        borderTop: "1px solid rgba(255, 20, 147, 0.15)",
        fontFamily: "inherit",
      }}
    >
      {/* Content */}
      <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center">
        {/* Brand Description */}
        <Grid item xs={12} md={4} lg={3}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "deeppink",
              mb: 2,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Slay
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              mb: 2,
            }}
          >
            Your one-stop destination for{" "}
            <Box component="span" sx={{ color: "deeppink", fontWeight: 700 }}>
              trendsetting fashion
            </Box>{" "}
            that keeps you ahead of the curve and{" "}
            <Box component="span" sx={{ color: "deeppink", fontWeight: 700 }}>
              timeless styles
            </Box>{" "}
            that never go out of vogue — all curated to help you express your
            unique personality with confidence.
          </Typography>

          {/* Mobile Social Icons - Fine-Tuned */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.75, mb: 1.5, justifyContent: "center" }}>
            {socialIcons.map(({ icon: Icon, label }, idx) => (
              <IconButton
                key={idx}
                aria-label={label}
                sx={{
                  color: "deeppink",
                  backgroundColor: "rgba(255, 20, 147, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 20, 147, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                  p: 1, // Increased from 0.75
                }}
              >
                <Icon fontSize="medium" /> {/* Changed from small */}
              </IconButton>
            ))}
          </Box>
        </Grid>

        {/* Footer Link Sections */}
        {[
          { title: "Shop", links: ["New Arrivals", "Best Sellers", "Sale", "Collections"] },
          { title: "Support", links: ["Help Center", "Shipping Info", "Returns", "Contact Us"] },
          { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
        ].map(({ title, links }) => (
          <Grid item xs={6} sm={4} md={2} key={title}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#333",
                fontSize: "1rem",
              }}
            >
              {title}
            </Typography>
            {links.map((text) => (
              <Link
                href="#"
                key={text}
                underline="none"
                sx={{
                  display: "block",
                  mb: 1,
                  color: "#666",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "deeppink",
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {text}
              </Link>
            ))}
          </Grid>
        ))}

        {/* Newsletter Section */}
        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: "#333",
              fontSize: "1rem",
            }}
          >
            Stay Updated
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            Subscribe to get 10% off your first order and exclusive offers.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              mb: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Your email address"
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: "#fff",
                borderRadius: "6px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 20, 147, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "deeppink",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.875rem",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "deeppink",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "6px",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#c71585",
                  boxShadow: "0 4px 12px rgba(255, 20, 147, 0.4)",
                },
              }}
            >
              Subscribe
            </Button>
          </Box>

          {/* Desktop Social Icons - Unchanged */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, justifyContent: "center" }}>
            {socialIcons.map(({ icon: Icon, label }, idx) => (
              <IconButton
                key={idx}
                aria-label={label}
                sx={{
                  color: "deeppink",
                  backgroundColor: "rgba(255, 20, 147, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 20, 147, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                  p: 0.75,
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider
        sx={{
          my: 3,
          borderColor: "rgba(255, 20, 147, 0.2)",
        }}
      />

      {/* Bottom Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontSize: "0.85rem",
          }}
        >
          © {new Date().getFullYear()} Slay. All rights reserved.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          {["Privacy Policy", "Terms of Service", "Cookies"].map((text) => (
            <Link
              key={text}
              href="#"
              underline="none"
              sx={{
                color: "#666",
                fontSize: "0.85rem",
                "&:hover": { color: "deeppink" },
              }}
            >
              {text}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;