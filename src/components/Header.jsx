import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import colors from "../colors";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Badge,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  styled,
  useMediaQuery,
  useTheme,
  Divider,
  Link,
  Tooltip,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronRightOutlined,
} from "@mui/icons-material";
import logo from "../assets/SUMAN.png";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: colors.background,
  boxShadow: "0 2px 4px rgba(122, 78, 171, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: colors.icon,
  fontWeight: 600,
  letterSpacing: 1,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  minWidth: "unset",
  padding: theme.spacing(1, 1.5),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "2px",
    bottom: 0,
    left: 0,
    backgroundColor: colors.primary,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 250ms ease-in-out",
    borderRadius: "1px",
  },
  "&:hover": {
    backgroundColor: "transparent",
    color: colors.primary,
    "&::after": {
      transform: "scaleX(1)",
    },
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "0.875rem",
    padding: theme.spacing(1, 2),
  },
  [`@media (max-width:1400px)`]: {
    fontSize: "0.8rem",
    padding: theme.spacing(0.5, 1.2),
  },
  [`@media (max-width:1200px)`]: {
    fontSize: "0.75rem",
    padding: theme.spacing(0.5, 1),
  },
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  color: colors.icon,
  padding: theme.spacing(1),
  transition: "color 0.3s ease",
  "&:hover": {
    color: colors.primary,
    backgroundColor: "transparent",
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1, 1.5),
  },
}));

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  const handleNewArrivalsClick = (e) => {
    // If already on home page, scroll to section
    if (window.location.pathname === "/") {
      e.preventDefault();
      const newArrivalsSection = document.getElementById("new-arrivals");
      if (newArrivalsSection) {
        newArrivalsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
    // Otherwise, let the normal navigation happen (to /#new-arrivals)
  };

  // Define all nav items with route paths
  const navItems = [
    { label: "Home", path: "/" },
    {
      label: "New Arrivals",
      path: "/#new-arrivals",
      onClick: handleNewArrivalsClick,
    },
    { label: "Our Collection", path: "/collection" },
    { label: "Sale", path: "/sale" },
    { label: "About", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <StyledAppBar>
        <Toolbar
          sx={{
            position: "relative",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 2, md: 4 },
            minHeight: {
              xs: "60px",
              sm: "64px",
              md: "72px",
            },
          }}
        >
          {/* Left: Nav or Hamburger */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            {isTablet || isMobile ? (
              <Tooltip title="Open menu" arrow>
                <IconWrapper onClick={toggleDrawer(true)} aria-label="menu">
                  <MenuIcon />
                </IconWrapper>
              </Tooltip>
            ) : (
              <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 } }}>
                {navItems.slice(0, 4).map(({ label, path, onClick }) => (
                    <NavButton
                      component={RouterLink}
                      to={path}
                      onClick={onClick}
                    >
                      {label}
                    </NavButton>
                ))}
              </Box>
            )}
          </Box>

          {/* Center: Logo */}
          <Box
            sx={{
              position: isMobile || isTablet ? "absolute" : "static",
              left: isMobile || isTablet ? "50%" : "auto",
              transform: isMobile || isTablet ? "translateX(-50%)" : "none",
              textAlign: "center",
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            <Link component={RouterLink} to="/">
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  height: {
                    xs: 56,
                    sm: 60,
                    md: 62,
                    lg: 70,
                  },
                  mixBlendMode: "multiply",
                  objectFit: "contain",
                  maxWidth: {
                    xs: "160px",
                    sm: "180px",
                    md: "200px",
                  },
                }}
              />
            </Link>
          </Box>

          {/* Right Side: Remaining Buttons + Icons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.5, md: 1 },
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
            }}
          >
            {!isMobile &&
              navItems.slice(4).map(({ label, path }) => (
                  <NavButton component={RouterLink} to={path}>
                    {label}
                  </NavButton>
              ))}
            {!isMobile && (
              <Tooltip title="Account" arrow>
                <IconWrapper aria-label="account" component={RouterLink} to="/signup">
                  <AccountCircleIcon />
                </IconWrapper>
              </Tooltip>
            )}
            <Tooltip title="Wishlist" arrow>
              <IconWrapper aria-label="wishlist">
                <FavoriteBorderIcon />
              </IconWrapper>
            </Tooltip>
            <Tooltip title="Cart" arrow>
              <IconWrapper aria-label="cart">
                <Badge
                  badgeContent={2}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      right: 3,
                      top: 8,
                      backgroundColor: colors.badge,
                      color: colors.badgeText,
                      fontWeight: 600,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconWrapper>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Drawer for mobile */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{
            width: 260,
            backgroundColor: colors.drawerBg,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          role="presentation"
        >
          <Box>
            {/* Drawer Top Logo + Close */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1.5,
                backgroundColor: colors.accent,
              }}
            >
              <Link component={RouterLink} to="/" onClick={toggleDrawer(false)}>
                <Box
                  component="img"
                  src={logo}
                  alt="Logo"
                  sx={{
                    objectFit: "contain",
                    maxWidth: "120px",
                  }}
                />
              </Link>
              <IconButton onClick={toggleDrawer(false)}>
                <Tooltip title="Close menu" arrow>
                  <CloseIcon sx={{ color: colors.primary }} />
                </Tooltip>
              </IconButton>
            </Box>

            <Divider />

            {/* Drawer Nav Links */}
            <List disablePadding>
              {navItems.map(({ label, path, onClick }) => (
                <Tooltip title={label} arrow key={label}>
                  <ListItem
                    button
                    component={RouterLink}
                    to={path}
                    onClick={(e) => {
                      toggleDrawer(false)();
                      if (onClick) onClick(e);
                    }}
                    sx={{
                      borderTop: `1px solid ${colors.border}`,
                      borderBottom: `1px solid ${colors.border}`,
                      px: 2,
                      py: 1.2,
                      transition: "all 0.3s ease",
                      "&:hover .arrow-icon": {
                        transform: "translateX(6px)",
                        opacity: 1,
                      },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: 400,
                        color: colors.primary,
                      }}
                    />
                    <ChevronRightOutlined
                      className="arrow-icon"
                      sx={{
                        ml: 1,
                        fontSize: 20,
                        transition: "all 0.3s ease",
                        transform: "translateX(0)",
                        opacity: 0.7,
                        color: colors.primary,
                      }}
                    />
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </Box>

          {/* Bottom Account Shortcut */}
          <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
            <List disablePadding>
              <ListItem button component={RouterLink} to="/signup" onClick={toggleDrawer(false)}>
                <Tooltip title="Go to Account" arrow>
                  <AccountCircleIcon sx={{ color: colors.primary, mr: 1 }} />
                </Tooltip>
                <ListItemText
                  primary="My Account"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: colors.primary,
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default Header;
