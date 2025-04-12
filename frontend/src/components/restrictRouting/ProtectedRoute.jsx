import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const LoginProtectRoute = ({ children }) => {
  const notLoggedIn = !JSON.parse(localStorage.getItem('user') );
  const location = useLocation();

  return notLoggedIn
  ? ( <Navigate to="/login" replace state={{ from: location }} /> )
  : (children);
};

export const PayProtectRoute = ({ children }) => {
  const paymentStatus = JSON.parse(localStorage.getItem('user')).paymentStatus;
  const location = useLocation();

  return paymentStatus
  ? (children)
  : ( <Navigate to="/payment" replace state={{ from: location }} /> );
};
