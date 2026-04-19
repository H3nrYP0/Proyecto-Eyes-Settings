// =============================================================
// AuthHome.jsx
// RESPONSABILIDAD: Contenedor visual de la página de inicio.
//   - Usa el Navbar compartido con activePage="inicio"
//   - Ensambla las secciones (Hero, Features, Services, etc.)
//   - NO contiene lógica de negocio ni permisos
//   - Todo handler y permiso llega como prop desde LandingPage
// =============================================================

import Navbar from "./Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import FooterCompact from "../components/FooterCompact";
import "/src/shared/styles/features/home/LandingPage.css";

const AuthHome = ({
  user,
  puedeVerDashboard,
  onNavigation,
  onLogin,
  onLogout,
  onDashboard,
  onMiPerfil
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

    <FooterCompact />
  </div>
);

export default AuthHome;