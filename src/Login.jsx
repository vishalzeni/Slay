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
import { LoadingButton } from "@mui/lab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(""); // JWT in state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
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
    setLoading(true);
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
        setLoading(false);
        return;
      }
      setAccessToken(data.accessToken);
      setSnackbar({ open: true, message: "Login successful!", severity: "success" });
      // Use only the userId provided by backend or login
      const userWithId = {
        ...data.user,
        userId: data.user.userId,
        accessToken: data.accessToken,
      };
      handleAuth({ user: userWithId, accessToken: data.accessToken });
      localStorage.setItem("user", JSON.stringify(userWithId));
      setTimeout(() => {
        setLoading(false);
        navigate("/", { replace: true });
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError("Network error");
      setSnackbar({ open: true, message: "Network error", severity: "error" });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMsg("Please enter your email.");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotMsg(data.error || "Failed to send reset link.");
      } else {
        setForgotMsg(data.message || "Reset link sent.");
      }
    } catch {
      setForgotMsg("Network error.");
    }
    setForgotLoading(false);
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
              <Button
                sx={{ textTransform: "none", fontSize: "0.95rem", color: colors.primary, alignSelf: "flex-end" }}
                onClick={() => setForgotOpen(true)}
              >
                Forgot password?
              </Button>

              {error && (
                <Typography color="error" fontSize="0.95rem">
                  {error}
                </Typography>
              )}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
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
              </LoadingButton>
              

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
          iconMapping={{
            success: (
              <span style={{ color: "#fff" }}>
                <svg width="24" height="24" fill="currentColor" style={{ verticalAlign: "middle" }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                </svg>
              </span>
            ),
          }}
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

      <Dialog open={forgotOpen} onClose={() => { setForgotOpen(false); setForgotMsg(""); }}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
          {forgotMsg && (
            <Typography color={forgotMsg.includes("sent") ? "success.main" : "error"} sx={{ mt: 2 }}>
              {forgotMsg}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setForgotOpen(false); setForgotMsg(""); }}>Cancel</Button>
          <LoadingButton loading={forgotLoading} onClick={handleForgotPassword}>Send Link</LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
