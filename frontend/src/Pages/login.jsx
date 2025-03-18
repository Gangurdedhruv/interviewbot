import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaLaptopCode } from 'react-icons/fa';
import { loginUser } from '@/actions/userActions';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");  // State to store the error message
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(""); // Clear previous error
    try {
      const response = await loginUser(formData)
      if (!response.success) {
        setError(response.message);
      }
      else {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/homepage');
      }
    } catch (err) {
      setError(err); // Set the error message to display
      console.error("Error:", err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-primary" to="/">
            <FaLaptopCode className="me-2" /> PrepNexus
          </Link>
        </div>
      </nav>

      <div className="flex-grow-1 d-flex align-items-center bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Welcome Back</h2>
                    <p className="text-muted">Sign in to continue to PrepNexus</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
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
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <label htmlFor="password" className="form-label">Password</label>
                        <Link to="/forgot-password" className="text-decoration-none small text-primary">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
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
                            Signing in...
                          </>
                        ) : 'Sign In'}
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Don't have an account? <Link to="/registration" className="text-decoration-none text-primary">Sign up</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-3 bg-white border-top">
        <div className="container text-center text-muted">
          <small>© 2025 PrepNexus. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
};

export default Login;
