import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ServiceCard from "../components/Services/ServiceCard";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import CitaForm from "../components/Services/CitaForm";
import MisCitas from "../components/Services/MisCitas";   // ← Importamos el nuevo componente
import { hasPermiso } from "../utils/permissions";
import {
  getServiciosActivosLanding,
  getEstadosCitaLanding,
  getMiPerfil,
} from "../components/Services/citasLandingService";
import "../../../shared/styles/features/home/ServicesPage.css";

const ServicesPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  const [servicios, setServicios] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [clienteActual, setClienteActual] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const [errorCliente, setErrorCliente] = useState("");

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

  // Cargar perfil del cliente si el usuario está logueado
  useEffect(() => {
    if (!user) {
      setClienteActual(null);
      setErrorCliente("");
      return;
    }
    setLoadingCliente(true);
    setErrorCliente("");
    getMiPerfil()
      .then(cliente => {
        setClienteActual(cliente);
      })
      .catch(err => {
        console.error("Error cargando perfil:", err);
        setErrorCliente(err.message || "No se pudo obtener tu información.");
        if (err.message.includes("Token") || err.message.includes("401")) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        }
      })
      .finally(() => setLoadingCliente(false));
  }, [user, navigate, setUser]);

  // Scroll al formulario cuando se carga el cliente
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

  // ========== RENDERIZADO CONDICIONAL ==========

  // Caso 1: Usuario NO logueado → mostrar CTA de login
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
                {servicios.map(s => <ServiceCard key={s.id} servicio={s} onAgendar={() => handleLogin()} />)}
              </div>
            )}
          </div>
        </section>

        {/* CTA para usuarios no logueados */}
        <section style={{ padding: "3rem 2rem 4rem", background: "linear-gradient(160deg,#f3f8f8 0%,#fff 60%,#e6f2f2 100%)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", background: "linear-gradient(135deg,#0d2e2e 0%,#1a4a4a 55%,#3d8080 100%)", borderRadius: "1.5rem", padding: "2.5rem", textAlign: "center" }}>
            <h2 style={{ color: "#fff", marginBottom: "1rem" }}>🔐 Inicia sesión para agendar tu cita</h2>
            <button onClick={handleLogin} style={{ background: "#fff", color: "#0d2e2e", border: "none", padding: "0.8rem 2rem", borderRadius: "2rem", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>
              Iniciar sesión
            </button>
          </div>
        </section>

        <FooterCompact />
      </div>
    );
  }

  // Caso 2: Usuario logueado pero aún cargando perfil
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

  // Caso 3: Error al cargar perfil
  if (errorCliente) {
    return (
      <div className="services-page">
        <Navbar user={user} activePage="servicios" puedeVerDashboard={puedeVerDashboard}
          onNavigation={handleNavigation} onLogin={handleLogin} onLogout={handleLogout} onDashboard={handleDashboard} />
        <div style={{ textAlign: "center", padding: "4rem", color: "#991b1b" }}>
          <p>❌ {errorCliente}</p>
          <button onClick={handleLogout} style={{ marginTop: "1rem", background: "#0d2e2e", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }}>
            Cerrar sesión e intentar de nuevo
          </button>
        </div>
        <FooterCompact />
      </div>
    );
  }

  // Caso 4: Usuario logueado y cliente cargado → mostrar formulario de cita + lista de citas
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
              {servicios.map(s => <ServiceCard key={s.id} servicio={s} onAgendar={() => {}} />)}
            </div>
          )}
        </div>
      </section>

      {/* Formulario para agendar nueva cita */}
      <CitaForm
        cliente={clienteActual}
        servicios={servicios}
        estadosCita={estadosCita}
        preServicioId={""}
        onCitaAgendada={() => {
          // Recargar la página para actualizar la lista de citas
          window.location.reload();
        }}
      />

      {/* Listado de citas del cliente */}
      <MisCitas 
        onCitaCancelada={() => {
          // También recargar después de cancelar
          window.location.reload();
        }} 
      />

      <FooterCompact />
    </div>
  );
};

export default ServicesPage;