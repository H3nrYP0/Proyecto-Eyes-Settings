import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import FooterCompact from "../components/FooterCompact";
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

      {/* Footer Compacto */}
      <FooterCompact />
    </div>
  );
};

export default LandingPage;