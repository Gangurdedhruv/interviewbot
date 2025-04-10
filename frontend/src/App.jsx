import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/styles.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar'; 
import Registration from "./Pages/registration";
import Login from "./Pages/Login";
import Landing from "./Pages/Landing";
import HomePage from "./Pages/Homepage";
import Payment from "./Pages/Payment";
import Interview from "./Pages/Interview";
import Community from './Pages/community';
import Profile from './Pages/profile';
import Post from './Pages/post';
import AboutUs from './Pages/AboutUs';
import ProtectedRoute from './components/restrictRouting/ProtectedRoute'; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/aboutus" element={<AboutUs />} />

        {/* Protected Routes */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <Post/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
