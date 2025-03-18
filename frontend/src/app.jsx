import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/styles.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Registration from "./Pages/registration";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import HomePage from "./Pages/Homepage";
import Payment from "./pages/Payment";
import Interview from "./Pages/Interview";
import Community from './Pages/community';
import Profile from './Pages/profile';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;

// styles.css - Custom styles to enhance Bootstrap
