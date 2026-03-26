import React from "react";
import { useNavigate } from "react-router-dom";

const FooterCompact = () => {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">👁️</span>
              <span className="logo-text">Visual Outlet</span>
            </div>
            <p className="footer-description">
              Sistema de gestión especializado para ópticas modernas
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">visualoutlet2000@gmail.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span className="contact-text">300 613 9449</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">(+57) 604 579 9276</span>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Servicios</h4>
              <div className="link-list">
                <button onClick={() => navigate("/servicios")} className="footer-link">
                  Examen de los Ojos
                </button>
                <button onClick={() => navigate("/servicios")} className="footer-link">
                  Gafas y Monturas
                </button>
                <button onClick={() => navigate("/servicios")} className="footer-link">
                  Lentes de Contacto
                </button>
              </div>
            </div>

            <div className="link-group">
              <h4>Ubicación</h4>
              <div className="link-list">
                <button className="footer-link">
                  El Palo con la Playa
                </button>
                <button className="footer-link">
                  Cra 45 # 50-48 Local 102
                </button>
                <button className="footer-link">
                  Medellín, Colombia
                </button>
              </div>
            </div>

            <div className="link-group">
              <h4>Legal</h4>
              <div className="link-list">
                <button className="footer-link">Política de Privacidad</button>
                <button className="footer-link">Términos de Servicio</button>
                <button className="footer-link">Aviso Legal</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>© 2024 Visual Outlet. "Servicio y responsabilidad a precios bajos!"</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCompact;