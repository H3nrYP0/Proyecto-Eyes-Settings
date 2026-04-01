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
          <div className="floating-element element-1">👓</div>
          <div className="floating-element element-2">🕶️</div>
          <div className="floating-element element-3">🔍</div>
          <div className="floating-element element-4">✨</div>
          <div className="floating-element element-5">⭐</div>
        </div>
      </section>

      {/* Grid conectado al backend */}
      <ProductsGrid />

      <FooterCompact />
    </div>
  );
};

export default ProductsPage;