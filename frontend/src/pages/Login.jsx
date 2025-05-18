import { Link } from "react-router-dom";          
import React, { useState } from "react";
import {
  Container,
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  return (
    <div className="relative">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 4, position: "relative" }}>
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
            <Link to='/Singup' className="underline text-blue-500 cursor-pointer">
              <b>Signup</b>
            </Link>
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
