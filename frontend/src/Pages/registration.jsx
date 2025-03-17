// pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaLaptopCode, FaPhone, FaBriefcase, FaBuilding, FaTags } from 'react-icons/fa';
import { registerUser } from '@/actions/userActions';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    organization: '',
    domains: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      const response = await registerUser(formData)
      if (response.success === false) {
        setError(response.message);
      }
      else {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/homepage');
      }
    } catch (err) {
      console.log(err)
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Create an Account</h2>
                    <p className="text-muted">Get started with PrepNexus</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaUser /></span>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaEnvelope /></span>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaPhone /></span>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          placeholder="123-456-7890"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="occupation" className="form-label">Occupation</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaBriefcase /></span>
                        <input
                          type="text"
                          className="form-control"
                          id="occupation"
                          placeholder="Software Developer"
                          value={formData.occupation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="organization" className="form-label">Organization</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaBuilding /></span>
                        <input
                          type="text"
                          className="form-control"
                          id="organization"
                          placeholder="Your Company"
                          value={formData.organization}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* <div className="mb-3">
                      <label htmlFor="domains" className="form-label">Domains</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaTags /></span>
                        <input
                          type="text"
                          className="form-control"
                          id="domains"
                          placeholder="Python, Data Science"
                          value={formData.domains}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div> */}

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                  
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="8"
                          pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$"
                          title="Password must be at least 8 characters long and include at least one uppercase letter and one special character."
                      />
    
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary py-2" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-4">
                    <p>
                      Already have an account? <Link to="/login" className="text-decoration-none text-primary">Sign in</Link>
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

export default Registration;
