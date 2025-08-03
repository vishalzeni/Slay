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
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import colors from "./colors";
import { useNavigate } from "react-router-dom";
import logo from "./assets/SUMAN.png"; // Add logo like in signup
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { UserContext } from "./App";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(""); // JWT in state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const { handleAuth } = useContext(UserContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      setSnackbar({ open: true, message: "Email and password are required.", severity: "error" });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setSnackbar({ open: true, message: data.error || "Login failed", severity: "error" });
        return;
      }
      setAccessToken(data.accessToken);
      setSnackbar({ open: true, message: "Login successful!", severity: "success" });
      handleAuth({ user: data.user, accessToken: data.accessToken });
      localStorage.setItem("user", JSON.stringify({ ...data.user, accessToken: data.accessToken }));
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError("Network error");
      setSnackbar({ open: true, message: "Network error", severity: "error" });
    }
  };

  // Refresh token handler
  const handleRefresh = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Refresh failed");
        return;
      }
      setAccessToken(data.accessToken);
    } catch (err) {
      setError("Network error");
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
          maxWidth: 560, // 25% wider
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
            Login
          </Typography>

          <Typography textAlign="center" color={colors.icon} fontSize="0.95rem" mb={3}>
            Access your account securely
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />

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
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={handleRefresh}
                fullWidth
              >
                Refresh Session
              </Button>

              <Divider sx={{ my: 1.5, borderColor: colors.border, borderBottomWidth: 2 }} />

              <Typography textAlign="center" fontSize="0.95rem">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  sx={{ color: colors.primary, fontWeight: 600 }}
                  underline="hover"
                >
                  Sign Up
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

export default Login;
