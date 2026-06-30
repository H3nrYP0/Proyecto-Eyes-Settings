import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ServiceCard from "../components/Services/ServiceCard";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import CitaForm from "../components/Services/CitaForm";
import MisCitas from "../components/Services/MisCitas";
import {
  getServiciosActivosLanding,
  getEstadosCitaLanding,
  getMiPerfil,
} from "../components/Services/citasLandingService";
import authServices from "@auth/services/authServices";
import "@shared/styles/features/home/ServicesPage.css";

// Material UI icons — solo los funcionales, no los decorativos del hero
import LockIcon from "@mui/icons-material/Lock";
import WarningIcon from "@mui/icons-material/Warning";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Carrito
import ShoppingCart, { CartProvider, WishlistDrawer } from "../../home/components/Products/ShoppingCart";

// ── Elementos flotantes del hero — mismos círculos geométricos que ProductsPage ──
const HeroAnimatedElements = () => (
  <div className="hero-animated-elements">
    <div className="floating-element element-1" style={{ width:18, height:18, borderRadius:"50%", background:"#3d8080", opacity:0.5 }} />
    <div className="floating-element element-2" style={{ width:28, height:28, borderRadius:"50%", background:"#1a4a4a", opacity:0.35 }} />
    <div className="floating-element element-3" style={{ width:12, height:12, borderRadius:"50%", background:"#3d8080", opacity:0.6 }} />
    <div className="floating-element element-4" style={{ width:22, height:22, borderRadius:4, background:"#0d2e2e", opacity:0.3, transform:"rotate(30deg)" }} />
    <div className="floating-element element-5" style={{ width:10, height:10, borderRadius:"50%", background:"#1a4a4a", opacity:0.5 }} />
  </div>
);

