import React, { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronRightOutlined,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PermIdentity as PermIdentityIcon,
  Edit as EditIcon,
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

function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", avatar: "" });
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);

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

  const handleAvatarClick = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleLogoutClick = () => {
    setDialogOpen(false);
    handleLogout();
  };

  const handleSignup = () => {
    setDialogOpen(false);
    navigate("/signup");
  };

  const handleLogin = () => {
    setDialogOpen(false);
    navigate("/login");
  };

  // For mobile drawer: handle avatar click
  const handleDrawerAvatarClick = () => {
    setDialogOpen(true);
    setDrawerOpen(false);
  };

  // For dialog edit
  const startEdit = () => {
    setEditForm({ name: user.name, phone: user.phone, avatar: user.avatar || "" });
    setEditMode(true);
  };
  const cancelEdit = () => setEditMode(false);

  // Handle profile pic upload (convert to base64)
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((f) => ({ ...f, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    // Save to context and localStorage
    const updated = { ...user, name: editForm.name, phone: editForm.phone, avatar: editForm.avatar };
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updated));
    }
    if (typeof handleLogout === "function") {
      // Use setUser if available in context, else fallback
      if (typeof window !== "undefined" && window.dispatchEvent) {
        // Notify other tabs
        window.dispatchEvent(new Event("storage"));
      }
    }
    if (typeof window !== "undefined" && window.location) {
      // Update context
      if (typeof window.__setUser === "function") window.__setUser(updated);
    }
    if (typeof window !== "undefined" && window.location) {
      // Fallback: reload to update context
      window.location.reload();
    }
    setEditMode(false);
    setDialogOpen(false);
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
                <NavButton component={RouterLink} to={path} key={label}>
                  {label}
                </NavButton>
              ))}
            {!isMobile && (
              user ? (
                <Tooltip title={user.name} arrow>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      bgcolor: colors.primary,
                      color: colors.badgeText,
                      fontWeight: 700,
                      width: 36,
                      height: 36,
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      border: `2px solid ${colors.primary}`,
                      boxShadow: `0 2px 8px ${colors.primary}22`,
                    }}
                    onClick={handleAvatarClick}
                  >
                    {!user.avatar && getInitials(user.name)}
                  </Avatar>
                </Tooltip>
              ) : (
                <Tooltip title="Account" arrow>
                  <IconWrapper aria-label="account" onClick={handleAvatarClick}>
                    <AccountCircleIcon />
                  </IconWrapper>
                </Tooltip>
              )
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
              {user ? (
                <ListItem
                  button
                  onClick={handleDrawerAvatarClick}
                  sx={{
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      bgcolor: colors.primary,
                      color: colors.badgeText,
                      fontWeight: 700,
                      width: 36,
                      height: 36,
                      fontSize: "1.1rem",
                      border: `2px solid ${colors.primary}`,
                      boxShadow: `0 2px 8px ${colors.primary}22`,
                    }}
                  >
                    {!user.avatar && getInitials(user.name)}
                  </Avatar>
                  <ListItemText
                    primary={user.name}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: colors.primary,
                    }}
                  />
                </ListItem>
              ) : (
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
              )}
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Account Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: colors.cardBg,
            boxShadow: `0 8px 32px ${colors.primary}33`,
            p: 2,
            position: "relative",
          },
        }}
      >
        {/* Close Icon */}
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: colors.primary,
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ textAlign: "center", color: colors.primary, fontWeight: 700 }}>
          {user ? "Account Info" : "Welcome"}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {user ? (
            <>
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={editMode ? editForm.avatar : user.avatar}
                  sx={{
                    bgcolor: colors.primary,
                    color: colors.badgeText,
                    fontWeight: 700,
                    width: 56,
                    height: 56,
                    fontSize: "1.5rem",
                    mx: "auto",
                    border: `2px solid ${colors.primary}`,
                    boxShadow: `0 2px 8px ${colors.primary}22`,
                  }}
                >
                  {!(editMode ? editForm.avatar : user.avatar) && getInitials(user.name)}
                </Avatar>
                {editMode && (
                  <Box sx={{ mt: 1 }}>
                    <input
                      accept="image/*"
                      type="file"
                      style={{ display: "none" }}
                      id="avatar-upload"
                      onChange={handleAvatarUpload}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        variant="outlined"
                        size="small"
                        component="span"
                        sx={{
                          mt: 1,
                          fontSize: "0.85rem",
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                          color: colors.primary,
                          borderColor: colors.primary,
                          "&:hover": { background: colors.accent },
                        }}
                      >
                        Upload Photo
                      </Button>
                    </label>
                  </Box>
                )}
              </Box>
              {!editMode ? (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary }}>
                    {user.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: colors.primary, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: colors.icon }}>
                      {user.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: colors.primary, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: colors.icon }}>
                      {user.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
                    <PermIdentityIcon sx={{ color: colors.primary, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: colors.icon }}>
                      {user.userId}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: colors.primary,
                        border: "1px solid " + colors.primary,
                        borderRadius: 4,
                        padding: "6px 10px",
                        marginBottom: 8,
                        width: "80%",
                        marginTop: 8,
                      }}
                      placeholder="Name"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      style={{
                        fontWeight: 500,
                        fontSize: "1rem",
                        color: colors.primary,
                        border: "1px solid " + colors.primary,
                        borderRadius: 4,
                        padding: "6px 10px",
                        width: "80%",
                      }}
                      placeholder="Phone"
                    />
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
              <Typography sx={{ mb: 2, color: colors.icon }}>
                Please login or signup to access your account.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          {user ? (
            !editMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{
                    color: colors.primary,
                    borderColor: colors.primary,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    "&:hover": { background: colors.accent },
                  }}
                  onClick={startEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: colors.primary,
                    color: colors.badgeText,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    "&:hover": { background: "#a83200" },
                  }}
                  onClick={handleLogoutClick}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    color: colors.primary,
                    borderColor: colors.primary,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    "&:hover": { background: colors.accent },
                  }}
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: colors.primary,
                    color: colors.badgeText,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    "&:hover": { background: "#a83200" },
                  }}
                  onClick={saveEdit}
                >
                  Save
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                variant="contained"
                sx={{
                  background: colors.primary,
                  color: colors.badgeText,
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  mr: 1,
                  "&:hover": { background: "#a83200" },
                }}
                onClick={handleSignup}
              >
                Signup
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: colors.primary,
                  borderColor: colors.primary,
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  "&:hover": { background: colors.accent },
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;
