// =============================================================
// ServicesPage.jsx
// RESPONSABILIDAD: Página de servicios.
//   - Usa el Navbar compartido con activePage="servicios"
//   - Maneja su propio estado de UI (activeCards, appointmentData)
//   - Calcula permisos con hasPermiso desde el archivo central
// =============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import { hasPermiso } from "../utils/permissions";
import "../../../shared/styles/features/home/ServicesPage.css";

const ServicesPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [activeCards, setActiveCards] = useState({ consulta: false, campanas: false });
  const [appointmentData, setAppointmentData] = useState({
    name: "", email: "", phone: "", service: "", date: "", time: "", notes: ""
  });

  // --- Permisos ---
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  // --- Handlers ---
  const handleNavigation = (path) => { 
    navigate(path); 
    window.scrollTo(0, 0); 
  };
  const handleLogin = () => navigate("/login");
  const handleLogout = () => { 
    setUser(null); 
    navigate("/"); 
  };
  const handleDashboard = () => navigate(user ? "/admin/dashboard" : "/login");

  const handleCardMouseEnter = (id) => setActiveCards((prev) => ({ ...prev, [id]: true }));
  const handleCardMouseLeave = (id) => setActiveCards((prev) => ({ ...prev, [id]: false }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    alert(`Cita agendada para ${appointmentData.date} a las ${appointmentData.time} — ${appointmentData.service}`);
    setAppointmentData({ name: "", email: "", phone: "", service: "", date: "", time: "", notes: "" });
  };

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

  // Próximos 15 días laborables
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 30 && days.length < 15; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days.push({
          date: date.toISOString().split("T")[0],
          formatted: date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }),
        });
      }
    }
    return days;
  };

  const nextDays = getNextDays();
  const availableTimes = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  const services = [
    {
      id: "consulta", title: "Consulta Optometra", icon: "👁️", color: "blue", price: 50000, duration: "30-45 min",
      frontContent: { description: "Evaluación visual profesional", highlight: "Tecnología avanzada" },
      backContent: { description: "Evaluación completa con equipos modernos", features: ["Refracción digital", "Examen de agudeza visual"] }
    },
    {
      id: "campanas", title: "Campañas de SALUD", icon: "🩺", color: "green", price: 80000, duration: "Por proyecto",
      frontContent: { description: "Programas preventivos para grupos", highlight: "Impacto social" },
      backContent: { description: "Programas de prevención visual organizacional", features: ["Tamizaje grupal", "Charlas educativas"] }
    }
  ];

  return (
    <div className="services-page">

      {/* Navbar compartido — active en "servicios" */}
      <Navbar
        user={user}
        activePage="servicios"
        puedeVerDashboard={puedeVerDashboard}
        onNavigation={handleNavigation}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onDashboard={handleDashboard}
      />

      {/* Hero */}
      <section className="services-hero">
        <div className="services-container">
          <div className="hero-content">
            <h1 className="hero-title">Nuestros <span className="glowing-text">Servicios</span></h1>
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
              animationDuration: `${5 + Math.random() * 10}s`
            }} />
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="services-section">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">Servicios <span className="blue-gradient-text">Especializados</span></h2>
            <p className="section-description">Atención personalizada y tecnología de vanguardia</p>
          </div>

          <div className="services-grid-custom">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-card-custom ${service.color}`}
                onMouseEnter={() => handleCardMouseEnter(service.id)}
                onMouseLeave={() => handleCardMouseLeave(service.id)}
              >
                <div className="card-layer front-layer">
                  <div className="front-content">
                    <div className="icon-circle">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p className="description">{service.frontContent.description}</p>
                    <div className="highlight">{service.frontContent.highlight}</div>
                    <div className="service-meta-custom">
                      <span className="service-duration-custom">{service.duration}</span>
                      <span className="service-price-custom">{formatCurrency(service.price)}</span>
                    </div>
                  </div>
                </div>

                <div className={`card-layer back-layer ${activeCards[service.id] ? "active" : ""}`}>
                  <div className="back-content">
                    <div className="back-icon">{service.icon}</div>
                    <h3 className="back-title">{service.title}</h3>
                    <p className="back-description">{service.backContent.description}</p>
                    <div className="features-grid">
                      {service.backContent.features.map((feature, i) => (
                        <div key={i} className="feature-item">
                          <span className="feature-icon">✓</span>
                          <span className="feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setAppointmentData((prev) => ({ ...prev, service: service.title }));
                        document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="btn-icon">📅</span>
                      <span>Agendar este servicio</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de cita */}
      <section id="appointment-form" className="appointment-section">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title"><span className="blue-gradient-text">Agenda tu Cita</span></h2>
            <p className="section-description">Selecciona fecha y hora. Te confirmaremos por WhatsApp.</p>
          </div>

          <div className="appointment-container">
            <div className="appointment-form-container">
              <form className="appointment-form" onSubmit={handleAppointmentSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre Completo *</label>
                    <input type="text" id="name" name="name" value={appointmentData.name} onChange={handleInputChange} placeholder="Tu nombre completo" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" value={appointmentData.email} onChange={handleInputChange} placeholder="tu@email.com" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono / WhatsApp *</label>
                    <input type="tel" id="phone" name="phone" value={appointmentData.phone} onChange={handleInputChange} placeholder="Ej: 300 613 9449" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Servicio *</label>
                    <select id="service" name="service" value={appointmentData.service} onChange={handleInputChange} required>
                      <option value="">Selecciona un servicio</option>
                      <option value="Consulta Optometra">Consulta Optometra</option>
                      <option value="Campañas de SALUD">Campañas de SALUD</option>
                      <option value="Otro servicio">Otro servicio</option>
                    </select>
                  </div>
                </div>

                <div className="calendar-section">
                  <h3>Selecciona una fecha *</h3>
                  <div className="calendar-grid">
                    {nextDays.map((day, i) => (
                      <button
                        key={i} type="button"
                        className={`calendar-day ${appointmentData.date === day.date ? "selected" : ""}`}
                        onClick={() => setAppointmentData((prev) => ({ ...prev, date: day.date }))}
                      >
                        <span className="day-week">{day.formatted.split(" ")[0]}</span>
                        <span className="day-date">{day.formatted.split(" ")[1]}</span>
                        <span className="day-month">{day.formatted.split(" ")[2]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="time-section">
                  <h3>Selecciona un horario *</h3>
                  <div className="time-grid">
                    {availableTimes.map((time, i) => (
                      <button
                        key={i} type="button"
                        className={`time-slot ${appointmentData.time === time ? "selected" : ""}`}
                        onClick={() => setAppointmentData((prev) => ({ ...prev, time }))}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notas adicionales</label>
                  <textarea id="notes" name="notes" value={appointmentData.notes} onChange={handleInputChange} placeholder="Información adicional o preguntas" rows="3" />
                </div>

                <button type="submit" className="submit-appointment-btn">
                  <span className="btn-icon">✅</span> Confirmar Cita
                </button>
              </form>
            </div>

            <div className="appointment-info">
              <div className="info-card">
                <h3>📅 Información de la Cita</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-icon">⏰</span>
                    <div className="info-text">
                      <strong>Horarios de Atención</strong>
                      <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                      <p>Sábados: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div className="info-text">
                      <strong>Ubicación</strong>
                      <p>Cra 45 # 50-48 Local 102</p>
                      <p>El Palo con la Playa, Medellín</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div className="info-text">
                      <strong>Contacto</strong>
                      <p>300 613 9449 (WhatsApp)</p>
                      <p>(+57) 604 579 9276 (Fijo)</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">✅</span>
                    <div className="info-text">
                      <strong>Confirmación</strong>
                      <p>Recibirás confirmación por WhatsApp en menos de 24 horas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default ServicesPage;