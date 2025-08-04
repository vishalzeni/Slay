import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Fade,
  Tooltip,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  AddCircleOutline,
  PhotoCamera,
  AttachMoney,
  Category,
  Description,
  Inventory,
  NewReleases,
  CheckCircle,
  Delete,
  CloudUpload,
} from "@mui/icons-material";
import colors from "../colors";

const generateProductId = () => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Generate 3-digit number
  return `G${randomNum}`;
};

const AddProduct = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    id: generateProductId(),
    name: "",
    price: "",
    marketPrice: "",
    category: "",
    image: "",
    images: [],
    sizes: [],
    inStock: true,
    description: "",
    isNewArrival: false,
    reviews: [],
  });

  // State for temporary size input
  const [tempSize, setTempSize] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [additionalImageUploading, setAdditionalImageUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [categories, setCategories] = useState([]);
  const [categoryMode, setCategoryMode] = useState("select");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Generate new ID on component mount and after submission
  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: generateProductId() }));
  }, []);

  // Fetch categories from backend (or fallback to static)
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.products)) {
          const cats = [
            ...new Set(
              data.products
                .map((p) => p.category)
                .filter((c) => !!c && c.trim() !== "")
            ),
          ];
          setCategories(cats);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (categoryMode === "select") {
      setFormData((prev) => ({ ...prev, category: selectedCategory }));
    } else if (categoryMode === "input") {
      setFormData((prev) => ({ ...prev, category: newCategory }));
    }
  }, [categoryMode, selectedCategory, newCategory]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Enter a valid price greater than 0";
    if (!formData.marketPrice || parseFloat(formData.marketPrice) <= 0)
      newErrors.marketPrice = "Enter a valid market price greater than 0";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.image.trim()) newErrors.image = "Main image URL is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Upload image to backend (which uploads to Cloudinary)
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url;
  };

  // Handle main image file upload
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, image: "Image upload failed" }));
    }
    setMainImageUploading(false);
  };

  // Handle additional image file upload
  const handleAdditionalImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAdditionalImageUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    } catch (err) {
      // Optionally show error
    }
    setAdditionalImageUploading(false);
  };

  // Handle removing image from images array
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle adding size to sizes array
  const handleAddSize = () => {
    if (tempSize.trim()) {
      const size = tempSize.trim().toUpperCase();
      if (!formData.sizes.includes(size)) {
        setFormData((prev) => ({
          ...prev,
          sizes: [...prev.sizes, size],
        }));
        setTempSize("");
      }
    }
  };

  // Handle removing size from sizes array
  const handleRemoveSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  // Helper to check if product ID exists
  const checkProductIdExists = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products?id=${id}`);
      const data = await res.json();
      if (Array.isArray(data.products)) {
        return data.products.some((p) => p.id === id);
      }
      return false;
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbar({ open: true, message: "Please fill all required fields.", severity: "error" });
      return;
    }

    let productId = formData.id;
    let exists = await checkProductIdExists(productId);
    let attempts = 0;
    // Try up to 5 times to get a unique ID
    while (exists && attempts < 5) {
      productId = generateProductId();
      exists = await checkProductIdExists(productId);
      attempts++;
    }
    if (exists) {
      setSnackbar({ open: true, message: "Could not generate unique Product ID. Try again.", severity: "error" });
      return;
    }

    const productData = {
      ...formData,
      id: productId,
      price: parseFloat(formData.price),
      marketPrice: parseFloat(formData.marketPrice),
      reviews: [],
    };
    console.log("[AddProduct] Product Data to send:", productData);

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) {
        setSnackbar({ open: true, message: data.error || "Failed to add product", severity: "error" });
        setErrors((prev) => ({
          ...prev,
          submit: data.error || "Failed to add product",
        }));
        return;
      }
      setShowSuccess(true);
      setSnackbar({ open: true, message: "Product added successfully!", severity: "success" });
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({
        id: generateProductId(),
        name: "",
        price: "",
        marketPrice: "",
        category: "",
        image: "",
        images: [],
        sizes: [],
        inStock: true,
        description: "",
        isNewArrival: false,
        reviews: [],
      });
      setErrors({});
    } catch (err) {
      setSnackbar({ open: true, message: "Network or server error", severity: "error" });
      setErrors((prev) => ({
        ...prev,
        submit: "Network or server error",
      }));
    }
  };

  return (
    <>
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
            background: snackbar.severity === "success" ? colors.primary : "#d32f2f",
            color: colors.badgeText,
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.background }}>
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            bgcolor: colors.background,
          }}
        >
          <Fade in timeout={800}>
            <Card
              elevation={0}
              sx={{
                maxWidth: 800,
                mx: "auto",
                borderRadius: 3,
                bgcolor: colors.cardBg,
                boxShadow: `0 8px 32px ${colors.border}33`,
                border: `1px solid ${colors.border}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: `0 12px 40px ${colors.border}44` },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box component="form" onSubmit={handleSubmit} aria-label="Add product form">
                  <Stack spacing={3}>
                    {/* Product ID */}
                    <TextField
                      label="Product ID"
                      name="id"
                      value={formData.id}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Inventory sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: `${colors.accent}10`,
                          "& fieldset": { borderColor: colors.border },
                          "&:hover fieldset": { borderColor: colors.primary },
                          "&.Mui-focused fieldset": { borderColor: colors.primary },
                        },
                        "& .MuiInputLabel-root": { color: colors.icon },
                        "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                      }}
                      aria-readonly="true"
                    />

                    {/* Product Name */}
                    <TextField
                      label="Product Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": { borderColor: colors.primary },
                          "&.Mui-focused fieldset": { borderColor: colors.primary },
                        },
                        "& .MuiInputLabel-root": { color: colors.icon },
                        "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                      }}
                      aria-required="true"
                    />

                    {/* Price Row */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.price}
                        helperText={errors.price}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: colors.primary }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0, step: "0.01" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": { borderColor: colors.primary },
                            "&.Mui-focused fieldset": { borderColor: colors.primary },
                          },
                          "& .MuiInputLabel-root": { color: colors.icon },
                          "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                        }}
                        aria-required="true"
                      />
                      <TextField
                        label="Market Price"
                        name="marketPrice"
                        type="number"
                        value={formData.marketPrice}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.marketPrice}
                        helperText={errors.marketPrice}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: colors.primary }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0, step: "0.01" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": { borderColor: colors.primary },
                            "&.Mui-focused fieldset": { borderColor: colors.primary },
                          },
                          "& .MuiInputLabel-root": { color: colors.icon },
                          "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                        }}
                        aria-required="true"
                      />
                    </Stack>

                    {/* Category (Select + Input, aligned with UI) */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mb={1}
                        sx={{ color: colors.icon, display: "flex", alignItems: "center" }}
                      >
                        <Category sx={{ mr: 1, fontSize: 18, color: colors.primary }} />
                        Category
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Box sx={{ minWidth: 220 }}>
                          <TextField
                            select
                            label="Select Category"
                            value={categoryMode === "select" ? selectedCategory : "other"}
                            onChange={(e) => {
                              if (e.target.value === "other") {
                                setCategoryMode("input");
                                setSelectedCategory("");
                              } else {
                                setCategoryMode("select");
                                setSelectedCategory(e.target.value);
                                setNewCategory("");
                              }
                            }}
                            fullWidth
                            size="small"
                            SelectProps={{
                              native: true,
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                bgcolor: "#fff",
                                "& fieldset": { borderColor: colors.border },
                                "&:hover fieldset": { borderColor: colors.primary },
                                "&.Mui-focused fieldset": { borderColor: colors.primary },
                              },
                              "& .MuiInputLabel-root": { color: colors.icon },
                              "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                            }}
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            <option value="other">Add new...</option>
                          </TextField>
                        </Box>
                        {categoryMode === "input" && (
                          <TextField
                            label="New Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            fullWidth
                            required
                            error={!!errors.category}
                            helperText={errors.category}
                            size="small"
                            sx={{
                              maxWidth: 220,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": { borderColor: colors.primary },
                                "&.Mui-focused fieldset": { borderColor: colors.primary },
                              },
                              "& .MuiInputLabel-root": { color: colors.icon },
                              "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                            }}
                            aria-required="true"
                          />
                        )}
                      </Stack>
                      {categoryMode === "select" && errors.category && (
                        <Typography color="error" fontSize="0.95rem">
                          {errors.category}
                        </Typography>
                      )}
                    </Box>

                    {/* Main Image Upload */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mb={1}
                        sx={{ color: colors.icon, display: "flex", alignItems: "center" }}
                      >
                        <PhotoCamera sx={{ mr: 1, fontSize: 18, color: colors.primary }} />
                        Main Image
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<CloudUpload />}
                          sx={{
                            background: colors.primary,
                            color: colors.badgeText,
                            borderRadius: 2,
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            "&:hover": { background: "#a83200" },
                          }}
                          disabled={mainImageUploading}
                        >
                          {mainImageUploading ? "Uploading..." : "Upload Main Image"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleMainImageChange}
                          />
                        </Button>
                        {mainImageUploading && <CircularProgress size={24} />}
                        {formData.image && (
                          <img
                            src={formData.image}
                            alt="Main"
                            style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", marginLeft: 12 }}
                          />
                        )}
                      </Stack>
                      {errors.image && (
                        <Typography color="error" fontSize="0.95rem">
                          {errors.image}
                        </Typography>
                      )}
                    </Box>

                    {/* Additional Images Upload */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mb={2}
                        sx={{
                          color: colors.icon,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <PhotoCamera sx={{ mr: 1, fontSize: 18, color: colors.primary }} />
                        Additional Images
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUpload />}
                          sx={{
                            borderColor: colors.primary,
                            color: colors.primary,
                            borderRadius: 2,
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            "&:hover": { background: colors.accent },
                          }}
                          disabled={additionalImageUploading}
                        >
                          {additionalImageUploading ? "Uploading..." : "Upload Image"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAdditionalImageChange}
                          />
                        </Button>
                        {additionalImageUploading && <CircularProgress size={24} />}
                      </Stack>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {formData.images.length === 0 && (
                          <Typography
                            variant="body2"
                            sx={{ color: colors.icon, opacity: 0.7 }}
                          >
                            No additional images added
                          </Typography>
                        )}
                        {formData.images.map((img, index) => (
                          <Chip
                            key={index}
                            label={
                              <img
                                src={img}
                                alt={`img${index + 1}`}
                                style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, marginRight: 8 }}
                              />
                            }
                            onDelete={() => handleRemoveImage(index)}
                            deleteIcon={
                              <Tooltip title="Remove Image" arrow>
                                <Delete sx={{ color: colors.icon }} />
                              </Tooltip>
                            }
                            sx={{
                              backgroundColor: `${colors.accent}80`,
                              color: colors.primary,
                              fontWeight: 500,
                              borderRadius: 2,
                              "&:hover": { backgroundColor: `${colors.accent}A0` },
                              transition: "all 0.3s ease",
                              minWidth: 60,
                              minHeight: 40,
                            }}
                            aria-label={`Image ${index + 1}`}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Sizes */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mb={2}
                        sx={{ color: colors.icon }}
                      >
                        Available Sizes
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                        <TextField
                          label="Size (e.g., S, M, L, XL)"
                          value={tempSize}
                          onChange={(e) => setTempSize(e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": { borderColor: colors.primary },
                              "&.Mui-focused fieldset": { borderColor: colors.primary },
                            },
                            "& .MuiInputLabel-root": { color: colors.icon },
                            "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSize();
                            }
                          }}
                          aria-label="Add size"
                        />
                        <Tooltip title="Add Size" arrow>
                          <span>
                            <Button
                              variant="contained"
                              onClick={handleAddSize}
                              disabled={!tempSize.trim()}
                              sx={{
                                background: colors.primary,
                                borderRadius: 2,
                                textTransform: "none",
                                color: colors.badgeText,
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                boxShadow: `0 4px 12px ${colors.primary}33`,
                                "&:hover": {
                                  background: colors.primary,
                                  transform: "scale(1.05)",
                                },
                                "&:disabled": {
                                  background: colors.border,
                                  color: colors.icon,
                                  opacity: 0.6,
                                },
                                transition: "all 0.3s ease",
                              }}
                              aria-label="Add size to list"
                            >
                              Add
                            </Button>
                          </span>
                        </Tooltip>
                      </Stack>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {formData.sizes.length === 0 && (
                          <Typography
                            variant="body2"
                            sx={{ color: colors.icon, opacity: 0.7 }}
                          >
                            No sizes added
                          </Typography>
                        )}
                        {formData.sizes.map((size, index) => (
                          <Chip
                            key={index}
                            label={size}
                            onDelete={() => handleRemoveSize(index)}
                            deleteIcon={
                              <Tooltip title="Remove Size" arrow>
                                <Delete sx={{ color: colors.icon }} />
                              </Tooltip>
                            }
                            sx={{
                              backgroundColor: `${colors.accent}80`,
                              color: colors.primary,
                              fontWeight: 600,
                              borderRadius: 2,
                              "&:hover": { backgroundColor: `${colors.accent}A0` },
                              transition: "all 0.3s ease",
                            }}
                            aria-label={`Size ${size}`}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Checkboxes */}
                    <Box>
                      <Stack direction="row" spacing={3}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.inStock}
                              onChange={handleInputChange}
                              name="inStock"
                              sx={{
                                color: colors.primary,
                                "&.Mui-checked": { color: colors.primary },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{ color: colors.icon }}
                            >
                              In Stock
                            </Typography>
                          }
                          sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.9rem" } }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.isNewArrival}
                              onChange={handleInputChange}
                              name="isNewArrival"
                              sx={{
                                color: colors.primary,
                                "&.Mui-checked": { color: colors.primary },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <NewReleases
                                sx={{ mr: 0.5, fontSize: 18, color: colors.primary }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{ color: colors.icon }}
                              >
                                New Arrival
                              </Typography>
                            </Box>
                          }
                          sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.9rem" } }}
                        />
                      </Stack>
                    </Box>

                    {/* Description */}
                    <TextField
                      label="Product Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      fullWidth
                      required
                      error={!!errors.description}
                      helperText={errors.description}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ alignSelf: "flex-start", mt: 1 }}
                          >
                            <Description sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": { borderColor: colors.primary },
                          "&.Mui-focused fieldset": { borderColor: colors.primary },
                        },
                        "& .MuiInputLabel-root": { color: colors.icon },
                        "& .MuiInputLabel-root.Mui-focused": { color: colors.primary },
                      }}
                      aria-required="true"
                    />

                    {/* Submit Button */}
                    <Tooltip title="Submit product details" arrow>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          background: colors.primary,
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: "none",
                          color: colors.badgeText,
                          fontSize: "1rem",
                          boxShadow: `0 8px 24px ${colors.primary}40`,
                          "&:hover": {
                            background: colors.primary,
                            transform: "scale(1.05)",
                            boxShadow: `0 12px 32px ${colors.primary}50`,
                          },
                          "&:disabled": {
                            background: colors.border,
                            color: colors.icon,
                            opacity: 0.6,
                          },
                          transition: "all 0.3s ease",
                        }}
                        aria-label="Add product to inventory"
                      >
                        <AddCircleOutline sx={{ mr: 1, fontSize: 20 }} />
                        Add Product
                      </Button>
                    </Tooltip>
                    {errors.submit && (
                      <Typography color="error" fontSize="0.95rem" sx={{ mt: 1 }}>
                        {errors.submit}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Box>
    </>
  );
};

export default AddProduct;