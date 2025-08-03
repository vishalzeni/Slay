import React, { useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import colors from "./colors";
import { useNavigate } from "react-router-dom";
import logo from "./assets/SUMAN.png"; // Adjust the path if needed
import { UserContext } from "./App";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(""); // JWT in state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const { handleAuth } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      setSnackbar({ open: true, message: "All fields are required.", severity: "error" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setSnackbar({ open: true, message: "Passwords do not match.", severity: "error" });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setSnackbar({ open: true, message: data.error || "Signup failed", severity: "error" });
        return;
      }
      setAccessToken(data.accessToken);
      setSnackbar({ open: true, message: "Signup & Login successful!", severity: "success" });
      // Use only the userId provided by backend or signup
      const userWithId = {
        ...data.user,
        userId: data.user.userId || data.user._id,
        accessToken: data.accessToken,
      };
      handleAuth({ user: userWithId, accessToken: data.accessToken });
      localStorage.setItem("user", JSON.stringify(userWithId));
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError("Network error");
      setSnackbar({ open: true, message: "Network error", severity: "error" });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 4,
          bgcolor: colors.cardBg,
          boxShadow: `0 8px 32px ${colors.border}44`,
          border: `1px solid ${colors.border}`,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={logo} alt="Logo" style={{ width: "45%" }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: colors.primary,
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            Create Account
          </Typography>

          <Typography textAlign="center" color={colors.icon} fontSize="0.95rem" mb={3}>
            Join us and manage your account easily
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* Full Name, Email, Phone */}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Stack>
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Password and Confirm Password */}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {error && (
                <Typography color="error" fontSize="0.95rem">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: `${colors.primary}`,
                  color: colors.badgeText,
                  fontWeight: 700,
                  py: 1.4,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.05rem",
                  "&:hover": {
                    boxShadow: `0 8px 24px ${colors.primary}55`,
                  },
                }}
                fullWidth
              >
                Sign Up
              </Button>

              <Divider sx={{ my: 1.5, borderColor: colors.border, borderBottomWidth: 2 }} />

              <Typography textAlign="center" fontSize="0.95rem">
                Already have an account?{" "}
                <Link href="/login" sx={{ color: colors.primary, fontWeight: 600 }} underline="hover">
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            background: colors.primary,
            color: colors.badgeText,
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: `0 8px 24px ${colors.primary}33`,
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;

// You can use data.user.createdAt if you want to display registration date after signup
