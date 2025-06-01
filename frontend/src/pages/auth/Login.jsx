import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react"; // <-- Add this import

const roles = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Admin", value: "admin" },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id || data.user._id);
        localStorage.setItem("role", data.user.role);

        setSnackbar({
          open: true,
          message: isLogin
            ? `Welcome back, ${data.user.name || data.user.email}!`
            : `Registration successful! Welcome, ${data.user.name || data.user.email}!`,
          severity: "success",
        });

        setTimeout(() => {
          // Redirect based on role
          if (data.user.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (data.user.role === "teacher") {
            window.location.href = "/teacher/dashboard";
          } else {
            window.location.href = "/student/dashboard";
          }
        }, 1200);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Server Error",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eaf2fe 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 500, // was 370
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1565d8", mb: 1, mt: 1 }}
          align="center"
        >
          {isLogin ? "Welcome Back" : "Join EduMinds"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#333", mb: 3 }}
          align="center"
        >
          {isLogin ? "Sign in to your account" : "Create your account"}
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {!isLogin && (
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                Full Name
              </Typography>
              <TextField
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
              />
            </Box>
          )}
          <Box mb={2}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Email
            </Typography>
            <TextField
              placeholder="Enter your email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              size="small"
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Password
            </Typography>
            <TextField
              placeholder="Enter your password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              size="small"
            />
          </Box>
          {!isLogin && (
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                Role
              </Typography>
              <TextField
                select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                fullWidth
                size="small"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          <Button
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: 600,
              fontSize: "1rem",
              mt: 1,
              mb: 1,
              background: "#1565d8",
              textTransform: "none",
            }}
            disabled={loading}
            startIcon={
              loading
                ? null
                : isLogin
                ? <LogIn className="mr-2 h-4 w-4" />
                : <UserPlus className="mr-2 h-4 w-4" />
            }
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <Typography mt={2} align="center" sx={{ fontSize: 15 }}>
          <Button
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              color: "#1565d8",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </Typography>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
