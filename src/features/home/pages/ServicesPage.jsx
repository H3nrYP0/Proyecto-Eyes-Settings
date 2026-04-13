// ServicesPage.jsx
// Flujo:
//   1. Página carga normal con hero + cards de servicios
//   2. Al final: CTA "¿Listo para cuidar tu visión?" con botón "Agendar cita"
//   3. Clic en botón → abre mini-modal de identificación (Ya soy paciente / Soy nuevo)
//   4. Identificado → modal se cierra, formulario completo aparece con scroll suave

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import ServiceCard from "../components/Services/ServiceCard";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import { hasPermiso } from "../utils/permissions";
import {
  getServiciosActivosLanding,
  getEmpleadosActivosLanding,
  getEstadosCitaLanding,
  buscarClientePorDocumento,
  crearClienteLanding,
  getHorasDisponibles,
  crearCitaLanding,
} from "../components/Services/citasLandingService";
import "../../../shared/styles/features/home/ServicesPage.css";

// ─── Constantes ───────────────────────────────────────────────────────────────
const TODOS_LOS_HORARIOS = [
  "08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00",
];
const TIPOS_DOC = ["CC","TI","CE","PA","NIT"];

const FORM_INIT = { servicio_id: "", empleado_id: "", date: "", time: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getNextDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 30 && days.length < 15; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push({
        date: d.toISOString().split("T")[0],
        formatted: d.toLocaleDateString("es-ES", {
          weekday: "short", day: "numeric", month: "short",
        }),
      });
    }
  }
  return days;
};
const nextDays = getNextDays();

