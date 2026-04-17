import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ServiceCard from "../components/Services/ServiceCard";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import IdentityModal from "../components/Services/IdentityModal";
import CitaForm from "../components/Services/CitaForm";
import { hasPermiso } from "../utils/permissions";
import {
  getServiciosActivosLanding,
  getEstadosCitaLanding,
} from "../components/Services/citasLandingService";
import "../../../shared/styles/features/home/ServicesPage.css";

const ServicesPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  const [servicios, setServicios] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [preServicioId, setPreServicioId] = useState("");

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
      } catch (err) { console.error(err); }
      finally { if (mounted) setLoadingData(false); }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (clienteActual) {
      setTimeout(() => {
        document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [clienteActual]);

  const handleNavigation = (path) => { navigate(path); window.scrollTo(0, 0); };
  const handleLogin = () => navigate("/login");
  const handleLogout = () => { setUser(null); navigate("/"); };
  const handleDashboard = () => navigate(user ? "/admin/dashboard" : "/login");

  const handleAgendar = (servicio) => {
    setPreServicioId(String(servicio.id));
    setModalOpen(true);
  };
  const handleCTAClick = () => {
    setPreServicioId("");
    setModalOpen(true);
  };
  const handleIdentified = (cliente) => {
    setClienteActual(cliente);
    setModalOpen(false);
  };
  const handleCambiarCliente = () => {
    setClienteActual(null);
    setPreServicioId("");
    setModalOpen(true);
  };

  return (
    <div className="services-page">
      {modalOpen && <IdentityModal onIdentified={handleIdentified} onClose={() => setModalOpen(false)} />}

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
          <div className="pulse-element pulse-1">👁️</div><div className="pulse-element pulse-2">🔧</div>
          <div className="pulse-element pulse-3">⚡</div><div className="pulse-element pulse-4">🌟</div>
          <div className="pulse-element pulse-5">💫</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
              {servicios.map(s => <ServiceCard key={s.id} servicio={s} onAgendar={handleAgendar} />)}
            </div>
          )}
        </div>
      </section>

      {!clienteActual ? (
        <section style={{ padding: "3rem 2rem 4rem", background: "linear-gradient(160deg,#f3f8f8 0%,#fff 60%,#e6f2f2 100%)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", background: "linear-gradient(135deg,#0d2e2e 0%,#1a4a4a 55%,#3d8080 100%)", borderRadius: "1.5rem", padding: "2.5rem", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(13,46,46,0.25)" }}>
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flex: 1, minWidth: "260px" }}>
                <span style={{ fontSize: "2.5rem", background: "rgba(255,255,255,0.12)", borderRadius: "1rem", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.18)" }}>👁️</span>
                <div>
                  <h2 style={{ fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem" }}>¿Listo para cuidar tu visión?</h2>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.80)", margin: "0 0 0.85rem", maxWidth: "380px" }}>Agenda tu cita en minutos y recibe atención personalizada de nuestros optómetras especializados.</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {["Sin filas", "Confirmación por WhatsApp", "Atención inmediata"].map(t => <span key={t} style={{ fontSize: "0.72rem", fontWeight: 600, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "999px", padding: "0.2rem 0.65rem", color: "rgba(255,255,255,0.90)" }}>✓ {t}</span>)}
                  </div>
                </div>
              </div>
              <button onClick={handleCTAClick} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.9rem 1.75rem", background: "#fff", color: "#0d2e2e", border: "none", borderRadius: "0.875rem", fontWeight: 800, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
                <span>📅</span><span>Agendar mi cita</span><span>→</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <CitaForm cliente={clienteActual} servicios={servicios} estadosCita={estadosCita} preServicioId={preServicioId} onCambiarCliente={handleCambiarCliente} />
      )}

      <FooterCompact />
    </div>
  );
};

export default ServicesPage;