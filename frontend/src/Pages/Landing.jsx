import React from 'react';
import { Link } from 'react-router-dom';

const Landing= () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
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
                <Link to="/Aboutus" className="btn btn-outline-secondary btn-lg px-4">
                  About us 
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
    </div>
  );
};

export default Landing;