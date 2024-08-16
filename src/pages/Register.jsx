import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";
import { registerApi } from "../apis/api";
import signup from "../assets/images/register.png";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChangeFirstName = (e) => setFirstName(e.target.value);
  const handleChangeLastName = (e) => setLastName(e.target.value);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    const result = zxcvbn(e.target.value);
    setPasswordStrength(result.score);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { firstName, lastName, email, password };
    
    console.log("Submitting registration data:", data); // Log request data
    
    registerApi(data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Registration successful! Please check your email to verify your account.");
          navigate("/login");
        } else {
          if (res.data.message.includes("email")) {
            toast.error("The email address you entered is already in use. Please try another one.");
          } else if (res.data.message.includes("password")) {
            toast.error("The password you entered is too weak. Please choose a stronger password.");
          } else {
            toast.error(res.data.message || "An error occurred. Please try again.");
          }
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        if (error.response && error.response.data) {
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={signup} alt="logo" height={100} width={100} />
        <Typography component="h1" variant="h5" style={{ color: "#0C3DD0" }}>
          Register
        </Typography>
        <h6>Register your account here</h6>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleChangeFirstName}
                sx={{ borderColor: "#ff6f6f" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={handleChangeLastName}
                sx={{ borderColor: "#ff6f6f" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChangeEmail}
                sx={{ borderColor: "#ff6f6f" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                onChange={handleChangePassword}
                helperText={`Password strength: ${
                  ["Weak", "Fair", "Good", "Strong"][passwordStrength] ||
                  "Unknown"
                }`}
                error={passwordStrength < 2}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ borderColor: "#ff6f6f" }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#0C3DD0",
              borderRadius: "22px",
              "&:hover": { backgroundColor: "#ff8b8b" },
              "&:focus": { backgroundColor: "#ff8b8b" },
            }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
