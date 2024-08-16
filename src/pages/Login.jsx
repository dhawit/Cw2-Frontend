import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../apis/api";
import loginImage from "../assets/images/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailVerified = query.get('emailVerified');

  useEffect(() => {
    if (emailVerified === 'true') {
      toast.success("Email verified successfully. Please log in.");
    } else if (emailVerified === 'false') {
      toast.error("Email verification failed or expired. Please try again.");
    }
  }, [emailVerified]);

  const handleChangeEmail = (e) => setEmail(e.target.value);

  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
  
    try {
      const res = await loginApi(data);
      if (!res.data.success) {
        toast.error(res.data.message || "An error occurred. Please try again.");
      } else {
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));
  
        // Check if user is an admin
        if (res.data.userData.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message); // Log error response
      toast.error(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, borderRadius: "15px" }}>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={loginImage}
            alt="Login"
            height={100}
            width={100}
            style={{ marginBottom: "1rem", borderRadius: "50%" }}
          />
          <Typography
            component="h1"
            variant="h5"
            style={{ color: "#0C3DD0", fontWeight: "bold" }}
          >
            Login
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Log into your account
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChangeEmail}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChangePassword}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#0C3DD0",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "22px",
                padding: "0.75rem",
                fontSize: "1rem",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#ff8b8b",
                },
              }}
            >
              Login
            </Button>
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Grid item>
                <Link to="/register" style={{ textDecoration: "none", color: "#000000" }}>
                  Don't have an account? Sign up
                </Link>
              </Grid>
              <Grid item>
                <Link to="/reset-password" style={{ textDecoration: "none", color: "#000000" }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
