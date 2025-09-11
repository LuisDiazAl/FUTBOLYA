// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import AdminUsuarios from './pages/AdminUsuarios';
import MisCanchas from './pages/MisCanchas';
import CrearReserva from './pages/CrearReserva';
import MisReservas from './pages/MisReservas';
import ProteccionRuta from './ProteccionRuta';
import './assets/styles/global.css';
import './assets/styles/layout.css';
import NotFound from './pages/NotFound';



const App = () => {
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={isLoggedIn() ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/login" 
          element={isLoggedIn() ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isLoggedIn() ? <Navigate to="/home" replace /> : <Register />} 
        />

        {/* Protected routes - All authenticated users */}
        <Route path="/home" element={
          <ProteccionRuta>
            <Home />
          </ProteccionRuta>
        } />
        
        <Route path="/perfil" element={
          <ProteccionRuta>
            <Perfil />
          </ProteccionRuta>
        } />
        
        <Route path="/profile" element={<Navigate to="/perfil" replace />} />
        
        <Route path="/reservas/crear" element={
          <ProteccionRuta rolesPermitidos={['jugador']}>
            <CrearReserva />
          </ProteccionRuta>
        } />
        
        {/* Legacy route redirect */}
        <Route path="/crear-reserva" element={<Navigate to="/reservas/crear" replace />} />
        
        <Route path="/reservas/mis-reservas" element={
          <ProteccionRuta rolesPermitidos={['jugador']}>
            <MisReservas />
          </ProteccionRuta>
        } />
        
        {/* Legacy route redirect */}
        <Route path="/mis-reservas" element={<Navigate to="/reservas/mis-reservas" replace />} />
        
        {/* Establishment routes */}
        <Route path="/canchas" element={
          <ProteccionRuta rolesPermitidos={['establecimiento']}>
            <MisCanchas />
          </ProteccionRuta>
        } />
        
        {/* Legacy route redirect */}
        <Route path="/abm-canchas" element={<Navigate to="/canchas" replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProteccionRuta rolesPermitidos={['administrador']}>
            <AdminUsuarios />
          </ProteccionRuta>
        } />
        
        <Route path="/admin/usuarios" element={
          <ProteccionRuta rolesPermitidos={['administrador']}>
            <AdminUsuarios />
          </ProteccionRuta>
        } />
        
        {/* Legacy route redirect */}
        <Route path="/admin-usuarios" element={<Navigate to="/admin/usuarios" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;