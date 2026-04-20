// ProductsPage.jsx
// Página de productos — Usa ProductsGrid que conecta al backend real
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ProductsGrid from "../../home/components/Products/ProductsGrid";
import { hasPermiso } from "../utils/permissions";
import "../../../shared/styles/features/home/ProductsPage.css";

const ProductsPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  const handleNavigation = (path) => { navigate(path); window.scrollTo(0, 0); };
  const handleLogin    = () => navigate("/login");
  const handleLogout   = () => { setUser(null); navigate("/"); };
  const handleDashboard = () => navigate(user ? "/admin/dashboard" : "/login");

  // Handler para ir al perfil de usuario
  const handleMiPerfil = () => {
    navigate("/cliente/perfil");
  };

  return (
    <div className="products-page">
      <Navbar
        user={user}
        activePage="productos"
        puedeVerDashboard={puedeVerDashboard}
        onNavigation={handleNavigation}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onDashboard={handleDashboard}
        onMiPerfil={handleMiPerfil}
      />

      {/* Hero */}
      <section className="products-hero">
        <div className="products-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Nuestros <span className="vibrant-text">Productos</span>
            </h1>
            <p className="hero-description">
              Descubre nuestra selección premium de lentes, monturas y accesorios
            </p>
          </div>
        </div>
        <div className="hero-animated-elements">
          <div className="floating-element element-1" style={{ width: 18, height: 18, borderRadius: "50%", background: "#3d8080", opacity: 0.5 }} />
          <div className="floating-element element-2" style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a4a4a", opacity: 0.35 }} />
          <div className="floating-element element-3" style={{ width: 12, height: 12, borderRadius: "50%", background: "#3d8080", opacity: 0.6 }} />
          <div className="floating-element element-4" style={{ width: 22, height: 22, borderRadius: 4, background: "#0d2e2e", opacity: 0.3, transform: "rotate(30deg)" }} />
          <div className="floating-element element-5" style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a4a4a", opacity: 0.5 }} />
        </div>
      </section>

      {/* Grid conectado al backend */}
      <ProductsGrid />

      <FooterCompact />
    </div>
  );
};

export default ProductsPage;