const ServicesPageContent = ({ user, setUser }) => {
  const navigate = useNavigate();
  const showDashboard = user ? authServices.hasAdminAccess(user) : false;

  const {
    data: servicios = [],
    isLoading: loadingServicios,
    isError: serviciosError,
    error: serviciosErrorObj,
  } = useQuery({
    queryKey: ["serviciosLanding"],
    queryFn: getServiciosActivosLanding,
    staleTime: 1000 * 60,
    retry: 1,
  });

  const {
    data: estadosCita = [],
    isLoading: loadingEstados,
    isError: estadosError,
    error: estadosErrorObj,
  } = useQuery({
    queryKey: ["estadosCitaLanding"],
    queryFn: getEstadosCitaLanding,
    staleTime: 1000 * 60,
    retry: 1,
  });

  const {
    data: clienteData,
    isLoading: loadingCliente,
    isError: clienteError,
    error: clienteErrorObj,
  } = useQuery({
    queryKey: ["clientePerfil"],
    queryFn: getMiPerfil,
    enabled: !!user,
    retry: false,
  });

  const serviciosCargados = servicios || [];
  const estadosCitaCargados = estadosCita || [];
  const clienteActual = clienteData || null;

  const profileErrorMessage =
    clienteErrorObj?.message ||
    clienteErrorObj?.response?.data?.mensaje ||
    clienteErrorObj?.response?.data?.error ||
    "";

  const isAdminMode =
    !!user &&
    clienteError &&
    profileErrorMessage.includes("No tienes un perfil de cliente asociado");

  const errorCliente =
    !!user && clienteError && !isAdminMode
      ? profileErrorMessage || "No se pudo obtener tu información."
      : "";

  const loadingData = loadingServicios || loadingEstados;

  useEffect(() => {
    if (clienteActual && !isAdminMode) {
      setTimeout(() => {
        document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [clienteActual, isAdminMode]);

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    authServices.logout();
    setUser(null);
    navigate("/");
  };
  const handleDashboard = () => navigate("/admin");
  const handleMiPerfil = () => navigate("/cliente/perfil");

  const handleAgendar = () => {
    if (isAdminMode) {
      alert("Modo administrador: No puedes agendar citas. Utiliza una cuenta de cliente.");
    } else if (!clienteActual) {
      alert("Debes iniciar sesión como cliente para agendar.");
    } else {
      document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCitasModal, setShowCitasModal] = useState(false);

  const handleCitaChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user) {
    return (
      <div className="services-page">
        <Navbar
          user={user}
          activePage="servicios"
          puedeVerDashboard={showDashboard}
          onNavigation={handleNavigation}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onDashboard={handleDashboard}
          onMiPerfil={handleMiPerfil}
        />
        <section className="services-hero">
          <div className="services-container">
            <div className="hero-content">
              <h1 className="hero-title">Nuestros <span className="glowing-text">Servicios</span></h1>
              <p className="hero-description">Servicios optométricos profesionales para el cuidado integral de tu salud visual</p>
            </div>
          </div>
          <HeroAnimatedElements />
        </section>

        <section className="services-section" style={{ padding: "4rem 0" }}>
          <div className="services-container">
            <div className="section-header">
              <h2 className="section-title">Servicios <span className="blue-gradient-text">Especializados</span></h2>
              <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
            </div>
            {loadingData ? (
              <LoadingSpinner mensaje="Cargando servicios..." />
            ) : serviciosCargados.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", justifyContent: "center" }}>
                {serviciosCargados.map((s) => (
                  <ServiceCard key={s.id} servicio={s} onAgendar={null} disabledMessage="Debes iniciar sesión para agendar citas." />
                ))}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: "3rem 2rem 4rem", background: "linear-gradient(160deg,#f3f8f8 0%,#fff 60%,#e6f2f2 100%)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", background: "linear-gradient(135deg,#0d2e2e 0%,#1a4a4a 55%,#3d8080 100%)", borderRadius: "1.5rem", padding: "2.5rem", textAlign: "center" }}>
            <div style={{ marginBottom: "1rem" }}>
              <LockIcon sx={{ fontSize: "3rem", color: "#fff" }} />
            </div>
            <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Inicia sesión para agendar tu cita</h2>
            <button onClick={handleLogin} style={{ background: "#fff", color: "#0d2e2e", border: "none", padding: "0.8rem 2rem", borderRadius: "2rem", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>
              Iniciar sesión
            </button>
          </div>
        </section>

        <FooterCompact />
      </div>
    );
  }

  if (isAdminMode) {
    return (
      <div className="services-page">
        <Navbar
          user={user}
          activePage="servicios"
          puedeVerDashboard={showDashboard}
          onNavigation={handleNavigation}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onDashboard={handleDashboard}
          onMiPerfil={handleMiPerfil}
        />
        <section className="services-hero">
          <div className="services-container">
            <div className="hero-content">
              <h1 className="hero-title">Nuestros <span className="glowing-text">Servicios</span></h1>
              <p className="hero-description">Servicios optométricos profesionales para el cuidado integral de tu salud visual</p>
            </div>
          </div>
          <HeroAnimatedElements />
        </section>
        <div className="admin-banner">
          <AdminPanelSettingsIcon sx={{ fontSize: "1rem", marginRight: "0.5rem", verticalAlign: "middle" }} />
          <span>Modo administrador: No tienes un perfil de cliente asociado. Puedes ver los servicios, pero no agendar ni cancelar citas.</span>
        </div>
        <section className="services-section" style={{ padding: "4rem 0" }}>
          <div className="services-container">
            <div className="section-header">
              <h2 className="section-title">Servicios <span className="blue-gradient-text">Especializados</span></h2>
              <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
            </div>
            {loadingData ? (
              <LoadingSpinner mensaje="Cargando servicios..." />
            ) : serviciosCargados.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", justifyContent: "center" }}>
                {serviciosCargados.map((s) => (
                  <ServiceCard
                    key={s.id}
                    servicio={s}
                    onAgendar={null}
                    disabledMessage="Modo administrador: No tienes un perfil de cliente asociado. Para agendar citas, utiliza una cuenta de cliente."
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        <div className="admin-readonly-message">
          <p>Formulario de agendamiento deshabilitado en modo administrador.</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Para agendar citas, utiliza una cuenta de cliente.</p>
        </div>
        <FooterCompact />
      </div>
    );
  }

  if (loadingCliente) {
    return (
      <div className="services-page">
        <Navbar
          user={user}
          activePage="servicios"
          puedeVerDashboard={showDashboard}
          onNavigation={handleNavigation}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onDashboard={handleDashboard}
          onMiPerfil={handleMiPerfil}
        />
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <LoadingSpinner mensaje="Cargando tu información..." />
        </div>
        <FooterCompact />
      </div>
    );
  }

  if (errorCliente) {
    return (
      <div className="services-page">
        <Navbar
          user={user}
          activePage="servicios"
          puedeVerDashboard={showDashboard}
          onNavigation={handleNavigation}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onDashboard={handleDashboard}
          onMiPerfil={handleMiPerfil}
        />
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon"><WarningIcon sx={{ fontSize: "3.5rem", color: "#991b1b" }} /></div>
            <h2 className="error-title">Atención</h2>
            <p className="error-message">{errorCliente}</p>
            <p className="error-suggestion">Por favor, contacta al administrador o cierra sesión e intenta con otra cuenta.</p>
            <button className="error-btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <Navbar
        user={user}
        activePage="servicios"
        puedeVerDashboard={showDashboard}
        onNavigation={handleNavigation}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onDashboard={handleDashboard}
        onMiPerfil={handleMiPerfil}
      />

      <section className="services-hero">
        <div className="services-container">
          <div className="hero-content">
            <h1 className="hero-title">Nuestros <span className="glowing-text">Servicios</span></h1>
            <p className="hero-description">Servicios optométricos profesionales para el cuidado integral de tu salud visual</p>
          </div>
        </div>
        <HeroAnimatedElements />
      </section>

      <section className="services-section" style={{ padding: "4rem 0" }}>
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">Servicios <span className="blue-gradient-text">Especializados</span></h2>
            <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
          </div>
          {loadingData ? (
            <LoadingSpinner mensaje="Cargando servicios..." />
          ) : serviciosCargados.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", justifyContent: "center" }}>
              {serviciosCargados.map((s) => (
                <ServiceCard key={s.id} servicio={s} onAgendar={handleAgendar} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="appointment-section">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">Agenda tu <span className="blue-gradient-text">Cita</span></h2>
            <p className="section-description">Selecciona el servicio, la fecha y el horario que mejor se ajusten a ti.</p>
          </div>
          <div className="appointment-container">
            <div className="appointment-form-container" style={{ padding: 0, boxShadow: "none", border: "none", background: "transparent" }}>
              <CitaForm
                cliente={clienteActual}
                servicios={serviciosCargados}
                estadosCita={estadosCitaCargados}
                onCitaAgendada={handleCitaChange}
              />
            </div>
            <div>
              <MisCitas refreshKey={refreshTrigger} onCitaCancelada={handleCitaChange} />
            </div>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

const ServicesPage = ({ user, setUser }) => (
  <CartProvider user={user}>
    <ServicesPageContent user={user} setUser={setUser} />
  </CartProvider>
);

export default ServicesPage;