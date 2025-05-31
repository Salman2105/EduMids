import { Link } from "react-router-dom"; 
import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id || data.user._id); // <-- Support both id and _id
        localStorage.setItem("role", data.user.role); // <-- Add this line


        alert("Login successful!");

        // Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (data.user.role === "teacher") {
          window.location.href = "/teacher/dashboard";
        } else {
          window.location.href = "/student/dashboard";
        }
      } else {
        alert("Login failed: " + (data.message || "Server Error"));
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, position: "relative" }}>
        <Link to="/" style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </Link>
        <Typography variant="h5" gutterBottom align="center">
          Login to EduMids
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          <Button variant="contained" type="submit" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Typography mt={2} align="center">
          Don’t have an account?{" "}
          <Link to='/signup' className="underline text-blue-500 cursor-pointer">
            <b>Signup</b>
          </Link>
        </Typography>
      </Paper>
    </Dialog>
  );
};

export default Login;
