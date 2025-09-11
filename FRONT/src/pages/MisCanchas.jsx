import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Building2, Type, Layers, Clock, MessageCircle, Plus, Edit, Trash2, CheckCircle, AlertCircle, Target } from 'lucide-react';
import '../assets/styles/MisCanchas.css';

const MisCanchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    obtenerCanchas();
  }, []);

  function initialFormState() {
    return {
      nombre: '', tipo: '', superficie: '', estado: '',
      horarioApertura: '08:00', horarioCierre: '23:00',
      bloquesMantenimiento: '', diasNoDisponibles: '',
      logReparaciones: '', estadoEquipamiento: '',
      notasEspeciales: '', proximoMantenimiento: ''
    };
  }

  const obtenerCanchas = async () => {
    const res = await fetch('https://localhost:7055/api/Canchas/mis-canchas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCanchas(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!form.tipo) {
      newErrors.tipo = 'Debes seleccionar un tipo';
    }
    
    if (!form.superficie) {
      newErrors.superficie = 'Debes seleccionar una superficie';
    }
    
    if (!form.horarioApertura) {
      newErrors.horarioApertura = 'El horario de apertura es requerido';
    }
    
    if (!form.horarioCierre) {
      newErrors.horarioCierre = 'El horario de cierre es requerido';
    }
    
    if (form.horarioApertura && form.horarioCierre && form.horarioApertura >= form.horarioCierre) {
      newErrors.horarioCierre = 'El horario de cierre debe ser posterior al de apertura';
    }
    
    if (!form.notasEspeciales.trim()) {
      newErrors.notasEspeciales = 'Las notas especiales son requeridas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const stringToTicks = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return ((h * 60 + m) * 60 * 10000000);
  };

  const ticksToTime = (ticks) => {
    const totalMinutes = Math.floor(ticks / 600000000);
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['nombre', 'tipo', 'superficie', 'horarioApertura', 'horarioCierre', 'notasEspeciales'];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const method = editandoId ? 'PUT' : 'POST';
      const url = editandoId
        ? `https://localhost:7055/api/Canchas/${editandoId}`
        : 'https://localhost:7055/api/Canchas';

      const payload = {
        ...form,
        horarioApertura: form.horarioApertura + ":00",
        horarioCierre: form.horarioCierre + ":00",
        proximoMantenimiento: form.proximoMantenimiento || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        alert(`Error: ${error}`);
        return;
      }

      setForm(initialFormState());
      setEditandoId(null);
      setTouched({});
      obtenerCanchas();
      alert(editandoId ? '¡Cancha actualizada exitosamente!' : '¡Cancha creada exitosamente!');
    } catch (error) {
      console.error('Error al guardar cancha:', error);
      alert('Error al guardar la cancha. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta cancha?')) return;
    await fetch(`https://localhost:7055/api/Canchas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    obtenerCanchas();
  };

  const handleEditar = (cancha) => {
    setForm({
      ...cancha,
      horarioApertura: ticksToTime(cancha.horarioApertura.ticks),
      horarioCierre: ticksToTime(cancha.horarioCierre.ticks)
    });
    setEditandoId(cancha.id);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Canchas</h1>
          <p className="page-subtitle">Administra y configura tus canchas deportivas</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-back" onClick={() => window.location.href = '/home'}>
            <ArrowLeft size={16} />
            Volver al Inicio
          </button>
        </div>

        <div className="form-container">
          <div className="form-header">
            <Target size={24} className="form-header-icon" />
            <h2 className="form-title">
              {editandoId ? 'Editar Cancha' : 'Crear Nueva Cancha'}
            </h2>
          </div>
          
          <form className="form-canchas" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Type size={16} className="label-icon" />
                Nombre de la Cancha *
              </label>
              <div className="input-group">
                <Type size={18} className="input-icon" />
                <input
                  className={`form-input ${errors.nombre && touched.nombre ? 'error' : ''}`}
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Cancha Principal, Campo Norte..."
                  required
                />
              </div>
              {errors.nombre && touched.nombre && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.nombre}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Building2 size={16} className="label-icon" />
                Tipo de Cancha *
              </label>
              <div className="input-group">
                <Building2 size={18} className="input-icon" />
                <select
                  className={`form-input ${errors.tipo && touched.tipo ? 'error' : ''}`}
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona el tipo de cancha</option>
                  <option value="futbol-5">Fútbol 5</option>
                  <option value="futbol-7">Fútbol 7</option>
                  <option value="futbol-11">Fútbol 11</option>
                </select>
              </div>
              {errors.tipo && touched.tipo && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.tipo}
                </div>
              )}
              <div className="field-hint">
                Selecciona el formato según la cantidad de jugadores
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Layers size={16} className="label-icon" />
                Tipo de Superficie *
              </label>
              <div className="input-group">
                <Layers size={18} className="input-icon" />
                <select
                  className={`form-input ${errors.superficie && touched.superficie ? 'error' : ''}`}
                  id="superficie"
                  name="superficie"
                  value={form.superficie}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona el tipo de superficie</option>
                  <option value="sintetico">Césped Sintético</option>
                  <option value="cesped">Césped Natural</option>
                </select>
              </div>
              {errors.superficie && touched.superficie && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.superficie}
                </div>
              )}
              <div className="field-hint">
                El tipo de superficie afecta las condiciones de juego
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} className="label-icon" />
                  Horario de Apertura *
                </label>
                <div className="input-group">
                  <Clock size={18} className="input-icon" />
                  <input
                    className={`form-input ${errors.horarioApertura && touched.horarioApertura ? 'error' : ''}`}
                    type="time"
                    id="horarioApertura"
                    name="horarioApertura"
                    value={form.horarioApertura}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.horarioApertura && touched.horarioApertura && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.horarioApertura}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} className="label-icon" />
                  Horario de Cierre *
                </label>
                <div className="input-group">
                  <Clock size={18} className="input-icon" />
                  <input
                    className={`form-input ${errors.horarioCierre && touched.horarioCierre ? 'error' : ''}`}
                    type="time"
                    id="horarioCierre"
                    name="horarioCierre"
                    value={form.horarioCierre}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.horarioCierre && touched.horarioCierre && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.horarioCierre}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <MessageCircle size={16} className="label-icon" />
                Notas Especiales *
              </label>
              <div className="input-group">
                <MessageCircle size={18} className="input-icon textarea-icon" />
                <textarea
                  className={`form-input form-textarea ${errors.notasEspeciales && touched.notasEspeciales ? 'error' : ''}`}
                  id="notasEspeciales"
                  name="notasEspeciales"
                  value={form.notasEspeciales}
                  onChange={handleChange}
                  placeholder="Información adicional sobre la cancha: equipamiento, reglas especiales, mantenimiento..."
                  rows={4}
                  required
                />
              </div>
              {errors.notasEspeciales && touched.notasEspeciales && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.notasEspeciales}
                </div>
              )}
              <div className="field-hint">
                Incluye detalles importantes sobre equipamiento, reglas o estado de la cancha
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                type="submit" 
                style={{ width: editandoId ? 'auto' : '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    {editandoId ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    {editandoId ? <CheckCircle size={18} /> : <Plus size={18} />}
                    {editandoId ? 'Actualizar Cancha' : 'Crear Cancha'}
                  </>
                )}
              </button>
              
              {editandoId && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { 
                    setEditandoId(null); 
                    setForm(initialFormState()); 
                    setTouched({});
                    setErrors({});
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="canchas-section">
          <div className="section-header">
            <h2 className="section-title">Tus Canchas ({canchas.length})</h2>
            <div className="section-subtitle">Gestiona y edita la información de tus canchas</div>
          </div>
          
          <div className="lista-canchas">
            {canchas.length === 0 ? (
              <div className="empty-state">
                <Building2 size={48} className="empty-icon" />
                <h3>No tienes canchas registradas</h3>
                <p>Crea tu primera cancha usando el formulario de arriba</p>
              </div>
            ) : (
              canchas.map(c => (
                <div key={c.id} className="cancha-card">
                  <div className="card-header">
                    <div className="card-title">
                      <Building2 size={20} className="card-icon" />
                      <h3>{c.nombre}</h3>
                    </div>
                    <div className="card-badge">{c.estado || 'Disponible'}</div>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-info">
                      <div className="info-item">
                        <Type size={16} className="info-icon" />
                        <span>Tipo: {c.tipo}</span>
                      </div>
                      <div className="info-item">
                        <Layers size={16} className="info-icon" />
                        <span>Superficie: {c.superficie}</span>
                      </div>
                      <div className="info-item">
                        <Clock size={16} className="info-icon" />
                        <span>Horarios: {c.horarioApertura?.slice(0,5)} - {c.horarioCierre?.slice(0,5)}</span>
                      </div>
                      {c.proximoMantenimiento && (
                        <div className="info-item">
                          <AlertCircle size={16} className="info-icon warning" />
                          <span>Próximo Mantenimiento: {c.proximoMantenimiento?.split('T')[0]}</span>
                        </div>
                      )}
                    </div>
                    
                    {c.notasEspeciales && (
                      <div className="card-notes">
                        <MessageCircle size={16} className="notes-icon" />
                        <p>{c.notasEspeciales}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleEditar(c)}
                      disabled={loading}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleEliminar(c.id)}
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MisCanchas;