
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaLaptopCode } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-primary" to="/">
            <FaLaptopCode className="me-2 d-inline" /> PrepNexus
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto">
              <Link to="/login" className="btn btn-outline-primary me-2">
                <FaSignInAlt className="me-1" /> Log In
              </Link>
              <Link to="/registration" className="btn btn-primary">
                <FaUserPlus className="me-1" /> Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow-1 d-flex align-items-center">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Prepare for your next technical interview</h1>
              <p className="lead text-muted mb-4">
                Upload your resume and receive tailored interview questions for your specific skills. 
                Ace your interviews with our AI-powered preparation assistant.
              </p>
              <div className="d-grid gap-2 d-md-flex">
                <Link to="/registration" className="btn btn-primary btn-lg px-4 me-md-2">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <img 
                src="../images/home_img.jpeg" 
                alt="Interview preparation" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light py-4 mt-auto">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <span className="text-muted">© 2025 PrepNexus. All rights reserved.</span>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-decoration-none text-muted me-3">Privacy Policy</a>
              <a href="#" className="text-decoration-none text-muted">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;