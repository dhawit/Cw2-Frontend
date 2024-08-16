import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const UserRoutes = () => {
  const userData = JSON.parse(localStorage.getItem('user'));

  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoutes;
