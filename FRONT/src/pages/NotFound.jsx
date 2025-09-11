import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="page-container">
        <div className="empty-state" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="empty-state-icon" style={{ fontSize: '80px' }}>🏟️</div>
          <h1 className="empty-state-title" style={{ fontSize: '32px', marginBottom: '16px' }}>
            Página no encontrada
          </h1>
          <p className="empty-state-description" style={{ fontSize: '16px', marginBottom: '32px' }}>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/home')}
            >
              Ir al Inicio
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;