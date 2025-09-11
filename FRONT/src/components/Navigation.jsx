import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Calendar, Building2, Settings, User, LogOut, Menu, X } from 'lucide-react';
import '../assets/styles/navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esAdmin = usuario?.rol === 'administrador';
  const esEstablecimiento = usuario?.rol === 'establecimiento';
  const esJugador = usuario?.rol === 'jugador';

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="navigation-header">
        <div className="nav-left">
          <Link to="/home" className="logo-link" onClick={closeMobileMenu}>
            <img src="/IconoFYa.jpeg" alt="FutbolYa Logo" className="nav-logo" />
            <span className="nav-brand">FutbolYa</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav className="nav-center">
          <Link 
            to="/home" 
            className={`nav-link ${isActive('/home') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <Home size={18} />
            Inicio
          </Link>
          
          {esJugador && (
            <>
              <Link 
                to="/reservas/crear" 
                className={`nav-link ${isActive('/reservas/crear') || isActive('/crear-reserva') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Plus size={18} />
                Crear Reserva
              </Link>
              <Link 
                to="/reservas/mis-reservas" 
                className={`nav-link ${isActive('/reservas/mis-reservas') || isActive('/mis-reservas') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Calendar size={18} />
                Mis Reservas
              </Link>
            </>
          )}
          
          {esEstablecimiento && (
            <Link 
              to="/canchas" 
              className={`nav-link ${isActive('/canchas') || isActive('/abm-canchas') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Building2 size={18} />
              Mis Canchas
            </Link>
          )}
          
          {esAdmin && (
            <Link 
              to="/admin/usuarios" 
              className={`nav-link ${isActive('/admin/usuarios') || isActive('/admin-usuarios') || isActive('/admin') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Settings size={18} />
              Administrar
            </Link>
          )}
          
          <Link 
            to="/perfil" 
            className={`nav-link ${isActive('/perfil') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <User size={18} />
            Perfil
          </Link>
        </nav>
        
        <div className="nav-right">
          <div className="user-info">
            <span className="user-name">{usuario?.nombre}</span>
            <span className="user-role">{usuario?.rol}</span>
          </div>
          <button className="btn-logout" onClick={cerrarSesion}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-user-info">
                <span className="mobile-user-name">{usuario?.nombre}</span>
                <span className="mobile-user-role">{usuario?.rol}</span>
              </div>
              <button 
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="mobile-nav">
              <Link 
                to="/home" 
                className={`mobile-nav-link ${isActive('/home') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Home size={20} />
                Inicio
              </Link>
              
              {esJugador && (
                <>
                  <Link 
                    to="/reservas/crear" 
                    className={`mobile-nav-link ${isActive('/reservas/crear') || isActive('/crear-reserva') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <Plus size={20} />
                    Crear Reserva
                  </Link>
                  <Link 
                    to="/reservas/mis-reservas" 
                    className={`mobile-nav-link ${isActive('/reservas/mis-reservas') || isActive('/mis-reservas') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <Calendar size={20} />
                    Mis Reservas
                  </Link>
                </>
              )}
              
              {esEstablecimiento && (
                <Link 
                  to="/canchas" 
                  className={`mobile-nav-link ${isActive('/canchas') || isActive('/abm-canchas') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Building2 size={20} />
                  Mis Canchas
                </Link>
              )}
              
              {esAdmin && (
                <Link 
                  to="/admin/usuarios" 
                  className={`mobile-nav-link ${isActive('/admin/usuarios') || isActive('/admin-usuarios') || isActive('/admin') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Settings size={20} />
                  Administrar
                </Link>
              )}
              
              <Link 
                to="/perfil" 
                className={`mobile-nav-link ${isActive('/perfil') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <User size={20} />
                Perfil
              </Link>
            </nav>
            
            <div className="mobile-menu-footer">
              <button className="mobile-btn-logout" onClick={cerrarSesion}>
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;