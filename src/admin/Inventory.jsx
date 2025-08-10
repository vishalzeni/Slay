import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  Pagination,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import colors from "../colors";

const Inventory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const itemsPerPage = isMobile ? 6 : isTablet ? 8 : 12;

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/products?page=${page}&limit=${itemsPerPage}&search=${searchTerm}&category=${categoryFilter}&sort=${sortBy}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setProductsError(data.error || "Failed to fetch products.");
        setProducts([]);
      }
    } catch (err) {
      setProductsError("Failed to fetch products.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [page, searchTerm, categoryFilter, sortBy, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, categoryFilter, sortBy, fetchProducts]);

  const handleEditProduct = (product) => {
    setEditProduct({
      ...product,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editProduct,
            sizes: editProduct.sizes.split(",").map((s) => s.trim()),
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        setEditDialogOpen(false);
        setEditProduct(null);
        setSnackbar({
          open: true,
          message: "Product updated successfully!",
          severity: "success",
        });
        fetchProducts();
      } else {
        setProductsError("Failed to update product.");
        setSnackbar({
          open: true,
          message: "Failed to update product.",
          severity: "error",
        });
      }
    } catch (err) {
      setProductsError("Failed to update product.");
      setSnackbar({
        open: true,
        message: "Failed to update product.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setActionLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (response.ok) {
          setSnackbar({
            open: true,
            message: "Product deleted.",
            severity: "success",
          });
          fetchProducts();
        } else {
          setProductsError("Failed to delete product.");
          setSnackbar({
            open: true,
            message: "Failed to delete product.",
            severity: "error",
          });
        }
      } catch (err) {
        setProductsError("Failed to delete product.");
        setSnackbar({
          open: true,
          message: "Failed to delete product.",
          severity: "error",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setEditProduct({ ...editProduct, image: data.url });
        setSnackbar({
          open: true,
          message: "Image uploaded.",
          severity: "success",
        });
      } else {
        setProductsError("Image upload failed.");
        setSnackbar({
          open: true,
          message: "Image upload failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setProductsError("Image upload failed.");
      setSnackbar({
        open: true,
        message: "Image upload failed.",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const groupByCategory = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    return grouped;
  };

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            background:
              snackbar.severity === "success" ? colors.primary : "#d32f2f",
            color: colors.badgeText,
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <Card
        sx={{
          mb: 3,
          p: isMobile ? 1.5 : 2.5,
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          background: colors.background,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type product name..."
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
                sx={{ borderRadius: 2 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="createdAt-desc">Newest First</MenuItem>
                <MenuItem value="createdAt-asc">Oldest First</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Refresh */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchProducts}
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1.1,
                background: colors.primary,
                fontWeight: 600,
                "&:hover": {
                  background: colors.primaryDark || colors.primary,
                },
              }}
            >
              {isMobile ? "Refresh" : "Refresh"}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Product Display */}
      {loadingProducts ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : productsError ? (
        <Card sx={{ p: 2, bgcolor: "error.light" }}>
          <Typography color="error">{productsError}</Typography>
        </Card>
      ) : products.length === 0 ? (
        <Card sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6">No products found</Typography>
        </Card>
      ) : (
        Object.entries(groupByCategory(products)).map(([category, items]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight={600}
              sx={{
                color: colors.primary,
                mb: 2,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Divider sx={{ flexGrow: 1, mr: 2 }} />
              {category}
              <Divider sx={{ flexGrow: 1, ml: 2 }} />
            </Typography>
            <Grid container spacing={isMobile ? 1 : 3}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height={isMobile ? 140 : 160}
                      image={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x160?text=No+Image";
                      }}
                      sx={{
                        objectFit: "contain",
                        bgcolor: "#f5f5f5",
                        p: 1,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: isMobile ? 1 : 2 }}>
                      <Typography
                        gutterBottom
                        variant={isMobile ? "subtitle2" : "h6"}
                        component="div"
                        fontWeight={600}
                        noWrap
                      >
                        {item.name}
                      </Typography>

                      <Box sx={{ mb: 1 }}>
                        <Chip
                          label={`₹${item.price}`}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`MRP: ₹${item.marketPrice}`}
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description || "No description available"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={item.category || "Uncategorized"}
                          size="small"
                          color="secondary"
                        />
                        <Chip
                          label={
                            Array.isArray(item.sizes) && item.sizes.length > 0
                              ? `Sizes: ${item.sizes.join(", ")}`
                              : "No sizes"
                          }
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={item.inStock ? "In Stock" : "Out of Stock"}
                          size="small"
                          color={item.inStock ? "success" : "error"}
                        />
                      </Box>
                    </CardContent>
                    <Box sx={{ p: isMobile ? 1 : 2, display: "flex", gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditProduct(item)}
                          size={isMobile ? "small" : "medium"}
                        >
                          <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteProduct(item._id)}
                          size={isMobile ? "small" : "medium"}
                        >
                          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <EditIcon color="primary" sx={{ mr: 1 }} />
            Edit Product
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={editProduct?.name || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                fullWidth
                margin="normal"
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Price"
                type="number"
                value={editProduct?.price || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                fullWidth
                margin="normal"
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Market Price"
                type="number"
                value={editProduct?.marketPrice || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    marketPrice: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={editProduct?.category || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                fullWidth
                margin="normal"
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sizes (comma-separated)"
                value={editProduct?.sizes || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, sizes: e.target.value })
                }
                fullWidth
                margin="normal"
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={editProduct?.description || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                multiline
                rows={3}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                disabled={uploading}
                fullWidth
                sx={{ mt: 1 }}
                size={isMobile ? "small" : "medium"}
              >
                {uploading ? "Uploading..." : "Upload New Image"}
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
            </Grid>
            {editProduct?.image && (
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <img
                  src={editProduct.image}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: 8,
                    marginTop: 16,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            disabled={actionLoading}
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProduct}
            disabled={
              uploading ||
              !editProduct?.name ||
              !editProduct?.image ||
              actionLoading
            }
            variant="contained"
            color="primary"
            startIcon={
              actionLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : null
            }
            size={isMobile ? "small" : "medium"}
          >
            {actionLoading ? "Updating..." : "Update Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
};

export default Inventory;