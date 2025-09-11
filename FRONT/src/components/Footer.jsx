import React from 'react';
import '../assets/styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <img src="/IconoFYa.jpeg" alt="FutbolYa" className="footer-logo" />
            <span className="footer-title">FutbolYa</span>
          </div>
          <p className="footer-description">
            La plataforma líder para reservar canchas de fútbol y organizar partidos con amigos.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links">
            <li><a href="/home">Inicio</a></li>
            <li><a href="/crear-reserva">Crear Reserva</a></li>
            <li><a href="/mis-reservas">Mis Reservas</a></li>
            <li><a href="/perfil">Mi Perfil</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Soporte</h4>
          <ul className="footer-links">
            <li><a href="#ayuda">Centro de Ayuda</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><a href="#faq">Preguntas Frecuentes</a></li>
            <li><a href="#reportar">Reportar Problema</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Legal</h4>
          <ul className="footer-links">
            <li><a href="#terminos">Términos de Uso</a></li>
            <li><a href="#privacidad">Política de Privacidad</a></li>
            <li><a href="#cookies">Política de Cookies</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Síguenos</h4>
          <div className="social-links">
            <a href="#facebook" className="social-link facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#twitter" className="social-link twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#instagram" className="social-link instagram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.595 14.347 3.041 12.017 3.041 12.017s.554-2.33 2.085-3.68C5.941 7.536 7.152 7.046 8.449 7.046c1.297 0 2.508.49 3.433 1.291 1.531 1.35 2.085 3.68 2.085 3.68s-.554 2.33-2.085 3.68c-.925.801-2.136 1.291-3.433 1.291z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} FutbolYa. Todos los derechos reservados.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">Hecho con ❤️ en Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;