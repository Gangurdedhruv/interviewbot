// src/components/ResetPassword.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { resetPassword } from '../actions/userActions';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Validate token existence
  useEffect(() => {
    if (!token) {
      setError('Invalid or expired password reset link');
    }
  }, [token]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwords.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await resetPassword(token, passwords.password);
      
      if (response.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred while resetting your password');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="flex-grow-1 d-flex align-items-center bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  {!isSuccess ? (
                    <>
                      <div className="text-center mb-4">
                        <h2 className="fw-bold">Reset Your Password</h2>
                        <p className="text-muted">Create a new password for your account</p>
                      </div>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">New Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FaLock />
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              name="password"
                              placeholder="Enter new password"
                              value={passwords.password}
                              onChange={handleChange}
                              required
                              minLength={8}
                            />
                          </div>
                          <small className="form-text text-muted">Must be at least 8 characters long</small>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FaLock />
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="Confirm new password"
                              value={passwords.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary py-2"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                              </>
                            ) : 'Reset Password'}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                          <FaCheckCircle size={32} className="text-success" />
                        </div>
                      </div>
                      <h2 className="fw-bold mb-3">Password Reset Successful</h2>
                      <p className="text-muted mb-4">
                        Your password has been updated successfully. You'll be redirected to the login page in a few seconds.
                      </p>
                      <div className="d-grid">
                        <Link to="/login" className="btn btn-primary">
                          Login Now
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;