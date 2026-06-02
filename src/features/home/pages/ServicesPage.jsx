import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Material UI icons
import LockIcon from "@mui/icons-material/Lock";
import WarningIcon from "@mui/icons-material/Warning";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BuildIcon from "@mui/icons-material/Build";
import BoltIcon from "@mui/icons-material/Bolt";
import StarIcon from "@mui/icons-material/Star";
import SparklesIcon from "@mui/icons-material/AutoAwesome";

// Carrito
import ShoppingCart, { CartProvider, WishlistDrawer } from "../../home/components/Products/ShoppingCart";

// Componente interno
const ServicesPageContent = ({ user, setUser }) => {
  const navigate = useNavigate();
  const showDashboard = user ? authServices.hasAdminAccess(user) : false;

  const [servicios, setServicios] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [clienteActual, setClienteActual] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const [errorCliente, setErrorCliente] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCitasModal, setShowCitasModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [svcs, estados] = await Promise.all([
          getServiciosActivosLanding(),
          getEstadosCitaLanding(),
        ]);
        if (!mounted) return;
        setServicios(svcs);
        setEstadosCita(estados);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingData(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ============================================================
  // NUEVA LÓGICA: Siempre intenta cargar el perfil de cliente
  // Si el endpoint devuelve "No tienes un perfil de cliente asociado"
  // entonces entra en modo administrador.
  // ============================================================
  useEffect(() => {
    if (!user) {
      setClienteActual(null);
      setErrorCliente("");
      setIsAdminMode(false);
      setLoadingCliente(false);
      return;
    }

    const loadClientePerfil = async () => {
      setLoadingCliente(true);
      setErrorCliente("");
      try {
        const cliente = await getMiPerfil();  // GET /cliente/perfil
        setClienteActual(cliente);
        setIsAdminMode(false);  // Tiene cliente → modo normal
      } catch (err) {
        console.error("Error cargando perfil de cliente:", err);
        const msg = err.message || "No se pudo obtener tu información.";
        // Si el error es exactamente el esperado (sin cliente asociado)
        if (msg.includes("No tienes un perfil de cliente asociado")) {
          setIsAdminMode(true);
          setClienteActual(null);
          setErrorCliente("");
        } else {
          // Otro error (red, servidor, etc.)
          setErrorCliente(msg);
          setIsAdminMode(false);
        }
      } finally {
        setLoadingCliente(false);
      }
    };

    loadClientePerfil();
  }, [user]);

  // Efecto para hacer scroll automático (solo si es cliente y no admin)
  useEffect(() => {
    if (clienteActual && !isAdminMode) {
      setTimeout(() => {
        document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [clienteActual, isAdminMode]);

  const handleNavigation = (path) => { navigate(path); window.scrollTo(0, 0); };
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

  const handleCitaChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // ========== RENDERIZADO ==========

  // Usuario no autenticado
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
          <div className="hero-animated-elements">
            <div className="pulse-element pulse-1"><VisibilityIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-2"><BuildIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-3"><BoltIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-4"><StarIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-5"><SparklesIcon sx={{ fontSize: "1.8rem" }} /></div>
          </div>
          <div className="floating-particles">
            {[...Array(15)].map((_, i) => <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}
          </div>
        </section>

        <section className="services-section" style={{ padding: "4rem 0" }}>
          <div className="services-container">
            <div className="section-header">
              <h2 className="section-title">Servicios <span className="blue-gradient-text">Especializados</span></h2>
              <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
            </div>
            {loadingData ? <LoadingSpinner mensaje="Cargando servicios..." /> : servicios.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", justifyContent: "center" }}>
                {servicios.map(s => (
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

  // ============================================================
  // CASO ADMINISTRADOR (sin perfil de cliente)
  // ============================================================
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
          <div className="hero-animated-elements">
            <div className="pulse-element pulse-1"><VisibilityIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-2"><BuildIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-3"><BoltIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-4"><StarIcon sx={{ fontSize: "1.8rem" }} /></div>
            <div className="pulse-element pulse-5"><SparklesIcon sx={{ fontSize: "1.8rem" }} /></div>
          </div>
          <div className="floating-particles">
            {[...Array(15)].map((_, i) => <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}
          </div>
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
            {loadingData ? <LoadingSpinner mensaje="Cargando servicios..." /> : servicios.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", justifyContent: "center" }}>
                {servicios.map(s => (
                  <ServiceCard key={s.id} servicio={s} onAgendar={null} disabledMessage="Modo administrador: No tienes un perfil de cliente asociado. Para agendar citas, utiliza una cuenta de cliente." />
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

  // Cargando perfil
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

  // Error en el perfil (problema de red, servidor, etc.)
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
        <FooterCompact />
      </div>
    );
  }

  // Cliente autenticado y con perfil cargado (modo normal)
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
        <div className="hero-animated-elements">
          <div className="pulse-element pulse-1"><VisibilityIcon sx={{ fontSize: "1.8rem" }} /></div>
          <div className="pulse-element pulse-2"><BuildIcon sx={{ fontSize: "1.8rem" }} /></div>
          <div className="pulse-element pulse-3"><BoltIcon sx={{ fontSize: "1.8rem" }} /></div>
          <div className="pulse-element pulse-4"><StarIcon sx={{ fontSize: "1.8rem" }} /></div>
          <div className="pulse-element pulse-5"><SparklesIcon sx={{ fontSize: "1.8rem" }} /></div>
        </div>
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 10}s` }} />)}
        </div>
      </section>

      <section className="services-section" style={{ padding: "4rem 0" }}>
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">Servicios <span className="blue-gradient-text">Especializados</span></h2>
            <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
          </div>
          {loadingData ? <LoadingSpinner mensaje="Cargando servicios..." /> : servicios.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto", justifyContent: "center" }}>
              {servicios.map(s => (
                <ServiceCard key={s.id} servicio={s} onAgendar={handleAgendar} disabledMessage={null} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end", maxWidth: "1200px", margin: "0 auto 0.5rem auto" }}>
        <button
          onClick={() => setShowCitasModal(true)}
          className="ver-citas-btn"
          style={{
            background: "#0d2e2e",
            color: "white",
            border: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem",
            transition: "transform 0.2s",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <EventIcon sx={{ fontSize: "1.2rem" }} />
          Ver mis citas
        </button>
      </div>

      <CitaForm
        cliente={clienteActual}
        servicios={servicios}
        estadosCita={estadosCita}
        preServicioId=""
        onCitaAgendada={handleCitaChange}
      />

      <FooterCompact />

      {showCitasModal && (
        <div className="success-modal-overlay" onClick={() => setShowCitasModal(false)}>
          <div
            className="success-modal-card"
            style={{
              maxWidth: "800px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "1.5rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Mis citas</h2>
              <button onClick={() => setShowCitasModal(false)} style={{ background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "#4e6e6e" }} aria-label="Cerrar">×</button>
            </div>
            <MisCitas onCitaCancelada={handleCitaChange} refreshKey={refreshTrigger} />
          </div>
        </div>
      )}
    </div>
  );
};

const ServicesPage = ({ user, setUser }) => (
  <CartProvider user={user}>
    <ServicesPageContent user={user} setUser={setUser} />
    <ShoppingCart user={user} />
    <WishlistDrawer user={user} />
  </CartProvider>
);

export default ServicesPage;
