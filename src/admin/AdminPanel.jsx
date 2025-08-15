import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import {
  AddCircleOutline,
  Inventory as InventoryIcon,
  Menu,
  Close,
  Campaign as CampaignIcon,
} from "@mui/icons-material";

import StorefrontIcon from '@mui/icons-material/Storefront';
import colors from "../colors";
import AddProduct from "./AddProduct";
import Inventory from "./Inventory";
import Announcements from "./Announcements";
import UsersList from "./UsersList"; // <-- Add this import
import BannerList from "./BannerList";

const sidebarItems = [
  { text: "Add Product", icon: <AddCircleOutline /> },
  { text: "Inventory", icon: <InventoryIcon /> },
  { text: "Announcements", icon: <CampaignIcon /> },
  { text: "Users", icon: <Dashboard /> },
  { text: "Banners", icon: <StorefrontIcon /> },
];

const AdminPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sidebarOpen")) ?? true;
    } catch {
      return true;
    }
  });
  const [selected, setSelected] = useState(0);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      const newState = !desktopOpen;
      setDesktopOpen(newState);
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        p: 2,
        bgcolor: colors.drawerBg,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...(!desktopOpen &&
          !isMobile && {
            alignItems: "center",
            justifyContent: "center",
          }),
      }}
    >
      {/* Header (Mobile Close Button) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "space-between" : "center",
        }}
      >
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ color: colors.icon }}
          >
            <Close />
          </IconButton>
        )}
      </Box>
      {isMobile && (
        <Divider
          sx={{ my: 2, borderColor: colors.border, borderBottomWidth: 2 }}
        />
      )}

      {/* Sidebar Items */}
      <Box
        sx={{
          width: "100%",
          ...(!desktopOpen &&
            !isMobile && {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }),
        }}
      >
        <List
          sx={{
            p: 0,
            ...(!desktopOpen &&
              !isMobile && {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }),
          }}
        >
          {sidebarItems.map((item, index) => {
            const isSelected = selected === index;
            return (
              <React.Fragment key={item.text}>
                <Tooltip
                  title={!desktopOpen && !isMobile ? item.text : ""}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    selected={isSelected}
                    onClick={() => {
                      setSelected(index);
                      if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: isSelected ? colors.primary : "#fff",
                      color: isSelected ? colors.badgeText : colors.icon,
                      transition: "all 0.25s ease",
                      "&.Mui-selected": {
                        backgroundColor: colors.primary,
                        color: colors.badgeText,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: colors.primary, // keeps it consistent
                        color: colors.badgeText,
                        transform: "scale(1.02)",
                      },
                      "&:hover": {
                        backgroundColor: !isSelected
                          ? `${colors.primary}30`
                          : colors.primary,
                        transform: "scale(1.02)",
                      },
                      justifyContent:
                        desktopOpen || isMobile ? "flex-start" : "center",
                      ...(!desktopOpen &&
                        !isMobile && {
                          width: 56,
                          height: 56,
                          mx: "auto",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0,
                        }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isSelected ? colors.badgeText : colors.icon,
                        minWidth: desktopOpen || isMobile ? 40 : "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {(desktopOpen || isMobile) && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>

                {/* Divider between items */}
                {index < sidebarItems.length - 1 && (
                  <Divider
                    sx={{
                      my: 0.5,
                      borderColor: colors.border,
                      opacity: 0.4,
                      width: desktopOpen || isMobile ? "90%" : "40%",
                      mx: "auto",
                      transition: "width 0.3s ease",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          background: colors.primary,
          boxShadow: `0 4px 16px ${colors.primary}33`,
          zIndex: 1200,
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar>
          <Tooltip title="Toggle Sidebar" arrow>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                color: colors.background,
                "&:hover": { bgcolor: `${colors.background}33` },
              }}
            >
              <Menu />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: colors.background,
              letterSpacing: 0.5,
            }}
          >
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Layout */}
      <Box
        sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.background }}
      >
        {/* Sidebar */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : desktopOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: desktopOpen || isMobile ? 260 : 72,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: desktopOpen || isMobile ? 260 : 72,
              boxSizing: "border-box",
              bgcolor: colors.drawerBg,
              borderRight: `1px solid ${colors.border}`,
              transition: "width 0.3s ease",
              top: isMobile ? 0 : 64,
              height: isMobile ? "100%" : "calc(100% - 64px)",
              overflowX: "hidden",
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            mt: 8,
            transition: "all 0.3s ease",
            maxWidth: !desktopOpen && !isMobile ? "900px" : "100%",
            mx: !desktopOpen && !isMobile ? "auto" : "inherit",
            textAlign: !desktopOpen && !isMobile ? "center" : "left",
            minHeight: "80vh",
          }}
        >
          {selected === 0 ? (
            <AddProduct />
          ) : selected === 1 ? (
            <Inventory />
          ) : selected === 2 ? (
            <Announcements />
          ) : selected === 3 ? (
            <UsersList />
          ) : selected === 4 ? (
            <BannerList />
          ) : (
            <Box
              sx={{
                height: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.icon,
                fontSize: "1.2rem",
                fontWeight: 500,
                opacity: 0.7,
              }}
            >
              No content. Select from the sidebar.
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminPanel;
