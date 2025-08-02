import React, { useState, useEffect } from "react";
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
} from "@mui/material";
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

  // State for temporary image and size input
  const [tempImage, setTempImage] = useState("");
  const [tempSize, setTempSize] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Generate new ID on component mount and after submission
  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: generateProductId() }));
  }, []);

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

  // Handle adding image to images array
  const handleAddImage = () => {
    if (tempImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, tempImage.trim()],
      }));
      setTempImage("");
    }
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      marketPrice: parseFloat(formData.marketPrice),
      reviews: [],
    };
    console.log("Product Data:", productData);
    setShowSuccess(true);
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
  };

  return (
    <>
      {/* Success Alert */}
      <Fade in={showSuccess}>
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{
            position: "fixed",
            top: 80,
            right: { xs: 10, md: 20 },
            zIndex: 9999,
            minWidth: { xs: 200, md: 300 },
            bgcolor: colors.accent,
            color: colors.badgeText,
            boxShadow: `0 8px 24px ${colors.primary}33`,
            "& .MuiAlert-icon": { color: colors.badgeText },
            borderRadius: 2,
            fontWeight: 500,
            p: 1,
          }}
        >
          Product added successfully!
        </Alert>
      </Fade>

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

                    {/* Category */}
                    <TextField
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.category}
                      helperText={errors.category}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Category sx={{ color: colors.primary }} />
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

                    {/* Main Image */}
                    <TextField
                      label="Main Image URL"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.image}
                      helperText={errors.image}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhotoCamera sx={{ color: colors.primary }} />
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

                    {/* Additional Images */}
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
                        <PhotoCamera
                          sx={{ mr: 1, fontSize: 18, color: colors.primary }}
                        />
                        Additional Images
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                        <TextField
                          label="Image URL"
                          value={tempImage}
                          onChange={(e) => setTempImage(e.target.value)}
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
                              handleAddImage();
                            }
                          }}
                          aria-label="Add additional image URL"
                        />
                        <Tooltip title="Add Image" arrow>
                          <span>
                            <Button
                              variant="contained"
                              onClick={handleAddImage}
                              disabled={!tempImage.trim()}
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
                              aria-label="Add image to list"
                            >
                              Add
                            </Button>
                          </span>
                        </Tooltip>
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
                            label={img.length > 30 ? img.substring(0, 30) + "..." : img}
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
                            }}
                            aria-label={`Image ${index + 1}: ${img}`}
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