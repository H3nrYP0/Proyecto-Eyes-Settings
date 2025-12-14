import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import "/src/shared/styles/features/home/LandingPage.css";
// Importamos las constantes de roles y permisos
import { ROLES } from "../../../shared/constants/roles";

const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => navigate("/login");
  const handleDashboard = () => user ? navigate("/admin/dashboard") : navigate("/login");
  const handleLogout = () => { setUser(null); navigate("/"); };

  // Función para verificar si el usuario es especial (tiene acceso al dashboard)
  const isSpecialUser = () => {
    if (!user || !user.role) return false;
    
    // Usuarios especiales: admin, vendedor, óptico
    return (
      user.role === ROLES.ADMIN ||
      user.role === ROLES.VENDEDOR ||
      user.role === ROLES.OPTICO ||
      user.role === ROLES.SUPER_ADMIN
    );
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="logo">
              <span className="logo-text">VISUAL OUTLET</span>
            </div>
          </div>
          
          <div className="nav-menu">
            <button 
              className="nav-link active"
              onClick={() => handleNavigation("/")}
            >
              Inicio
            </button>
            <button 
              className="nav-link"
              onClick={() => handleNavigation("/productos")}
            >
              Productos
            </button>
            <button 
              className="nav-link"
              onClick={() => handleNavigation("/servicios")}
            >
              Servicios
            </button>
          </div>
          
          <div className="nav-actions">
            {user ? (
              <div className="user-actions">
                <span className="user-greeting">Hola, {user.name}</span>
                
                {/* BOTÓN DASHBOARD - SOLO PARA USUARIOS ESPECIALES */}
                {isSpecialUser() && (
                  <button 
                    className="btn btn-dashboard"
                    onClick={handleDashboard}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#4caf50',
                      color: 'white'
                    }}
                  >
                    Ir al Dashboard
                  </button>
                )}
                
                <button className="btn btn-logout" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <button className="btn btn-login" onClick={handleLogin}>
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="landing-content">
        <HeroSection 
          user={user} 
          onGetStarted={handleDashboard}
        />
        <FeaturesSection />
        <ServicesSection />
        <ContactSection />
      </div>

      {/* Footer Integrado */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">👁️</span>
                <span className="logo-text">Visual Outlet</span>
              </div>
              <p className="footer-description">
                Sistema de gestión especializado para ópticas modernas. 
                Controla ventas, inventario y clientes en una sola plataforma.
              </p>
              
              <div className="social-links">
                <button className="social-link">📘</button>
                <button className="social-link">📷</button>
                <button className="social-link">🐦</button>
                <button className="social-link">💼</button>
              </div>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h4>Navegación</h4>
                <div className="link-list">
                  <button onClick={() => handleNavigation("/")} className="footer-link">
                    Inicio
                  </button>
                  <button onClick={() => handleNavigation("/productos")} className="footer-link">
                    Productos
                  </button>
                  <button onClick={() => handleNavigation("/servicios")} className="footer-link">
                    Servicios
                  </button>
                </div>
              </div>

              <div className="link-group">
                <h4>Servicios</h4>
                <div className="link-list">
                  <span className="footer-link">Exámenes Visuales</span>
                  <span className="footer-link">Lentes de Contacto</span>
                  <span className="footer-link">Ajuste de Monturas</span>
                  <span className="footer-link">Reparaciones</span>
                </div>
              </div>

              <div className="link-group">
                <h4>Contacto</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span className="contact-text">+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span className="contact-text">hola@visualoutlet.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span className="contact-text">Av. Principal 123, Ciudad, País</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🕒</span>
                    <span className="contact-text">Lun-Vie: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="copyright">
                <p>&copy; 2024 Visual Outlet. Todos los derechos reservados.</p>
              </div>
              
              <div className="legal-links">
                <button className="legal-link">Política de Privacidad</button>
                <span className="separator">•</span>
                <button className="legal-link">Términos de Servicio</button>
                <span className="separator">•</span>
                <button className="legal-link">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;