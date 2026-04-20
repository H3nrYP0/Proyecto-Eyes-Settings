import { useState, useEffect } from "react";
import { useNavigate }from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ServiceCard from "../components/Services/ServiceCard";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import CitaForm from "../components/Services/CitaForm";
import MisCitas from "../components/Services/MisCitas";
import { hasPermiso } from "../utils/permissions";
import {
  getServiciosActivosLanding,
  getEstadosCitaLanding,
  getMiPerfil,
} from "../components/Services/citasLandingService";
import "../../../shared/styles/features/home/ServicesPage.css";

// Material UI icons
import LockIcon from "@mui/icons-material/Lock";
import WarningIcon from "@mui/icons-material/Warning";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BuildIcon from "@mui/icons-material/Build";
import BoltIcon from "@mui/icons-material/Bolt";
import StarIcon from "@mui/icons-material/Star";
import SparklesIcon from "@mui/icons-material/AutoAwesome";

// Decodificar token JWT
const getTokenData = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const ServicesPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  const [servicios, setServicios] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [clienteActual, setClienteActual] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const [errorCliente, setErrorCliente] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Cargar servicios y estados
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

  // Cargar perfil del cliente y detectar modo administrador
  useEffect(() => {
    if (!user) {
      setClienteActual(null);
      setErrorCliente("");
      setIsAdminMode(false);
      return;
    }

    const tokenData = getTokenData();
    const userRoleId = tokenData?.rol_id;

    setLoadingCliente(true);
    setErrorCliente("");

    getMiPerfil()
      .then(cliente => {
        setClienteActual(cliente);
        setIsAdminMode(false);
      })
      .catch(err => {
        console.error("Error cargando perfil:", err);
        const msg = err.message || "No se pudo obtener tu información.";

        if (msg.includes("No tienes un perfil de cliente asociado") && (userRoleId === 2 || userRoleId === 5)) {
          setIsAdminMode(true);
          setClienteActual(null);
          setErrorCliente("");
        } else if (msg.includes("Token") || msg.includes("401")) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        } else {
          setErrorCliente(msg);
          setIsAdminMode(false);
        }
      })
      .finally(() => setLoadingCliente(false));
  }, [user, navigate, setUser]);

  useEffect(() => {
    if (clienteActual && !isAdminMode) {
      setTimeout(() => {
        document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [clienteActual, isAdminMode]);

  const handleNavigation = (path) => { navigate(path); window.scrollTo(0, 0); };
  const handleLogin = () => navigate("/login");
  const handleLogout = () => { setUser(null); navigate("/"); };
  const handleDashboard = () => navigate(user ? "/admin/dashboard" : "/login");

  const handleAgendar = () => {
    if (isAdminMode) {
      alert("Modo administrador: No puedes agendar citas. Utiliza una cuenta de cliente.");
    } else if (!clienteActual) {
      alert("Debes iniciar sesión como cliente para agendar.");
    } else {
      document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ========== RENDERIZADO CONDICIONAL ==========

  if (!user) {
    return (
      <div className="services-page">
        <Navbar user={user} activePage="servicios" puedeVerDashboard={puedeVerDashboard}
          onNavigation={handleNavigation} onLogin={handleLogin} onLogout={handleLogout} onDashboard={handleDashboard} />

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
                  <ServiceCard 
                    key={s.id} 
                    servicio={s} 
                    onAgendar={!isAdminMode && clienteActual ? handleAgendar : null}
                    disabledMessage={
                      isAdminMode 
                        ? "Modo administrador: No tienes un perfil de cliente asociado. Para agendar citas, utiliza una cuenta de cliente."
                        : !user 
                          ? "Debes iniciar sesión para agendar citas."
                          : "No puedes agendar citas en este momento."
                    }
                  />
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

  if (loadingCliente) {
    return (
      <div className="services-page">
        <Navbar user={user} activePage="servicios" puedeVerDashboard={puedeVerDashboard}
          onNavigation={handleNavigation} onLogin={handleLogin} onLogout={handleLogout} onDashboard={handleDashboard} />
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
        <Navbar user={user} activePage="servicios" puedeVerDashboard={puedeVerDashboard}
          onNavigation={handleNavigation} onLogin={handleLogin} onLogout={handleLogout} onDashboard={handleDashboard} />
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon"><WarningIcon sx={{ fontSize: "3.5rem", color: "#991b1b" }} /></div>
            <h2 className="error-title">Atención</h2>
            <p className="error-message">{errorCliente}</p>
            <p className="error-suggestion">
              Por favor, contacta al administrador o cierra sesión e intenta con otra cuenta.
            </p>
            <button className="error-btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
        <FooterCompact />
      </div>
    );
  }

  const bannerMessage = isAdminMode
    ? "Modo administrador: No tienes un perfil de cliente asociado. Puedes ver los servicios y la interfaz, pero no agendar ni cancelar citas."
    : null;

  return (
    <div className="services-page">
      <Navbar user={user} activePage="servicios" puedeVerDashboard={puedeVerDashboard}
        onNavigation={handleNavigation} onLogin={handleLogin} onLogout={handleLogout} onDashboard={handleDashboard} />

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

      {bannerMessage && (
        <div className="admin-banner">
          <AdminPanelSettingsIcon sx={{ fontSize: "1rem", marginRight: "0.5rem", verticalAlign: "middle" }} />
          <span>{bannerMessage}</span>
        </div>
      )}

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
                <ServiceCard 
                  key={s.id} 
                  servicio={s} 
                  onAgendar={!isAdminMode && clienteActual ? handleAgendar : null}
                  disabledMessage={
                    isAdminMode 
                      ? "Modo administrador: No tienes un perfil de cliente asociado. Para agendar citas, utiliza una cuenta de cliente."
                      : !user 
                        ? "Debes iniciar sesión para agendar citas."
                        : "No puedes agendar citas en este momento."
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {isAdminMode ? (
        <div className="admin-readonly-message">
          <p>Formulario de agendamiento deshabilitado en modo administrador.</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Para agendar citas, utiliza una cuenta de cliente.</p>
        </div>
      ) : (
        <CitaForm
          cliente={clienteActual}
          servicios={servicios}
          estadosCita={estadosCita}
          preServicioId=""
          onCitaAgendada={() => window.location.reload()}
        />
      )}

      {isAdminMode ? (
        <div className="admin-readonly-message">
          <p>Lista de citas no disponible en modo administrador.</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Las citas solo son visibles para cuentas de cliente.</p>
        </div>
      ) : (
        <MisCitas onCitaCancelada={() => window.location.reload()} />
      )}

      <FooterCompact />
    </div>
  );
};

export default ServicesPage;