import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Target } from 'lucide-react';
import '../assets/styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { token, usuario } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('rol', usuario.rol);
        navigate('/home');
      } else {
        alert('Inicio de sesión sin token recibido.');
      }
    } catch (error) {
      alert('Error al iniciar sesión. Verificá tus datos.');
      console.error(error);
    }
  };

  const irARegistro = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <Target size={48} className="logo-icon" />
            <span className="logo-text">FutbolYa</span>
          </div>
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Bienvenido a FutbolYA tu cancha digital</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="form-input"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            <LogIn size={20} className="btn-icon" />
            Iniciar Sesión
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">¿No tienes cuenta?</p>
          <button className="btn btn-secondary btn-full" onClick={irARegistro}>
            <UserPlus size={20} className="btn-icon" />
            Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
