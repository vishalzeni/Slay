import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import colors from "./colors";
import aboutHero from "./assets/SUMAN.png";
import textureBg from "./assets/texturePattern.png";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useEffect } from "react";

const AboutContainer = styled(Box)({
  backgroundColor: colors.background,
  minHeight: "100vh",
  overflow: "hidden",
});

const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "70vh",
  minHeight: "500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  [theme.breakpoints.down("md")]: {
    height: "50vh",
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  zIndex: 2,
  maxWidth: "1200px",
  margin: "0 auto",
  padding: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(6),
  flexWrap: "wrap",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    textAlign: "center",
    gap: theme.spacing(4),
  },
}));

const HeroText = styled(Box)({
  flex: 1,
});

const HeroImage = styled(Box)(({ theme }) => ({
  flex: 1,
  borderRadius: "16px",
  overflow: "hidden",
  maxWidth: "600px",
  width: "100%",
  height: "100%",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
    display: "block",
  },
  "&:hover img": {
    transform: "scale(1.03)",
  },
  [theme.breakpoints.down("sm")]: {
    height: "300px",
  },
}));

const SectionTitle = styled(Typography)(() => ({
  position: "relative",
  display: "inline-block",
}));

const ProductCard = styled(Box)(({ theme }) => ({
  backgroundColor: colors.cardBg,
  borderRadius: "16px",
  padding: theme.spacing(3),
  maxWidth: "250px",
  minHeight: "320px",
  margin: "0 auto",
  textAlign: "center",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: `1px solid ${colors.border}`,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 20px 25px -5px rgba(190, 57, 0, 0.1), 0 10px 10px -5px rgba(190, 57, 0, 0.04)`,
    borderColor: colors.primary,
  },
}));

const IconCircle = styled(Box)(({ theme }) => ({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  backgroundColor: colors.accent,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  color: colors.primary,
  border: `2px solid ${colors.primary}`,
  marginBottom: theme.spacing(3),
}));

function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const productCategories = [
    {
      title: "Ethnic Elegance",
      description:
        "Exquisitely crafted traditional wear blending heritage with contemporary silhouettes for modern women.",
      icon: "👘",
    },
    {
      title: "Casual Chic",
      description:
        "Effortlessly stylish everyday wear designed for comfort without compromising on elegance.",
      icon: "👚",
    },
    {
      title: "Office Sophistication",
      description:
        "Powerful yet feminine workwear that commands respect while celebrating your individuality.",
      icon: "💼",
    },
    {
      title: "Accessory Artistry",
      description:
        "Handpicked jewelry and accents that complete your look with finesse and personality.",
      icon: "💎",
    },
  ];
useEffect(() => {
    // Scroll to top on mount   
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    <Header/>
    <AboutContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroText
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, rgba(254,239,230) 100%)`,
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: colors.primary,
                fontSize: isMobile ? "2rem" : "2.5rem",
              fontWeight: 600,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Our Story
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: isMobile ? "1rem" : "1.1rem",
                color: "#555",
                lineHeight: 1.8,
                maxWidth: "600px",

                mb: 2,
              }}
            >
              Since 2015, we've been redefining women's fashion by blending
              traditional craftsmanship with contemporary design. Our
              collections celebrate the modern woman — strong, graceful, and
              unapologetically herself.
            </Typography>
          </HeroText>
          {!isMobile &&(
             <HeroImage>
            <img
              src={aboutHero}
              alt="Showcasing our fashion line"
              loading="lazy"
            />
          </HeroImage>
          )}
         
        </HeroContent>
      </HeroSection>

      {/* Products Section */}
      <Box
        sx={{
          py: 8,
          px: isMobile ? 2 : 4,
          backgroundColor: colors.background,
          backgroundImage: `url(${textureBg})`,
          backgroundAttachment: "fixed",
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            mb: 8,
            textAlign: "center",
          }}
        >
          <SectionTitle
            variant="h2"
            sx={{
              color: colors.primary,
              fontSize: isMobile ? "2rem" : "2.5rem",
              fontWeight: 600,
              mb: 6,
            }}
          >
            Our Collections
          </SectionTitle>
          <Typography
            variant="body1"
            sx={{
              fontSize: isMobile ? "1rem" : "1.1rem",
              color: "#555",
              lineHeight: 1.8,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Each piece in our collection tells a story of craftsmanship,
            quality, and timeless design. Discover categories that celebrate
            your unique style.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {productCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ProductCard>
                <IconCircle>{category.icon}</IconCircle>
                <Typography
                  variant="h3"
                  sx={{
                    color: colors.primary,
                    mb: 2,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {category.description}
                </Typography>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Philosophy Section */}
      <Box
        sx={{
          py: 8,
          px: isMobile ? 2 : 4,
          backgroundColor: colors.cardBg,
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            p: 4,
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${colors.accent} 0%, rgba(254,239,230) 100%)`,
              opacity: 0.2,
              borderRadius: "16px",
              zIndex: 0,
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: colors.primary,
              mb: 3,
              fontSize: isMobile ? "1.8rem" : "2.2rem",
              fontWeight: 600,
              position: "relative",
              zIndex: 1,
            }}
          >
            Our Philosophy
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: isMobile ? "1rem" : "1.1rem",
              color: "#555",
              lineHeight: 1.8,
              position: "relative",
              zIndex: 1,
              textAlign: "left",
            }}
          >
            We believe true style is sustainable. Each garment is ethically
            sourced and crafted to last beyond seasons. Our designs empower
            women to feel confident while making conscious choices — because
            looking good should never come at the cost of your values.
          </Typography>
        </Box>
      </Box>
    </AboutContainer>
    <Footer />
        </>

  );
}

export default AboutPage;
