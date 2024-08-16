import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material"; // For loading spinner
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/RequestPasswordForm.css';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Email Validation
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return isValid ? "" : "Invalid email address";
  };

  // OTP Validation
  const validateOtp = (value) => {
    if (!value) return "OTP is required";
    return value.length === 6 ? "" : "OTP must be 6 digits";
  };

  // Password Validation
  const validatePassword = (value) => {
    if (!value) return "Password is required";
    const isValidLength = value.length >= 8;
    const upperCase = /[A-Z]/.test(value);
    const lowerCase = /[a-z]/.test(value);
    const number = /\d/.test(value);
    const specialChar = /[!@#$%^&*]/.test(value);

    if (!isValidLength || !upperCase || !lowerCase || !number || !specialChar) {
      return "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const emailError = validateEmail(email);
    const otpError = validateOtp(otp);
    const passwordError = validatePassword(password);

    if (emailError || otpError || passwordError) {
      setErrors({ email: emailError, otp: otpError, password: passwordError });
      setLoading(false);
      return;
    }

    setErrors({}); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://localhost:5500/api/verify-otp-and-update-password",
        { email, otp, newPassword: password }
      );
      setMessage(response.data.message);
      navigate("/login"); // Redirect to login page after successful password reset
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div
            className="card mt-5 shadow-lg rounded-lg"
            style={{ borderRadius: "15px", border: "1px solid #e0e0e0", padding: "30px" }}
          >
            <div className="card-body">
              <h2
                className="text-center mb-4"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Reset Your Password
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email"
                    style={{
                      padding: "12px 20px",
                      fontSize: "16px",
                      borderRadius: "8px",
                    }}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="form-group mb-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                    placeholder="Enter OTP"
                    style={{
                      padding: "12px 20px",
                      fontSize: "16px",
                      borderRadius: "8px",
                    }}
                    required
                  />
                  {errors.otp && (
                    <div className="invalid-feedback">{errors.otp}</div>
                  )}
                </div>
                <div className="form-group mb-4 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter new password"
                    style={{
                      padding: "12px 20px",
                      fontSize: "16px",
                      borderRadius: "8px",
                    }}
                    required
                  />
                  <div
                    className="position-absolute"
                    style={{
                      top: "50%",
                      right: "20px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOff style={{ color: "#007bff" }} />
                    ) : (
                      <Visibility style={{ color: "#007bff" }} />
                    )}
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    padding: "12px",
                    fontSize: "18px",
                    fontWeight: "500",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
              {message && (
                <p
                  className={`mt-3 text-center ${
                    message.includes("Error") ? "text-danger" : "text-success"
                  }`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "16px",
                    marginTop: "20px",
                  }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
