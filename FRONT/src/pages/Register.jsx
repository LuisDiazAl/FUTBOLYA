import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, Target, User } from 'lucide-react';
import '../assets/styles/login.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(nombre, email, password);
      alert('Registro exitoso. Ahora podés iniciar sesión.');
      navigate('/login');
    } catch (error) {
      alert('Error al registrarse. Verificá los datos.');
      console.error(error);
    }
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
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a la comunidad futbolera</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <div className="input-group">
              <User size={20} className="input-icon" />
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                className="form-input"
                required
              />
            </div>
          </div>

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
                placeholder="Crea una contraseña segura"
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
            <div className="password-hint">
              Mínimo 6 caracteres
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            <UserPlus size={20} className="btn-icon" />
            Crear Cuenta
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">¿Ya tienes cuenta?</p>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/login')}>
            <ArrowLeft size={20} className="btn-icon" />
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
