// =============================================================
// AuthHome.jsx — Envuelve con CartProvider para que el carrito
// y la wishlist funcionen también en la landing
// =============================================================

import Navbar from "./Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import FooterCompact from "../components/FooterCompact";
import ShoppingCart, { CartProvider, WishlistDrawer } from "../../home/components/Products/ShoppingCart";
import "/src/shared/styles/features/home/LandingPage.css";
import "/src/shared/styles/features/home/ShoppingCart.css";

const AuthHomeInner = ({
  user,
  puedeVerDashboard,
  onNavigation,
  onLogin,
  onLogout,
  onDashboard,
  onMiPerfil,
}) => (
  <div className="landing-page">
    <Navbar
      user={user}
      activePage="inicio"
      puedeVerDashboard={puedeVerDashboard}
      onNavigation={onNavigation}
      onLogin={onLogin}
      onLogout={onLogout}
      onDashboard={onDashboard}
      onMiPerfil={onMiPerfil}
    />

    <div className="landing-content">
      <HeroSection user={user} onGetStarted={onDashboard} />
      <FeaturesSection />
      <ServicesSection />
      <ContactSection />
    </div>

    {/* Carrito y wishlist disponibles desde la landing */}
    <ShoppingCart user={user} />
    <WishlistDrawer user={user} />

    <FooterCompact />
  </div>
);

const AuthHome = (props) => (
  <CartProvider user={props.user}>
    <AuthHomeInner {...props} />
  </CartProvider>
);

export default AuthHome;