import { useState } from "react";
import "/src/shared/styles/features/home/ServicesSection.css";

const ServicesSection = () => {
  const [activeCards, setActiveCards] = useState({
    consulta: false,
    campanas: false
  });

  const services = [
    {
      id: "consulta",
      title: "Consulta Optometra",
      icon: "👁️",
      color: "blue",
      frontContent: {
        description: "Evaluación visual profesional",
        highlight: "Tecnología avanzada"
      },
      backContent: {
        description: "Evaluación completa con equipos modernos",
        features: [
          "Refracción digital",
        ]
      }
    },
    {
      id: "campanas", 
      title: "Campañas de SALUD",
      icon: "🩺",
      color: "green",
      frontContent: {
        description: "Programas preventivos para grupos",
        highlight: "Impacto social"
      },
      backContent: {
        description: "Programas de prevención visual organizacional",
        features: [
          "Tamizaje grupal",
        ]
      }
    }
  ];

  const handleCardMouseEnter = (serviceId) => {
    setActiveCards(prev => ({
      ...prev,
      [serviceId]: true
    }));
  };

  const handleCardMouseLeave = (serviceId) => {
    setActiveCards(prev => ({
      ...prev,
      [serviceId]: false
    }));
  };

  const handleServiceAction = (serviceTitle) => {
    alert(`Solicitando: ${serviceTitle}`);
  };

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <div className="section-main-title">
          <h2>Servicios Especializados</h2>
          <p className="title-subtext">Cuidado visual profesional</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`service-card ${service.color}`}
              onMouseEnter={() => handleCardMouseEnter(service.id)}
              onMouseLeave={() => handleCardMouseLeave(service.id)}
            >
              {/* Capa frontal */}
              <div className="card-layer front-layer">
                <div className="front-content">
                  <div className="icon-circle">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p className="description">{service.frontContent.description}</p>
                  <div className="highlight">{service.frontContent.highlight}</div>
                </div>
              </div>

              {/* Capa trasera */}
              <div className={`card-layer back-layer ${activeCards[service.id] ? 'active' : ''}`}>
                <div className="back-content">
                  <div className="back-icon">{service.icon}</div>
                  <h3 className="back-title">{service.title}</h3>
                  
                  <p className="back-description">
                    {service.backContent.description}
                  </p>
                  
                  <div className="features-grid">
                    {service.backContent.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span className="feature-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceAction(service.title);
                    }}
                  >
                    <span className="btn-icon">📅</span>
                    <span>Consultar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;