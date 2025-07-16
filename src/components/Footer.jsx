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
import colors from "../colors"; // Update path if necessary

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
        background: colors.drawerBg,
        pt: { xs: 4, md: 6 },
        pb: 4,
        px: { xs: 3, sm: 5, md: 8 },
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center">
        {/* Brand Description */}
        <Grid item xs={12} md={4} lg={3}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: colors.primary,
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Slay
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.icon,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              mb: 2,
            }}
          >
            Your one-stop destination for{" "}
            <Box component="span" sx={{ color: colors.primary, fontWeight: 700 }}>
              trendsetting fashion
            </Box>{" "}
            that keeps you ahead of the curve and{" "}
            <Box component="span" sx={{ color: colors.primary, fontWeight: 700 }}>
              timeless styles
            </Box>{" "}
            that never go out of vogue — all curated to help you express your
            unique personality with confidence.
          </Typography>

          {/* Mobile Social Icons */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              gap: 0.75,
              mb: 1.5,
              justifyContent: "center",
            }}
          >
            {socialIcons.map(({ icon: Icon, label }, idx) => (
              <IconButton
                key={idx}
                aria-label={label}
                sx={{
                  color: colors.primary,
                  backgroundColor: `${colors.primary}1A`,
                  "&:hover": {
                    backgroundColor: `${colors.primary}33`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                  p: 1,
                }}
              >
                <Icon fontSize="medium" />
              </IconButton>
            ))}
          </Box>
        </Grid>

        {/* Footer Links */}
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
                color: colors.icon,
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
                  color: colors.icon,
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: colors.primary,
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

        {/* Newsletter */}
        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: colors.icon,
              fontSize: "1rem",
            }}
          >
            Stay Updated
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.icon,
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
                backgroundColor: colors.cardBg,
                borderRadius: "6px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: `${colors.primary}4D`,
                  },
                  "&:hover fieldset": {
                    borderColor: colors.primary,
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
                backgroundColor: colors.primary,
                color: colors.badgeText,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "6px",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#A83200",
                  boxShadow: `0 4px 12px ${colors.primary}66`,
                },
              }}
            >
              Subscribe
            </Button>
          </Box>

          {/* Desktop Social Icons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, justifyContent: "center" }}>
            {socialIcons.map(({ icon: Icon, label }, idx) => (
              <IconButton
                key={idx}
                aria-label={label}
                sx={{
                  color: colors.primary,
                  backgroundColor: `${colors.primary}1A`,
                  "&:hover": {
                    backgroundColor: `${colors.primary}33`,
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

      <Divider
        sx={{
          my: 3,
          borderColor: `${colors.primary}50`,
          width: "100%",
          maxWidth: "1200px",
          height: "2px",
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
            color: colors.icon,
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
                color: colors.icon,
                fontSize: "0.85rem",
                "&:hover": { color: colors.primary },
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
