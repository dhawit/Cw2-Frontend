import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRoutes = () => {
  const userData = JSON.parse(localStorage.getItem('user'));

  return userData && userData.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoutes;
