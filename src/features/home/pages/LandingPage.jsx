import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import "/src/shared/styles/features/home/LandingPage.css";

const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleDashboard = () => user ? navigate("/admin/dashboard") : navigate("/login");
  const handleLogout = () => { setUser(null); navigate("/"); };

  return (
    <div className="landing-page">
      {/* Navigation - MÁS PEQUEÑO Y ESTILIZADO */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <a className="logo" href="#">
              <span className="logo-icon">●</span>
              Visual Outlet
            </a>
          </div>
          
          <div className="nav-actions">
            {user ? (
              <div className="user-actions">
                <span className="user-greeting">Hola, {user.name}</span>
                <button className="btn btn-primary" onClick={handleDashboard}>
                  Dashboard
                </button>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <button className="btn btn-primary" onClick={handleLogin}>
                  Entrar al Sistema
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

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">👁️</span>
                Visual Outlet
              </div>
              <p className="footer-description">
                Sistema de gestión especializado para ópticas modernas. 
                Controla ventas, inventario y clientes en una sola plataforma.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Producto</h4>
                <a href="#features">Características</a>
                <a href="#services">Servicios</a>
                <a href="#contact">Contacto</a>
              </div>
              
              <div className="link-group">
                <h4>Empresa</h4>
                <a href="#">Sobre Nosotros</a>
                <a href="#">Blog</a>
                <a href="#">Carreras</a>
              </div>
              
              <div className="link-group">
                <h4>Legal</h4>
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Visual Outlet. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;