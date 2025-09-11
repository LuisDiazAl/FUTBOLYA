import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle, 
  Plus, 
  CalendarDays,
  Timer,
  Trophy,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';
import '../assets/styles/home.css';

const Home = () => {
  const [reservas, setReservas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCapacidad, setFiltroCapacidad] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, disponibles: 0, participando: 0 });
  const reservasPorPagina = 6;

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const esAdmin = usuario?.rol === 'administrador';
  const esEstablecimiento = usuario?.rol === 'establecimiento';
  const esJugador = usuario?.rol === 'jugador';

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://localhost:7055/api/reservas/disponibles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setReservas(data || []);
        
        // Calculate stats
        const total = data?.length || 0;
        const disponibles = data?.filter(r => r.anotados < r.capacidad).length || 0;
        const participando = data?.filter(r => r.anotados > 0).length || 0;
        setStats({ total, disponibles, participando });
      } catch (error) {
        console.error('Error fetching reservas:', error);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const reservasFiltradas = reservas.filter(reserva => {
    const matchesBusqueda = !busqueda || 
      reserva.nombreCancha?.toLowerCase().includes(busqueda.toLowerCase()) ||
      reserva.ubicacion?.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchesTipo = !filtroTipo || reserva.tipo === filtroTipo;
    
    const matchesCapacidad = !filtroCapacidad || (
      filtroCapacidad === 'disponible' ? reserva.anotados < reserva.capacidad :
      filtroCapacidad === 'lleno' ? reserva.anotados >= reserva.capacidad :
      filtroCapacidad === 'pocos' ? (reserva.capacidad - reserva.anotados) <= 2 && reserva.anotados < reserva.capacidad :
      true
    );
    
    return matchesBusqueda && matchesTipo && matchesCapacidad;
  });

  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const indexInicio = (paginaActual - 1) * reservasPorPagina;
  const indexFin = indexInicio + reservasPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indexInicio, indexFin);

  const manejarUnirse = async (reservaId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://localhost:7055/api/reservas/${reservaId}/unirse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`Error: ${err}`);
        return;
      }

      alert('¡Te uniste a la reserva!');
      window.location.reload();
    } catch (error) {
      alert('Hubo un error al unirse');
    }
  };

  const getCapacidadColor = (anotados, capacidad) => {
    const ratio = anotados / capacidad;
    if (ratio >= 1) return '#e53e3e'; // Completo
    if (ratio >= 0.75) return '#d69e2e'; // Casi lleno
    return '#38a169'; // Disponible
  };

  const getTimeUntilMatch = (fechaHora) => {
    const now = new Date();
    const matchDate = new Date(fechaHora);
    const diffHours = Math.round((matchDate - now) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Pronto';
    if (diffHours < 24) return `En ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `En ${diffDays}d`;
  };

  const clearFilters = () => {
    setBusqueda('');
    setFiltroTipo('');
    setFiltroCapacidad('');
    setPaginaActual(1);
  };



  if (loading) {
    return (
      <Layout>
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Cargando partidos disponibles...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="home-content">
        {/* Hero Section */}
        <div className="home-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              ¡Hola, {usuario?.nombre}! <Target size={48} className="hero-icon" />
            </h1>
            <p className="hero-subtitle">
              Encuentra el partido perfecto y conecta con otros jugadores
            </p>
            
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Partidos Totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.disponibles}</div>
                <div className="stat-label">Disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.participando}</div>
                <div className="stat-label">En Progreso</div>
              </div>
            </div>
            
            {esJugador && (
              <div className="hero-actions">
                <Link to="/crear-reserva" className="btn btn-primary btn-lg">
                  <Plus size={20} className="btn-icon" />
                  Crear Nuevo Partido
                </Link>
                <Link to="/mis-reservas" className="btn btn-secondary btn-lg">
                  <CalendarDays size={20} className="btn-icon" />
                  Mis Reservas
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Search & Filters */}
        <div className="search-filters-section">
          <div className="search-header">
            <h2>Buscar Partidos</h2>
            <p>Encuentra el partido perfecto para ti</p>
          </div>
          
          <div className="filters-container">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre de cancha o ubicación..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="fútbol 11">Fútbol 11</option>
              <option value="fútbol 7">Fútbol 7</option>
              <option value="fútbol 5">Fútbol 5</option>
            </select>
            
            <select 
              className="filter-select"
              value={filtroCapacidad}
              onChange={(e) => setFiltroCapacidad(e.target.value)}
            >
              <option value="">Cualquier estado</option>
              <option value="disponible">Con lugares</option>
              <option value="pocos">Pocos lugares</option>
              <option value="lleno">Completo</option>
            </select>
            
            {(busqueda || filtroTipo || filtroCapacidad) && (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="results-summary">
            <span>{reservasFiltradas.length} partido{reservasFiltradas.length !== 1 ? 's' : ''} encontrado{reservasFiltradas.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">

          <div className="partidos-grid">
            {reservasFiltradas.length === 0 ? (
              <div className="empty-state-large">
                <Target size={64} className="empty-icon" />
                <h3>No hay partidos {busqueda || filtroTipo || filtroCapacidad ? 'que coincidan con tu búsqueda' : 'disponibles'}</h3>
                <p>
                  {busqueda || filtroTipo || filtroCapacidad 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : '¡Sé el primero en crear una reserva!'}
                </p>
                {(busqueda || filtroTipo || filtroCapacidad) && (
                  <button className="btn btn-primary" onClick={clearFilters}>
                    <X size={16} className="btn-icon" />
                    Ver todos los partidos
                  </button>
                )}
              </div>
            ) : (
              reservasPaginadas.map((reserva) => (
                <div key={reserva.id} className="match-card">
                  <div className="match-card-header">
                    <div className="match-image">
                      <img src="/cancha.jpg" alt="Cancha" />
                      <div className="match-time-badge">
                        {getTimeUntilMatch(reserva.fechaHora)}
                      </div>
                    </div>
                    <div className="match-type-badge">
                      {reserva.tipo}
                    </div>
                  </div>
                  
                  <div className="match-card-content">
                    <h3 className="match-title">{reserva.nombreCancha}</h3>
                    
                    <div className="match-details">
                      <div className="detail-item">
                        <MapPin size={16} className="detail-icon" />
                        <span className="detail-text">{reserva.ubicacion}</span>
                      </div>
                      
                      <div className="detail-item">
                        <Calendar size={16} className="detail-icon" />
                        <span className="detail-text">
                          {new Date(reserva.fechaHora).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <Users size={16} className="detail-icon" />
                        <div className="players-info">
                          <span className="detail-text">{reserva.anotados} / {reserva.capacidad}</span>
                          <div className="capacity-bar">
                            <div 
                              className="capacity-fill"
                              style={{
                                width: `${(reserva.anotados / reserva.capacidad) * 100}%`,
                                backgroundColor: getCapacidadColor(reserva.anotados, reserva.capacidad)
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {reserva.observaciones && (
                        <div className="detail-item">
                          <MessageCircle size={16} className="detail-icon" />
                          <span className="detail-text">{reserva.observaciones}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="match-card-footer">
                      <div className="payment-status">
                        <span 
                          className={`status-badge ${
                            reserva.estadoPago === 'Pagado' ? 'status-paid' : 'status-pending'
                          }`}
                        >
                          {reserva.estadoPago}
                        </span>
                      </div>
                      
                      {esJugador && (
                        <div className="match-actions">
                          {reserva.anotados < reserva.capacidad ? (
                            <button 
                              onClick={() => manejarUnirse(reserva.id)} 
                              className="btn btn-primary btn-sm"
                            >
                              <Plus size={14} className="btn-icon" />
                              Unirse
                            </button>
                          ) : (
                            <button className="btn btn-secondary btn-sm" disabled>
                              <CheckCircle size={14} className="btn-icon" />
                              Completo
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {totalPaginas > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-btn ${paginaActual === i + 1 ? 'active' : ''}`}
                    onClick={() => setPaginaActual(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  className="pagination-btn"
                  onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === totalPaginas}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="pagination-info">
                Página {paginaActual} de {totalPaginas}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
