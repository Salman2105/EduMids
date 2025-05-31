import { Link } from "react-router-dom";          
import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const roles = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Admin", value: "admin" }
];

const Signup = () => {
  const [open] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Signup successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <Paper elevation={3} sx={{ p: 4, mt: 2, borderRadius: 4, position: "relative" }}>
        <Link to="/" style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </Link>
        <Typography variant="h5" gutterBottom align="center">
          Create Your EduMids Account
        </Typography>
        <form onSubmit={handleSignup}>
          <Box mb={2}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        <Typography mt={2} align="center">
          Already have an account?{" "}
          <Link to='/login' className="underline text-blue-500 cursor-pointer">
            <b>Login</b>
          </Link>
        </Typography>
      </Paper>
    </Dialog>
  );
};

export default Signup;