const formatTimeLabel = (t) => {
  const h = parseInt(t.split(":")[0], 10);
  return h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`;
};

const fmtCOP = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", minimumFractionDigits: 0,
  }).format(v);


// ═══════════════════════════════════════════════════════════════════════════════
// MINI-MODAL DE IDENTIFICACIÓN
// ═══════════════════════════════════════════════════════════════════════════════
const IdentityModal = ({ onIdentified, onClose }) => {
  const [step, setStep]       = useState("choose"); // "choose" | "existing" | "new"
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [doc, setDoc]         = useState("");
  const [reg, setReg]         = useState({
    nombre: "", apellido: "", tipo_documento: "CC",
    numero_documento: "", fecha_nacimiento: "", telefono: "", correo: "",
  });

  const handleReg = (e) => setReg((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleBuscar = async () => {
    if (!doc.trim()) { setError("Ingresa tu número de documento."); return; }
    setLoading(true); setError("");
    try {
      const cliente = await buscarClientePorDocumento(doc.trim());
      if (cliente) { onIdentified(cliente); }
      else { setError("No encontramos tu documento. ¿Eres nuevo paciente?"); }
    } catch { setError("Error de red. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  const handleRegistrar = async () => {
    const { nombre, apellido, numero_documento, fecha_nacimiento } = reg;
    if (!nombre.trim() || !apellido.trim() || !numero_documento.trim() || !fecha_nacimiento) {
      setError("Nombre, apellido, documento y fecha de nacimiento son obligatorios.");
      return;
    }
    setLoading(true); setError("");
    try {
      const result = await crearClienteLanding(reg);
      onIdentified(result.cliente || result);
    } catch (err) { setError(err.message || "Error al registrarse."); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>

        {/* Close */}
        <button style={S.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={S.eyeOrb}>👁️</div>
          <h2 style={S.modalTitle}>Identifícate para continuar</h2>
          <p style={S.modalSub}>Solo toma unos segundos</p>
        </div>

        {/* ── Elegir ────────────────────────────────────────────────── */}
        {step === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <button
              style={S.bigBtn("#0d2e2e", "#fff")}
              onClick={() => { setStep("existing"); setError(""); }}
            >
              <span style={{ fontSize: "1.5rem" }}>🪪</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, fontSize: "0.97rem" }}>Ya soy paciente</div>
                <div style={{ fontSize: "0.76rem", opacity: 0.75, marginTop: "2px" }}>
                  Tengo historial en Visual Outlet
                </div>
              </div>
            </button>

            <button
              style={S.bigBtn("#f3f8f8", "#0d2e2e", "#d4e6e6")}
              onClick={() => { setStep("new"); setError(""); }}
            >
              <span style={{ fontSize: "1.5rem" }}>✨</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, fontSize: "0.97rem" }}>Soy nuevo paciente</div>
                <div style={{ fontSize: "0.76rem", opacity: 0.65, marginTop: "2px" }}>
                  Primera vez en la óptica
                </div>
              </div>
            </button>

            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#8aaeae", marginTop: "0.25rem" }}>
              Tus datos están protegidos y solo se usan para agendar tu cita.
            </p>
          </div>
        )}

        {/* ── Paciente existente ────────────────────────────────────── */}
        {step === "existing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <button onClick={() => { setStep("choose"); setError(""); }} style={S.backBtn}>← Volver</button>
            <label style={S.lbl}>Número de documento</label>
            <input
              style={S.inp}
              placeholder="Ej: 1234567890"
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              autoFocus
            />
            {error && <div style={S.err}>{error}</div>}
            <button style={S.submitBtn} onClick={handleBuscar} disabled={loading}>
              {loading ? "Buscando…" : "Continuar →"}
            </button>
          </div>
        )}

        {/* ── Nuevo paciente ────────────────────────────────────────── */}
        {step === "new" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            <button onClick={() => { setStep("choose"); setError(""); }} style={S.backBtn}>← Volver</button>

            <div style={S.row2}>
              <div style={S.col}>
                <label style={S.lbl}>Nombre *</label>
                <input style={S.inp} name="nombre" value={reg.nombre} onChange={handleReg} placeholder="Tu nombre" />
              </div>
              <div style={S.col}>
                <label style={S.lbl}>Apellido *</label>
                <input style={S.inp} name="apellido" value={reg.apellido} onChange={handleReg} placeholder="Tu apellido" />
              </div>
            </div>

            <div style={S.row2}>
              <div style={S.col}>
                <label style={S.lbl}>Tipo doc.</label>
                <select style={S.inp} name="tipo_documento" value={reg.tipo_documento} onChange={handleReg}>
                  {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={S.col}>
                <label style={S.lbl}>Número doc. *</label>
                <input style={S.inp} name="numero_documento" value={reg.numero_documento} onChange={handleReg} placeholder="1234567890" />
              </div>
            </div>

            <div style={S.col}>
              <label style={S.lbl}>Fecha de nacimiento *</label>
              <input
                style={S.inp} type="date" name="fecha_nacimiento"
                value={reg.fecha_nacimiento} onChange={handleReg}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div style={S.row2}>
              <div style={S.col}>
                <label style={S.lbl}>Teléfono / WhatsApp</label>
                <input style={S.inp} name="telefono" value={reg.telefono} onChange={handleReg} placeholder="3006139449" />
              </div>
              <div style={S.col}>
                <label style={S.lbl}>Correo</label>
                <input style={S.inp} type="email" name="correo" value={reg.correo} onChange={handleReg} placeholder="tu@correo.com" />
              </div>
            </div>

            {error && <div style={S.err}>{error}</div>}
            <button style={S.submitBtn} onClick={handleRegistrar} disabled={loading}>
              {loading ? "Registrando…" : "Registrarme y continuar →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// CTA — sección "¿Listo para cuidar tu visión?"
// ═══════════════════════════════════════════════════════════════════════════════
const CitaCTA = ({ onAgendar }) => (
  <section style={S.ctaSection}>
    <div style={S.ctaCard}>
      {/* Decoración de fondo */}
      <div style={S.ctaDeco1} />
      <div style={S.ctaDeco2} />

      <div style={S.ctaContent}>
        <div style={S.ctaLeft}>
          <span style={S.ctaEye}>👁️</span>
          <div>
            <h2 style={S.ctaTitle}>¿Listo para cuidar tu visión?</h2>
            <p style={S.ctaDesc}>
              Agenda tu cita en minutos y recibe atención personalizada
              de nuestros optómetras especializados.
            </p>
            <div style={S.ctaTags}>
              {["Sin filas", "Confirmación por WhatsApp", "Atención inmediata"].map((t) => (
                <span key={t} style={S.ctaTag}>✓ {t}</span>
              ))}
            </div>
          </div>
        </div>

        <button style={S.ctaBtn} onClick={onAgendar}>
          <span style={{ fontSize: "1.2rem" }}>📅</span>
          <span>Agendar mi cita</span>
          <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>→</span>
        </button>
      </div>
    </div>
  </section>
);


// ═══════════════════════════════════════════════════════════════════════════════
// FORMULARIO DE CITA (aparece tras identificarse)
// ═══════════════════════════════════════════════════════════════════════════════
const CitaForm = ({ cliente, servicios, empleados, estadosCita, preServicioId, onCambiarPaciente }) => {
  const [form, setForm]           = useState({ ...FORM_INIT, servicio_id: preServicioId || "" });
  const [horasDisp, setHorasDisp] = useState(new Set());
  const [loadingH, setLoadingH]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]       = useState(null);
  const loadRef = useRef(false);

  // Recalcula horas cuando cambia empleado / fecha / servicio
  useEffect(() => {
    const { empleado_id, date, servicio_id } = form;
    if (!empleado_id || !date || !servicio_id) { setHorasDisp(new Set()); return; }
    if (loadRef.current) return;

    setLoadingH(true);
    setForm((p) => ({ ...p, time: "" }));
    loadRef.current = true;

    getHorasDisponibles(
      parseInt(empleado_id), date, parseInt(servicio_id), TODOS_LOS_HORARIOS
    ).then((d) => {
      setHorasDisp(d);
      setLoadingH(false);
      loadRef.current = false;
    });
  }, [form.empleado_id, form.date, form.servicio_id]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setResult(null);
  };

  const getEstadoPendienteId = () => {
    const ep = estadosCita.find((e) => e.nombre?.toLowerCase().includes("pendiente"));
    return ep ? ep.id : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.servicio_id || !form.empleado_id || !form.date || !form.time) {
      setResult({ ok: false, msg: "Completa servicio, optómetra, fecha y hora." });
      return;
    }
    setSubmitting(true);
    try {
      await crearCitaLanding({
        clienteId: cliente.id,
        servicioId: parseInt(form.servicio_id),
        empleadoId: parseInt(form.empleado_id),
        estadoCitaId: getEstadoPendienteId(),
        fecha: form.date,
        hora: form.time,
      });
      const svcNombre = servicios.find((s) => String(s.id) === form.servicio_id)?.nombre || "";
      setResult({
        ok: true,
        msg: `¡Cita agendada, ${cliente.nombre}! Te esperamos el ${form.date} a las ${formatTimeLabel(form.time)}${svcNombre ? ` · ${svcNombre}` : ""}. Te confirmaremos por WhatsApp.`,
      });
      setForm(FORM_INIT);
      setHorasDisp(new Set());
    } catch (err) {
      setResult({ ok: false, msg: err.message || "Error al agendar. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="appointment-form" className="appointment-section">
      <div className="services-container">
        <div className="section-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-title">
            <span className="blue-gradient-text">Agenda tu Cita</span>
          </h2>

          {/* Badge paciente */}
          <div style={S.patientBadge}>
            <span>👤</span>
            <span>Agendando como <strong>{cliente.nombre} {cliente.apellido}</strong></span>
            <button style={S.changeBtn} onClick={onCambiarPaciente}>Cambiar</button>
          </div>

          <p className="section-description">
            Selecciona servicio, optómetra, fecha y horario disponible.
          </p>
        </div>

        <div className="appointment-container">
          {/* ── Formulario ──────────────────────────────────────────── */}
          <div className="appointment-form-container">
            <form className="appointment-form" onSubmit={handleSubmit}>

              {/* Servicio + Optómetra */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="servicio_id">Servicio *</label>
                  <select id="servicio_id" name="servicio_id" value={form.servicio_id} onChange={handleChange} required>
                    <option value="">Selecciona un servicio</option>
                    {servicios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} — {fmtCOP(s.precio)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="empleado_id">Optómetra *</label>
                  <select id="empleado_id" name="empleado_id" value={form.empleado_id} onChange={handleChange} required>
                    <option value="">Selecciona un optómetra</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre} — {e.cargo}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calendario */}
              <div className="calendar-section">
                <h3>Selecciona una fecha *</h3>
                <div className="calendar-grid">
                  {nextDays.map((day, i) => (
                    <button
                      key={i} type="button"
                      className={`calendar-day ${form.date === day.date ? "selected" : ""}`}
                      onClick={() => { setForm((p) => ({ ...p, date: day.date, time: "" })); setResult(null); }}
                    >
                      <span className="day-week">{day.formatted.split(" ")[0]}</span>
                      <span className="day-date">{day.formatted.split(" ")[1]}</span>
                      <span className="day-month">{day.formatted.split(" ")[2]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div className="time-section">
                <h3>
                  Horarios disponibles *
                  {loadingH && (
                    <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#4e6e6e", marginLeft: "0.6rem" }}>
                      Consultando…
                    </span>
                  )}
                </h3>

                {!form.empleado_id || !form.date || !form.servicio_id ? (
                  <p style={S.hint}>Selecciona servicio, optómetra y fecha para ver horarios.</p>
                ) : loadingH ? (
                  <div style={S.skeletonGrid}>
                    {TODOS_LOS_HORARIOS.map((_, i) => <div key={i} style={S.skeletonSlot} />)}
                  </div>
                ) : horasDisp.size === 0 ? (
                  <div style={S.noSlots}>
                    😔 Sin horarios disponibles este día con el optómetra elegido. Prueba otra fecha u otro optómetra.
                  </div>
                ) : (
                  <div className="time-grid">
                    {TODOS_LOS_HORARIOS.filter((t) => horasDisp.has(t)).map((time, i) => (
                      <button
                        key={i} type="button"
                        className={`time-slot ${form.time === time ? "selected" : ""}`}
                        onClick={() => { setForm((p) => ({ ...p, time })); setResult(null); }}
                      >
                        {formatTimeLabel(time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Resultado */}
              {result && (
                <div style={S.resultBox(result.ok)}>{result.msg}</div>
              )}

              <button
                type="submit"
                className="submit-appointment-btn"
                disabled={submitting}
                style={submitting ? { opacity: 0.65, cursor: "not-allowed" } : {}}
              >
                {submitting ? "Agendando…" : <><span className="btn-icon">✅</span> Confirmar Cita</>}
              </button>
            </form>
          </div>

          {/* ── Panel lateral ──────────────────────────────────────── */}
          <div className="appointment-info">
            <div className="info-card">
              <h3>📅 Información de la Cita</h3>
              <div className="info-list">
                {[
                  { icon: "⏰", title: "Horarios de Atención", lines: ["Lun–Vie: 8:00 AM – 6:00 PM", "Sábados: 9:00 AM – 2:00 PM"] },
                  { icon: "📍", title: "Ubicación", lines: ["Cra 45 # 50-48 Local 102", "El Palo con la Playa, Medellín"] },
                  { icon: "📞", title: "Contacto", lines: ["300 613 9449 (WhatsApp)", "(+57) 604 579 9276 (Fijo)"] },
                  { icon: "✅", title: "Confirmación", lines: ["Recibirás confirmación por WhatsApp en menos de 24 horas"] },
                ].map(({ icon, title, lines }) => (
                  <div key={title} className="info-item">
                    <span className="info-icon">{icon}</span>
                    <div className="info-text">
                      <strong>{title}</strong>
                      {lines.map((l) => <p key={l}>{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
const ServicesPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const puedeVerDashboard = hasPermiso(user, "dashboard");
  const formRef = useRef(null);

  // ── Estado global ──────────────────────────────────────────────────────────
  const [servicios,    setServicios]    = useState([]);
  const [empleados,    setEmpleados]    = useState([]);
  const [estadosCita,  setEstadosCita]  = useState([]);
  const [loadingData,  setLoadingData]  = useState(true);

  const [modalOpen,    setModalOpen]    = useState(false);  // modal identidad
  const [clienteActual, setClienteActual] = useState(null); // null = sin identificar
  const [preServicioId, setPreServicioId] = useState("");   // pre-selección desde card

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [svcs, emps, estados] = await Promise.all([
          getServiciosActivosLanding(),
          getEmpleadosActivosLanding(),
          getEstadosCitaLanding(),
        ]);
        if (!mounted) return;
        setServicios(svcs);
        setEmpleados(emps);
        setEstadosCita(estados);
      } catch (err) { console.error("Error cargando datos:", err); }
      finally { if (mounted) setLoadingData(false); }
    })();
    return () => { mounted = false; };
  }, []);

  // ── Scroll al formulario cuando aparece ───────────────────────────────────
  useEffect(() => {
    if (clienteActual) {
      setTimeout(() => {
        document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [clienteActual]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNavigation = (path) => { navigate(path); window.scrollTo(0, 0); };
  const handleLogin      = () => navigate("/login");
  const handleLogout     = () => { setUser(null); navigate("/"); };
  const handleDashboard  = () => navigate(user ? "/admin/dashboard" : "/login");

  // Desde ServiceCard → guardar pre-selección y abrir modal
  const handleAgendar = (servicio) => {
    setPreServicioId(String(servicio.id));
    setModalOpen(true);
  };

  // Desde CTA → abrir modal sin pre-selección
  const handleCTAClick = () => {
    setPreServicioId("");
    setModalOpen(true);
  };

  // Modal → identificado
  const handleIdentified = (cliente) => {
    setClienteActual(cliente);
    setModalOpen(false);
  };

  // Cambiar paciente → resetear todo y abrir modal
  const handleCambiarPaciente = () => {
    setClienteActual(null);
    setPreServicioId("");
    setModalOpen(true);
  };

  return (
    <div className="services-page">

      {/* Modal de identificación — solo cuando está abierto */}
      {modalOpen && (
        <IdentityModal
          onIdentified={handleIdentified}
          onClose={() => setModalOpen(false)}
        />
      )}

      <Navbar
        user={user}
        activePage="servicios"
        puedeVerDashboard={puedeVerDashboard}
        onNavigation={handleNavigation}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onDashboard={handleDashboard}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="services-hero">
        <div className="services-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Nuestros <span className="glowing-text">Servicios</span>
            </h1>
            <p className="hero-description">
              Servicios optométricos profesionales para el cuidado integral de tu salud visual
            </p>
          </div>
        </div>
        <div className="hero-animated-elements">
          <div className="pulse-element pulse-1">👁️</div>
          <div className="pulse-element pulse-2">🔧</div>
          <div className="pulse-element pulse-3">⚡</div>
          <div className="pulse-element pulse-4">🌟</div>
          <div className="pulse-element pulse-5">💫</div>
        </div>
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }} />
          ))}
        </div>
      </section>

      {/* ── Cards de servicios ───────────────────────────────────────────── */}
      <section className="services-section" style={{ padding: "4rem 0" }}>
        <div className="services-container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title">
              Servicios <span className="blue-gradient-text">Especializados</span>
            </h2>
            <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
          </div>

          {loadingData ? (
            <LoadingSpinner mensaje="Cargando servicios..." />
          ) : servicios.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b" }}>No hay servicios disponibles en este momento.</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              maxWidth: "900px",
              margin: "0 auto",
            }}>
              {servicios.map((s) => (
                <ServiceCard key={s.id} servicio={s} onAgendar={handleAgendar} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA o Formulario ──────────────────────────────────────────────── */}
      {!clienteActual ? (
        <CitaCTA onAgendar={handleCTAClick} />
      ) : (
        <CitaForm
          cliente={clienteActual}
          servicios={servicios}
          empleados={empleados}
          estadosCita={estadosCita}
          preServicioId={preServicioId}
          onCambiarPaciente={handleCambiarPaciente}
        />
      )}

      <FooterCompact />
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════════════════════
const S = {
  // ── Modal ────────────────────────────────────────────────────────────────
  overlay: {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(10,30,30,0.75)",
    backdropFilter: "blur(7px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "1rem",
  },
  modalBox: {
    background: "#fff",
    borderRadius: "1.35rem",
    padding: "2rem 2rem 1.75rem",
    width: "100%", maxWidth: "440px",
    boxShadow: "0 28px 70px rgba(13,46,46,0.3)",
    maxHeight: "92vh", overflowY: "auto",
    position: "relative",
    animation: "fadeSlideUp 0.26s cubic-bezier(0.34,1.56,0.64,1)",
  },
  closeBtn: {
    position: "absolute", top: "1rem", right: "1rem",
    background: "#f3f8f8", border: "none", borderRadius: "50%",
    width: "32px", height: "32px", cursor: "pointer",
    fontSize: "0.85rem", color: "#4e6e6e",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
  },
  eyeOrb: {
    width: "56px", height: "56px",
    background: "linear-gradient(135deg,#0d2e2e,#3d8080)",
    borderRadius: "50%", fontSize: "1.6rem",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 0.75rem",
    boxShadow: "0 8px 20px rgba(13,46,46,0.25)",
  },
  modalTitle: { fontSize: "1.35rem", fontWeight: 800, color: "#0d2e2e", margin: "0 0 0.2rem" },
  modalSub:   { color: "#4e6e6e", fontSize: "0.84rem", margin: 0 },

  bigBtn: (bg, color, border) => ({
    display: "flex", alignItems: "center", gap: "1rem",
    padding: "0.95rem 1.1rem",
    background: bg, color,
    border: `2px solid ${border || bg}`,
    borderRadius: "0.875rem",
    cursor: "pointer", fontFamily: "inherit",
    transition: "transform 0.14s, box-shadow 0.14s",
    boxShadow: "0 2px 10px rgba(13,46,46,0.08)",
  }),

  backBtn: {
    background: "none", border: "none", color: "#4e6e6e",
    fontSize: "0.8rem", cursor: "pointer", padding: 0,
    fontFamily: "inherit", marginBottom: "0.15rem",
  },
  lbl: { fontSize: "0.77rem", fontWeight: 700, color: "#1a4a4a", marginBottom: "0.2rem", display: "block" },
  inp: {
    width: "100%", padding: "0.55rem 0.85rem",
    border: "1.5px solid #d4e6e6", borderRadius: "0.55rem",
    fontSize: "0.85rem", fontFamily: "inherit",
    outline: "none", background: "#f9fdfd", boxSizing: "border-box",
  },
  submitBtn: {
    padding: "0.75rem", width: "100%",
    background: "linear-gradient(135deg,#1a4a4a,#3d8080)",
    color: "#fff", border: "none", borderRadius: "0.75rem",
    fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
    fontFamily: "inherit", marginTop: "0.2rem",
  },
  err: {
    color: "#991b1b", background: "#fee2e2",
    border: "1px solid #fca5a5", borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem", fontSize: "0.79rem",
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" },
  col:  { display: "flex", flexDirection: "column" },

  // ── CTA ──────────────────────────────────────────────────────────────────
  ctaSection: {
    padding: "3rem 2rem 4rem",
    background: "linear-gradient(160deg,#f3f8f8 0%,#fff 60%,#e6f2f2 100%)",
  },
  ctaCard: {
    maxWidth: "900px", margin: "0 auto",
    background: "linear-gradient(135deg,#0d2e2e 0%,#1a4a4a 55%,#3d8080 100%)",
    borderRadius: "1.5rem",
    padding: "2.5rem 2.5rem",
    position: "relative", overflow: "hidden",
    boxShadow: "0 20px 50px rgba(13,46,46,0.25)",
  },
  ctaDeco1: {
    position: "absolute", top: "-40px", right: "-40px",
    width: "200px", height: "200px",
    borderRadius: "50%",
    background: "rgba(106,174,174,0.15)",
    pointerEvents: "none",
  },
  ctaDeco2: {
    position: "absolute", bottom: "-60px", left: "30%",
    width: "280px", height: "280px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    pointerEvents: "none",
  },
  ctaContent: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    gap: "2rem", flexWrap: "wrap",
  },
  ctaLeft: { display: "flex", alignItems: "flex-start", gap: "1.25rem", flex: 1, minWidth: "260px" },
  ctaEye: {
    fontSize: "2.5rem", flexShrink: 0,
    background: "rgba(255,255,255,0.12)",
    borderRadius: "1rem", padding: "0.6rem",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  ctaTitle: {
    fontSize: "clamp(1.2rem,3vw,1.6rem)",
    fontWeight: 800, color: "#fff",
    margin: "0 0 0.5rem", lineHeight: 1.2,
  },
  ctaDesc: {
    fontSize: "0.88rem", color: "rgba(255,255,255,0.80)",
    margin: "0 0 0.85rem", lineHeight: 1.55, maxWidth: "380px",
  },
  ctaTags: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  ctaTag: {
    fontSize: "0.72rem", fontWeight: 600,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "999px", padding: "0.2rem 0.65rem",
    color: "rgba(255,255,255,0.90)",
  },
  ctaBtn: {
    display: "flex", alignItems: "center", gap: "0.6rem",
    padding: "0.9rem 1.75rem",
    background: "#fff", color: "#0d2e2e",
    border: "none", borderRadius: "0.875rem",
    fontWeight: 800, fontSize: "1rem", cursor: "pointer",
    fontFamily: "inherit", flexShrink: 0,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    transition: "transform 0.18s, box-shadow 0.18s",
    whiteSpace: "nowrap",
  },

  // ── Formulario ────────────────────────────────────────────────────────────
  patientBadge: {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    background: "#f0faf5", border: "1.5px solid #86efac",
    borderRadius: "999px", padding: "0.35rem 1rem",
    fontSize: "0.81rem", color: "#166534",
    margin: "0.6rem auto 0.9rem", fontWeight: 500,
  },
  changeBtn: {
    background: "none", border: "none", color: "#1a4a4a",
    fontSize: "0.73rem", cursor: "pointer",
    fontWeight: 700, textDecoration: "underline",
    padding: 0, fontFamily: "inherit", marginLeft: "0.2rem",
  },
  hint: {
    textAlign: "center", color: "#4e6e6e",
    fontSize: "0.81rem", padding: "1rem 0", fontStyle: "italic",
  },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.3rem" },
  skeletonSlot: {
    height: "38px", borderRadius: "0.5rem",
    background: "linear-gradient(90deg,#e8f4f4 25%,#d4e6e6 50%,#e8f4f4 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.2s infinite",
  },
  noSlots: {
    textAlign: "center", padding: "1.25rem",
    background: "#f9fdfd", border: "1px solid #d4e6e6",
    borderRadius: "0.75rem", color: "#4e6e6e",
    fontSize: "0.84rem", lineHeight: 1.6,
  },
  resultBox: (ok) => ({
    padding: "0.75rem 1rem", borderRadius: "0.65rem",
    fontSize: "0.84rem", fontWeight: 600, lineHeight: 1.5,
    textAlign: "center",
    background: ok ? "#dcfce7" : "#fee2e2",
    color: ok ? "#166534" : "#991b1b",
    border: `1px solid ${ok ? "#86efac" : "#fca5a5"}`,
  }),
};

export default ServicesPage;