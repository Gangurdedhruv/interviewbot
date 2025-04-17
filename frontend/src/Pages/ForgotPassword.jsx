// src/components/ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { requestPasswordReset } from '../actions/userActions';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await requestPasswordReset(email);
      
      if (response.success) {
        setIsSubmitted(true);
      } else {
        setError(response.message || 'Failed to process your request. Please try again.');
      }
    } catch (err) {
        // Modified to show more specific error details
        setError(`Error: ${err.message || err}`);
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
                  {!isSubmitted ? (
                    <>
                      <div className="text-center mb-4">
                        <h2 className="fw-bold">Forgot Password</h2>
                        <p className="text-muted">Enter your email to reset your password</p>
                      </div>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label">Email Address</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <FaEnvelope />
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              placeholder="name@example.com"
                              value={email}
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
                                Processing...
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
                          <FaEnvelope size={32} className="text-primary" />
                        </div>
                      </div>
                      <h2 className="fw-bold mb-3">Check Your Email</h2>
                      <p className="text-muted mb-4">
                        We've sent a password reset link to:<br />
                        <strong>{email}</strong>
                      </p>
                      <p className="small text-muted mb-4">
                        If you don't see the email, check other places it might be, like your junk, spam, or other folders.
                      </p>
                      <div className="d-grid">
                        <Link to="/login" className="btn btn-outline-primary">
                          Back to Login
                        </Link>
                      </div>
                    </div>
                  )}

                  {!isSubmitted && (
                    <div className="text-center mt-4">
                      <Link to="/login" className="text-decoration-none d-inline-flex align-items-center text-primary">
                        <FaArrowLeft size={14} className="me-2" />
                        Back to Login
                      </Link>
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

export default ForgotPassword;