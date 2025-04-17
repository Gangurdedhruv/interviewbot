import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/styles.css';

import { Routes, Route, Navigate } from 'react-router-dom';

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
import Footer from './components/Footer'
import { LoginProtectRoute, PayProtectRoute } from './components/restrictRouting/ProtectedRoute'; 
import FamousInterviewQuestions from './Pages/FamousInterview';
import ForgotPassword  from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/famousInterviewQuestions" element={<FamousInterviewQuestions />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/*Protected Routes */}
        <Route
          path="/homepage"
          element={
            <LoginProtectRoute>
              <HomePage />
            </LoginProtectRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <LoginProtectRoute>
              <Payment />
            </LoginProtectRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <PayProtectRoute>
              <Interview />
            </PayProtectRoute>
          }
        />
        <Route
          path="/community"
          element={
            <LoginProtectRoute>
              <Community />
            </LoginProtectRoute>
          }
        />
        <Route
          path="/community/:id"
          element={
            <LoginProtectRoute>
              <Post />
            </LoginProtectRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <LoginProtectRoute>
              <Profile />
            </LoginProtectRoute>
          }
        />
        <Route path="*" element={<Navigate to={"/"}/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
