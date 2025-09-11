import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../assets/styles/misReservas.css';

const MisReservas = () => {
  const [reservasActivas, setReservasActivas] = useState([]);
  const [reservasPasadas, setReservasPasadas] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const obtenerReservas = async () => {
    if (!token) return;

    try {
      const res = await fetch('https://localhost:7055/api/reservas/mis', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error("Error al obtener reservas:", res.status);
        return;
      }

      const data = await res.json();
      const ahora = new Date();

      const activas = data.filter(r => new Date(r.fecha) > ahora);
      const pasadas = data.filter(r => new Date(r.fecha) <= ahora);


      setReservasActivas(activas);
      setReservasPasadas(pasadas);
    } catch (error) {
      console.error("Error en obtenerReservas:", error);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  const confirmarAccion = async (accion, reservaId) => {
    const confirm1 = window.confirm(`¿Estás seguro que deseas ${accion} esta reserva?`);
    if (!confirm1) return;
    const confirm2 = window.confirm("Esta acción no se puede deshacer. ¿Confirmás?");
    if (!confirm2) return;

    try {
      const endpoint =
        accion === "salir del partido"
          ? `https://localhost:7055/api/reservas/${reservaId}/salir`
          : `https://localhost:7055/api/reservas/${reservaId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert(`Reserva ${reservaId} - ${accion} realizada.`);
        obtenerReservas(); 
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error("Error al realizar acción:", error);
      alert("Hubo un error al procesar la acción.");
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Mis Reservas</h1>
          <p className="page-subtitle">Gestiona tus reservas activas y revisa tu historial</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-back" onClick={() => navigate('/home')}>
            ← Volver al Inicio
          </button>
        </div>
        
        <div className="mis-reservas-container">

          <section>
            <h3 className="section-title">Reservas Activas</h3>
            {reservasActivas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">⚽</div>
                <h3 className="empty-state-title">No tienes reservas activas</h3>
                <p className="empty-state-description">Cuando te unas a un partido, aparecerá aquí</p>
              </div>
            ) : (
              <div className="cards-grid">
                {reservasActivas.map((reserva) => (
                  <div key={reserva.id} className="card reserva-card-activa">
              <strong>{reserva.canchaNombre || reserva.cancha}</strong><br />
              Fecha: {new Date(reserva.fechaHora).toLocaleString('es-AR')}<br />
              Cliente: {reserva.clienteNombre}<br />
              Pago: {reserva.estadoPago}<br />
              Observaciones: {reserva.observaciones || "Ninguna"}

                    <div className="card-actions">
                      <button className="btn btn-secondary" onClick={() => confirmarAccion("salir del partido", reserva.id)}>Salir del partido</button>
                      <button className="btn btn-danger" onClick={() => confirmarAccion("cancelar la reserva", reserva.id)}>Cancelar reserva</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="section-title">Historial</h3>
            {reservasPasadas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3 className="empty-state-title">No hay historial</h3>
                <p className="empty-state-description">Tus reservas pasadas aparecerán aquí</p>
              </div>
            ) : (
              <div className="cards-grid">
                {reservasPasadas.map((reserva) => (
                  <div key={reserva.id} className="card reserva-card-pasada">
              <strong>{reserva.canchaNombre || reserva.cancha}</strong><br />
              Fecha: {new Date(reserva.fecha || reserva.fechaHora).toLocaleString('es-AR')}<br />
              Cliente: {reserva.clienteNombre}<br />
              Pago: {reserva.estadoPago}<br />
                    Observaciones: {reserva.observaciones || "Ninguna"}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default MisReservas;
