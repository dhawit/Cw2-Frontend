import axios from 'axios';
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/RequestOtpForm.css'; // Importing custom styles

const RequestOtpForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      return 'Invalid email address';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    
    // Validate email before proceeding
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    // Clear any previous error messages
    setEmailError('');
    setLoading(true);
    setOtpSent(false);

    try {
      const response = await axios.post('http://localhost:5500/api/send-otp', { email });
      setMessage(response.data.message);
      setOtpSent(true);
      navigate('/reset-password');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error requesting OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-lg rounded-lg border-0">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0 font-weight-bold">Forgot Password</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-control ${emailError ? 'is-invalid' : ''}`}
                      placeholder="Enter your email"
                      required
                    />
                    {emailError && <div className="invalid-feedback">{emailError}</div>}
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg btn-block shadow"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
                </button>
              </form>
              {otpSent && (
                <p className="mt-4 text-center text-success">
                  <i className="bi bi-check-circle"></i> OTP has been sent to your email.
                </p>
              )}
              {message && !otpSent && (
                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-danger' : 'text-success'}`}>
                  {message}
                </p>
              )}
            </div>
            <div className="card-footer text-center text-muted">
              <small>Ensure your email is correct before submitting.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestOtpForm;
