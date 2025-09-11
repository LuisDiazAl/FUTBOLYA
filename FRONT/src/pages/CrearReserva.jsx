import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Search, MapPin, Calendar, MessageCircle, Plus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import '../assets/styles/crearReserva.css';

const CrearReserva = () => {
  const [canchas, setCanchas] = useState([]);
  const [canchaId, setCanchaId] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const res = await fetch('https://localhost:7055/api/Canchas/disponibles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCanchas(data || []);
      } catch (error) {
        console.error('Error al obtener canchas:', error);
      }
    };

    fetchCanchas();
  }, []);

  const filtrarCanchas = () => {
    return canchas.filter(c =>
      (c.nombre?.toLowerCase() ?? '').includes(busqueda.toLowerCase()) ||
      (c.ubicacion?.toLowerCase() ?? '').includes(busqueda.toLowerCase()) ||
      (c.estado?.toLowerCase() ?? '').includes(busqueda.toLowerCase())
    );
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!canchaId) {
      newErrors.canchaId = 'Debes seleccionar una cancha';
    }
    
    if (!fechaHora) {
      newErrors.fechaHora = 'Debes seleccionar fecha y hora';
    } else {
      const selectedDate = new Date(fechaHora);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.fechaHora = 'La fecha debe ser futura';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ canchaId: true, fechaHora: true, observaciones: true });
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const payload = {
      canchaId: parseInt(canchaId),
      fechaHora: new Date(fechaHora).toISOString(),
      observaciones,
      clienteNombre: usuario.nombre,
      clienteTelefono: usuario.telefono || "No informado",
      clienteEmail: usuario.Correo,
      estadoPago: "pendiente",
      esFrecuente: false
    };

    try {
      const res = await fetch('https://localhost:7055/api/Reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`Error: ${err}`);
        return;
      }

      // Success notification
      alert("¡Reserva creada exitosamente!");
      navigate('/home');
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Error al crear la reserva. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    // Update field value
    if (field === 'canchaId') setCanchaId(value);
    if (field === 'fechaHora') setFechaHora(value);
    if (field === 'observaciones') setObservaciones(value);
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const manejarFecha = (e) => {
    const valor = e.target.value;
    const fecha = new Date(valor);
    fecha.setMinutes(0);
    fecha.setSeconds(0);
    setFechaHora(fecha.toISOString().slice(0, 16));
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Crear Nueva Reserva</h1>
          <p className="page-subtitle">Selecciona una cancha y programa tu partido</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-back" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} />
            Volver al Inicio
          </button>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label className="form-label">
              <Search size={16} className="label-icon" />
              Buscar cancha
            </label>
            <div className="input-group">
              <Search size={18} className="input-icon" />
              <input
                className="form-input"
                type="text"
                placeholder="Buscar cancha por nombre, ubicación o estado"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} className="label-icon" />
                Cancha *
              </label>
              <div className="input-group">
                <MapPin size={18} className="input-icon" />
                <select 
                  className={`form-input ${errors.canchaId && touched.canchaId ? 'error' : ''}`}
                  value={canchaId} 
                  onChange={(e) => handleFieldChange('canchaId', e.target.value)}
                  required
                >
                  <option value="">Seleccione una cancha</option>
                  {filtrarCanchas().map((cancha) => (
                    <option key={cancha.id} value={cancha.id}>
                      {cancha.nombre} - {cancha.tipo} - {cancha.superficie}
                    </option>
                  ))}
                </select>
              </div>
              {errors.canchaId && touched.canchaId && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.canchaId}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} className="label-icon" />
                Fecha y hora *
              </label>
              <div className="input-group">
                <Calendar size={18} className="input-icon" />
                <input
                  className={`form-input ${errors.fechaHora && touched.fechaHora ? 'error' : ''}`}
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => {
                    handleFieldChange('fechaHora', e.target.value);
                    manejarFecha(e);
                  }}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              {errors.fechaHora && touched.fechaHora && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.fechaHora}
                </div>
              )}
              <div className="field-hint">
                Selecciona una fecha y hora futura para tu partido
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <MessageCircle size={16} className="label-icon" />
                Observaciones
              </label>
              <div className="input-group">
                <MessageCircle size={18} className="input-icon textarea-icon" />
                <textarea
                  className="form-input form-textarea"
                  value={observaciones}
                  onChange={(e) => handleFieldChange('observaciones', e.target.value)}
                  placeholder="Opcional - Añade cualquier información adicional sobre el partido"
                  rows={4}
                />
              </div>
              <div className="field-hint">
                Puedes añadir detalles como nivel de juego, tipo de partido, etc.
              </div>
            </div>

            <div className="form-group">
              <button 
                className="btn btn-primary" 
                type="submit" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Creando Reserva...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Crear Reserva
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CrearReserva;
