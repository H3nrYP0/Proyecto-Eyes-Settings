import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../shared/styles/features/home/ServicesPage.css";

const ServicesPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [expandedService, setExpandedService] = useState(null);

  const handleLogin = () => navigate("/login");
  const handleDashboard = () => user ? navigate("/admin/dashboard") : navigate("/login");
  const handleLogout = () => { setUser(null); navigate("/"); };

  const services = [
    {
      id: 1,
      name: "Examen de la Vista Completo",
      duration: "30-45 min",
      price: 50000,
      description: "Evaluación exhaustiva de tu salud visual incluyendo agudeza visual, presión ocular y examen de fondo de ojo.",
      fullDescription: "Nuestro examen visual completo es realizado por optómetras certificados utilizando tecnología de última generación. Incluye evaluación de agudeza visual, presión intraocular, fondo de ojo, refracción y salud ocular general. Perfecto para detectar condiciones como miopía, astigmatismo, hipermetropía y enfermedades oculares.",
      features: ["Agudeza visual", "Presión ocular", "Fondo de ojo", "Prescripción personalizada", "Consejería visual", "Salud ocular completa"],
      benefits: ["Detección temprana de problemas", "Prescripción precisa", "Evaluación de salud ocular", "Recomendaciones personalizadas"],
      icon: "👁️",
      recommendedFor: ["Primera vez usando lentes", "Cambio de graduación", "Chequeo anual", "Personas con diabetes", "Mayores de 40 años"]
    },
    {
      id: 2,
      name: "Ajuste y Reparación de Lentes",
      duration: "15-20 min",
      price: 15000,
      description: "Servicio profesional de ajuste de monturas, cambio de plaquetas y reparación de varillas.",
      fullDescription: "Nuestros técnicos especializados realizan ajustes precisos para garantizar la comodidad y funcionalidad de tus lentes. Servicio rápido y eficiente que incluye ajuste de patillas, puente, cambio de plaquetas, soldadura de varillas y limpieza profesional. Trabajamos con todo tipo de monturas y materiales.",
      features: ["Ajuste de montura", "Cambio de plaquetas", "Reparación de varillas", "Limpieza profesional", "Ajuste de patillas", "Soldadura especializada"],
      benefits: ["Comodidad mejorada", "Prolongación de vida útil", "Ajuste personalizado", "Servicio inmediato"],
      icon: "🔧",
      recommendedFor: ["Monturas desajustadas", "Pérdida de plaquetas", "Varillas rotas", "Incomodidad al usar lentes"]
    },
    {
      id: 3,
      name: "Adaptación de Lentes de Contacto",
      duration: "45-60 min",
      price: 80000,
      description: "Evaluación, adaptación y entrenamiento completo para el uso de lentes de contacto.",
      fullDescription: "Servicio especializado para nuevos usuarios de lentes de contacto. Incluye evaluación de compatibilidad, medición de curvatura corneal, selección del tipo adecuado de lentes, entrenamiento práctico de inserción y remoción, y educación sobre cuidado y mantenimiento. Seguimiento incluido durante el primer mes.",
      features: ["Evaluación inicial", "Medición corneal", "Selección de lentes", "Entrenamiento práctico", "Educación de cuidado", "Seguimiento mensual"],
      benefits: ["Transición sin problemas", "Uso seguro y cómodo", "Instrucción profesional", "Soporte continuo"],
      icon: "🔍",
      recommendedFor: ["Primera vez con lentes de contacto", "Cambio de tipo de lentes", "Problemas de adaptación", "Usuarios deportivos"]
    },
    {
      id: 4,
      name: "Lentes para Deporte y Protección",
      duration: "30 min",
      price: 75000,
      description: "Asesoría especializada en lentes deportivos y protección visual para actividades físicas.",
      fullDescription: "Servicio especializado para atletas y personas activas. Evaluamos tus necesidades específicas según el deporte que practiques y recomendamos lentes con características especiales como protección contra impacto, lentes polarizados, monturas flexibles y tecnología anti-empañamiento. Incluye pruebas de campo y ajustes deportivos.",
      features: ["Evaluación deportiva", "Lentes especializados", "Protección UV avanzada", "Resistencia al impacto", "Tecnología anti-empañamiento", "Ajuste deportivo"],
      benefits: ["Rendimiento visual óptimo", "Protección ocular completa", "Comodidad durante actividad", "Durabilidad mejorada"],
      icon: "⚽",
      recommendedFor: ["Deportistas profesionales", "Aficionados al aire libre", "Ciclismo", "Natación", "Deportes de contacto"]
    }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const toggleService = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <div className="services-page">
      {/* Navigation - ACTUALIZADO CON USER ACTIONS */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="logo">
              <span className="logo-text">VISUAL OUTLET</span>
            </div>
          </div>
          
          <div className="nav-menu">
            <button 
              className="nav-link"
              onClick={() => navigate("/")}
            >
              Inicio
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate("/productos")}
            >
              Productos
            </button>
            <button 
              className="nav-link active"
              onClick={() => navigate("/servicios")}
            >
              Servicios
            </button>
          </div>
          
          <div className="nav-actions">
            {user ? (
              <div className="user-actions">
                <span className="user-greeting">Hola, {user.name}</span>
                <button className="btn btn-dashboard" onClick={handleDashboard}>
                  Dashboard
                </button>
                <button className="btn btn-logout" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <button className="btn btn-login" onClick={handleLogin}>
                  Entrar al Sistema
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section Mejorado */}
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
        
        {/* Elementos decorativos animados */}
        <div className="hero-animated-elements">
          <div className="pulse-element pulse-1">👁️</div>
          <div className="pulse-element pulse-2">🔧</div>
          <div className="pulse-element pulse-3">⚡</div>
          <div className="pulse-element pulse-4">🌟</div>
          <div className="pulse-element pulse-5">💫</div>
        </div>
        
        {/* Partículas flotantes */}
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
        
        {/* Ola animada */}
        <div className="wave-animation"></div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">
              Servicios <span className="gradient-text">Especializados</span>
            </h2>
            <p className="section-description">
              Atención personalizada y tecnología de vanguardia para el cuidado de tu visión
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <div 
                key={service.id} 
                className={`service-card ${expandedService === service.id ? 'expanded' : ''}`}
                onClick={() => toggleService(service.id)}
              >
                <div className="service-header">
                  <div className="service-icon">
                    <span>{service.icon}</span>
                  </div>
                  
                  <div className="service-basic-info">
                    <h3 className="service-name">{service.name}</h3>
                    <div className="service-meta">
                      <span className="service-duration">{service.duration}</span>
                      <span className="service-price">{formatCurrency(service.price)}</span>
                    </div>
                    <p className="service-description">{service.description}</p>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedService === service.id && (
                  <div className="service-expanded-content">
                    <div className="expanded-section">
                      <h4>Descripción Detallada</h4>
                      <p>{service.fullDescription}</p>
                    </div>
                    
                    <div className="features-benefits-grid">
                      <div className="features-section">
                        <h4>📋 Lo que incluye</h4>
                        <div className="features-list">
                          {service.features.map((feature, index) => (
                            <div key={index} className="feature-item">
                              <span className="feature-icon">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="benefits-section">
                        <h4>🎯 Beneficios</h4>
                        <div className="benefits-list">
                          {service.benefits.map((benefit, index) => (
                            <div key={index} className="benefit-item">
                              <span className="benefit-icon">⭐</span>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="recommended-section">
                      <h4>👥 Recomendado para</h4>
                      <div className="recommended-tags">
                        {service.recommendedFor.map((item, index) => (
                          <span key={index} className="recommended-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="service-actions">
                      <button className="btn btn-primary btn-large">
                        📅 Agendar Cita
                      </button>
                      <button className="btn btn-outline">
                        💬 Consultar Disponibilidad
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="services-cta">
            <div className="cta-content">
              <h3>¿Listo para cuidar tu visión?</h3>
              <p>Nuestros especialistas están listos para brindarte la mejor atención y asesoría personalizada</p>
              <div className="cta-actions">
                <button className="btn btn-primary btn-large">
                  📞 Agendar Consulta Ahora
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate("/productos")}
                >
                  Explorar Productos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Integrado */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">👁️</span>
                <span className="logo-text">Visual Outlet</span>
              </div>
              <p className="footer-description">
                Expertos en salud visual. Servicios profesionales para el cuidado de tus ojos.
              </p>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h4>Navegación</h4>
                <div className="link-list">
                  <button onClick={() => navigate("/")} className="footer-link">
                    Inicio
                  </button>
                  <button onClick={() => navigate("/productos")} className="footer-link">
                    Productos
                  </button>
                  <button onClick={() => navigate("/servicios")} className="footer-link">
                    Servicios
                  </button>
                </div>
              </div>

              <div className="link-group">
                <h4>Servicios</h4>
                <div className="link-list">
                  <span className="footer-link">Exámenes Visuales</span>
                  <span className="footer-link">Lentes de Contacto</span>
                  <span className="footer-link">Ajuste de Monturas</span>
                  <span className="footer-link">Servicios Deportivos</span>
                </div>
              </div>

              <div className="link-group">
                <h4>Contacto</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span className="contact-text">+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span className="contact-text">servicios@visualoutlet.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🕒</span>
                    <span className="contact-text">Lun-Vie: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="copyright">
                <p>&copy; 2024 Visual Outlet. Servicios profesionales de optometría.</p>
              </div>
            </div>
          </div>

          <button 
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;