import React, { useState } from "react";
import colors from "../colors";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
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
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: colors.background,
  boxShadow: "0 2px 4px rgba(122, 78, 171, 0.1)", // subtle shadow
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
}));


const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 1.5,
  color: colors.primary,
  fontSize: "1.5rem",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  [theme.breakpoints.up("md")]: {
    fontSize: "1.75rem",
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

  const navItems = ["New Arrivals", "Our Collection", "Sale", "Contact Us"];

  return (
    <>
      <StyledAppBar>
       <Toolbar
  sx={{
    position: "relative",
    justifyContent: "space-between",
    px: { xs: 1, sm: 2, md: 4 },
    minHeight: {  sm: "64px", md: "72px" }, // <-- responsive heights
  }}
>

          {/* Left: Menu on Mobile */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            {isTablet || isMobile ? (
              <IconWrapper onClick={toggleDrawer(true)} aria-label="menu">
                <MenuIcon />
              </IconWrapper>
            ) : (
              <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 } }}>
                {navItems.map((label) => (
                  <NavButton key={label}>{label}</NavButton>
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
            <LogoText variant="h1">Slay</LogoText>
          </Box>

          {/* Right: Icons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0, sm: 1 },
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
            }}
          >
            {!isMobile && (
              <IconWrapper aria-label="account">
                <AccountCircleIcon />
              </IconWrapper>
            )}
            <IconWrapper aria-label="wishlist">
              <FavoriteBorderIcon />
            </IconWrapper>
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
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
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
          {/* Top Header */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                backgroundColor: colors.accent,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: colors.primary,
                }}
              >
                Menu
              </Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon sx={{ color: colors.primary }} />
              </IconButton>
            </Box>

            <Divider />

            <List>
              {navItems.map((text) => (
                <ListItem button key={text} onClick={toggleDrawer(false)}>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: colors.primary,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Bottom Account Section */}
          <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
            <List>
              <ListItem button onClick={toggleDrawer(false)}>
                <AccountCircleIcon sx={{ color: colors.primary, mr: 1 }} />
                <ListItemText
                  primary="My Account"
                  primaryTypographyProps={{
                    fontWeight: 600,
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
