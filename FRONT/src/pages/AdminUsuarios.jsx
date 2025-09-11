import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Users, User, Mail, Lock, Shield, Plus, Edit, Trash2, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import '../assets/styles/adminUsuarios.css';
import { useNavigate } from 'react-router-dom';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', correo: '', contraseña: '', rol: 'jugador' });
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('https://localhost:7055/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleChange = (field, value) => {
    setNuevoUsuario(prev => ({ ...prev, [field]: value }));
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!nuevoUsuario.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!nuevoUsuario.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(nuevoUsuario.correo)) {
      newErrors.correo = 'El correo no es válido';
    }
    
    if (!editandoId && !nuevoUsuario.contraseña.trim()) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (nuevoUsuario.contraseña && nuevoUsuario.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!nuevoUsuario.rol) {
      newErrors.rol = 'Debes seleccionar un rol';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const crearUsuario = async () => {
    // Mark all fields as touched
    const allFields = ['nombre', 'correo', 'contraseña', 'rol'];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:7055/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!response.ok) {
        const error = await response.text();
        alert(`Error: ${error}`);
        return;
      }

      setNuevoUsuario({ nombre: '', correo: '', contraseña: '', rol: 'jugador' });
      setTouched({});
      cargarUsuarios();
      alert('¡Usuario creado exitosamente!');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear el usuario. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    setLoading(true);
    try {
      await fetch(`https://localhost:7055/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      cargarUsuarios();
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setNuevoUsuario({ nombre: usuario.nombre, correo: usuario.correo, contraseña: '', rol: usuario.rol });
    setTouched({});
    setErrors({});
  };

  const guardarEdicion = async () => {
    // Mark all fields as touched except password for editing
    const allFields = ['nombre', 'correo', 'rol'];
    if (nuevoUsuario.contraseña) allFields.push('contraseña');
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await fetch(`https://localhost:7055/api/usuarios/${editandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoUsuario)
      });
      
      setEditandoId(null);
      setNuevoUsuario({ nombre: '', correo: '', contraseña: '', rol: 'jugador' });
      setTouched({});
      setErrors({});
      cargarUsuarios();
      alert('¡Usuario actualizado exitosamente!');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNuevoUsuario({ nombre: '', correo: '', contraseña: '', rol: 'jugador' });
    setTouched({});
    setErrors({});
  };

  const getRolIcon = (rol) => {
    switch (rol) {
      case 'administrador': return <Shield size={16} className="rol-icon admin" />;
      case 'establecimiento': return <Settings size={16} className="rol-icon establecimiento" />;
      case 'jugador': default: return <User size={16} className="rol-icon jugador" />;
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'administrador': return 'rol-badge admin';
      case 'establecimiento': return 'rol-badge establecimiento';
      case 'jugador': default: return 'rol-badge jugador';
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">Administra usuarios del sistema</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-back" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} />
            Volver al Inicio
          </button>
        </div>

        <div className="form-container">
          <div className="form-header">
            <Users size={24} className="form-header-icon" />
            <h2 className="form-title">
              {editandoId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
          </div>
          
          <div className="form-usuario">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} className="label-icon" />
                  Nombre Completo *
                </label>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input
                    className={`form-input ${errors.nombre && touched.nombre ? 'error' : ''}`}
                    placeholder="Nombre completo del usuario"
                    value={nuevoUsuario.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
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
                  <Mail size={16} className="label-icon" />
                  Correo Electrónico *
                </label>
                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    className={`form-input ${errors.correo && touched.correo ? 'error' : ''}`}
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={nuevoUsuario.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                  />
                </div>
                {errors.correo && touched.correo && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.correo}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} className="label-icon" />
                  Contraseña {editandoId ? '(opcional)' : '*'}
                </label>
                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    className={`form-input ${errors.contraseña && touched.contraseña ? 'error' : ''}`}
                    type="password"
                    placeholder={editandoId ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
                    value={nuevoUsuario.contraseña}
                    onChange={(e) => handleChange('contraseña', e.target.value)}
                  />
                </div>
                {errors.contraseña && touched.contraseña && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.contraseña}
                  </div>
                )}
                {editandoId && (
                  <div className="field-hint">
                    Deja este campo vacío si no deseas cambiar la contraseña
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Shield size={16} className="label-icon" />
                  Rol del Usuario *
                </label>
                <div className="input-group">
                  <Shield size={18} className="input-icon" />
                  <select
                    className={`form-input ${errors.rol && touched.rol ? 'error' : ''}`}
                    value={nuevoUsuario.rol}
                    onChange={(e) => handleChange('rol', e.target.value)}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="jugador">Jugador</option>
                    <option value="establecimiento">Establecimiento</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                {errors.rol && touched.rol && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.rol}
                  </div>
                )}
                <div className="field-hint">
                  Define los permisos y funcionalidades disponibles para el usuario
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={editandoId ? guardarEdicion : crearUsuario}
                disabled={loading}
                style={{ width: editandoId ? 'auto' : '100%' }}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    {editandoId ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    {editandoId ? <CheckCircle size={18} /> : <Plus size={18} />}
                    {editandoId ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </>
                )}
              </button>
              
              {editandoId && (
                <button 
                  className="btn btn-secondary"
                  onClick={cancelarEdicion}
                  disabled={loading}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="usuarios-section">
          <div className="section-header">
            <h2 className="section-title">Usuarios del Sistema ({usuarios.length})</h2>
            <div className="section-subtitle">Gestiona y administra todos los usuarios registrados</div>
          </div>
          
          <div className="tabla-responsive">
            {usuarios.length === 0 ? (
              <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <h3>No hay usuarios registrados</h3>
                <p>Crea el primer usuario usando el formulario de arriba</p>
              </div>
            ) : (
              <table className="tabla-usuarios">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} className={editandoId === u.id ? 'editing' : ''}>
                      <td>
                        <div className="user-info-cell">
                          <User size={20} className="user-avatar" />
                          <span className="user-name">{u.nombre}</span>
                        </div>
                      </td>
                      <td>
                        <div className="email-cell">
                          <Mail size={16} className="email-icon" />
                          {u.correo}
                        </div>
                      </td>
                      <td>
                        <div className={getRolBadgeClass(u.rol)}>
                          {getRolIcon(u.rol)}
                          <span className="rol-text">{u.rol}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => iniciarEdicion(u)}
                            disabled={loading}
                          >
                            <Edit size={14} />
                            Editar
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarUsuario(u.id)}
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsuarios;