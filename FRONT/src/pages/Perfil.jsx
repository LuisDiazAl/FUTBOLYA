import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft, User, Camera, Upload, Target, Trophy, TrendingDown, Loader2 } from 'lucide-react';
import '../assets/styles/perfil.css';

const Perfil = () => {
  const [jugador, setJugador] = useState(null);
  const [fotoCargando, setFotoCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJugador = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('https://localhost:7055/api/rendimientos/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('No se pudo obtener el jugador');

        const data = await response.json();
        setJugador(data);
      } catch (error) {
        console.error('Error al obtener datos del jugador:', error);
      }
    };

    fetchJugador();
  }, []);

  const handleFotoChange = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    setFotoCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7055/api/usuarios/subir-foto', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      setJugador((prev) => ({ ...prev, fotoPerfil: data.ruta }));
    } catch (error) {
      console.error('Error al subir la foto:', error);
    } finally {
      setFotoCargando(false);
    }
  };

  if (!jugador) {
    return (
      <Layout>
        <div className="loading-container">
          <Loader2 size={48} className="loading-spinner animate-spin" />
          <p>Cargando perfil...</p>
        </div>
      </Layout>
    );
  }

  const imagenPerfil = jugador.fotoPerfil
    ? `https://localhost:7055${jugador.fotoPerfil}`
    : '/default-profile.png';

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Mi Perfil</h1>
          <p className="page-subtitle">Información personal y estadísticas de rendimiento</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-back" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} />
            Volver al Inicio
          </button>
        </div>

        <div className="perfil-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-container">
                <img 
                  src={imagenPerfil} 
                  alt="Foto del jugador" 
                  className="profile-avatar" 
                />
                <div className="avatar-overlay">
                  <Camera size={24} className="camera-icon" />
                </div>
              </div>
              
              <div className="profile-upload-section">
                <label className="btn btn-secondary upload-btn">
                  {fotoCargando ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Cambiar Foto
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={handleFotoChange} 
                    accept="image/*"
                    hidden 
                    disabled={fotoCargando}
                  />
                </label>
                <div className="upload-hint">
                  Formatos: JPG, PNG. Máximo 5MB
                </div>
              </div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{jugador.nombre}</h2>
              <div className="profile-role">
                <User size={16} className="role-icon" />
                <span>Jugador</span>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-section">
            <div className="section-title">Estadísticas de Rendimiento</div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Target size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{jugador.partidosJugados}</div>
                  <div className="stat-label">Partidos Jugados</div>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">
                  <Trophy size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{jugador.partidosGanados}</div>
                  <div className="stat-label">Partidos Ganados</div>
                </div>
              </div>

              <div className="stat-card danger">
                <div className="stat-icon">
                  <TrendingDown size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{jugador.partidosPerdidos}</div>
                  <div className="stat-label">Partidos Perdidos</div>
                </div>
              </div>

            </div>
          </div>


          {/* Win Rate Section */}
          {jugador.partidosJugados > 0 && (
            <div className="performance-section">
              <div className="section-title">Rendimiento</div>
              <div className="performance-card">
                <div className="win-rate">
                  <div className="win-rate-circle">
                    <div className="win-rate-value">
                      {Math.round((jugador.partidosGanados / jugador.partidosJugados) * 100)}%
                    </div>
                  </div>
                  <div className="win-rate-label">Tasa de Victoria</div>
                </div>
                <div className="performance-stats">
                  <div className="performance-stat">
                    <span className="performance-label">Victorias</span>
                    <span className="performance-value success">{jugador.partidosGanados}</span>
                  </div>
                  <div className="performance-stat">
                    <span className="performance-label">Derrotas</span>
                    <span className="performance-value danger">{jugador.partidosPerdidos}</span>
                  </div>
                  {(jugador.partidosJugados - jugador.partidosGanados - jugador.partidosPerdidos) > 0 && (
                    <div className="performance-stat">
                      <span className="performance-label">Empates</span>
                      <span className="performance-value neutral">
                        {jugador.partidosJugados - jugador.partidosGanados - jugador.partidosPerdidos}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
