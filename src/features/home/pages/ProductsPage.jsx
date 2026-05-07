// =============================================================
// ProductsPage.jsx — Con CartProvider(user), WishlistDrawer, CartFab
// =============================================================

import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ProductsGrid from "../../home/components/Products/ProductsGrid";
import ProductDetail from "../../home/components/Products/ProductDetail";
import ShoppingCart, { CartProvider, WishlistDrawer, useCart } from "../../home/components/Products/ShoppingCart";
import { hasPermiso } from "../utils/permissions";
import "../../../shared/styles/features/home/ProductsPage.css";
import "../../../shared/styles/features/home/ProductDetail.css";
import "../../../shared/styles/features/home/ShoppingCart.css";
import "../../../shared/styles/features/home/PaymentModal.css";

// Botón flotante del carrito
const CartFab = () => {
  const { cartCount, toggleCart } = useCart();
  if (cartCount === 0) return null;
  return (
    <button className="cart-fab" onClick={toggleCart} aria-label={`Carrito (${cartCount})`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span className="cart-fab-badge">{cartCount}</span>
    </button>
  );
};

const ProductsPageContent = ({ user, setUser }) => {
  const navigate = useNavigate();
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  return (
    <div className="products-page">
      <Navbar
        user={user}
        activePage="productos"
        puedeVerDashboard={puedeVerDashboard}
        onNavigation={p => { navigate(p); window.scrollTo(0, 0); }}
        onLogin={() => navigate("/login")}
        onLogout={() => { setUser(null); navigate("/"); }}
        onDashboard={() => navigate(user ? "/admin/dashboard" : "/login")}
        onMiPerfil={() => navigate("/cliente/perfil")}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
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
                  <div className="floating-element element-1" style={{ width:18,height:18,borderRadius:"50%",background:"#3d8080",opacity:0.5 }} />
                  <div className="floating-element element-2" style={{ width:28,height:28,borderRadius:"50%",background:"#1a4a4a",opacity:0.35 }} />
                  <div className="floating-element element-3" style={{ width:12,height:12,borderRadius:"50%",background:"#3d8080",opacity:0.6 }} />
                  <div className="floating-element element-4" style={{ width:22,height:22,borderRadius:4,background:"#0d2e2e",opacity:0.3,transform:"rotate(30deg)" }} />
                  <div className="floating-element element-5" style={{ width:10,height:10,borderRadius:"50%",background:"#1a4a4a",opacity:0.5 }} />
                </div>
              </section>
              <ProductsGrid />
            </>
          }
        />
        <Route path=":id" element={<ProductDetail user={user} />} />
      </Routes>

      <ShoppingCart user={user} />
      <WishlistDrawer user={user} />
      <CartFab />
      <FooterCompact />
    </div>
  );
};

const ProductsPage = ({ user, setUser }) => (
  <CartProvider user={user}>
    <ProductsPageContent user={user} setUser={setUser} />
  </CartProvider>
);

export default ProductsPage;