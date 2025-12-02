import "../../../shared/styles/features/home/ServicesSection.css";

const ServicesSection = () => {
  const services = [
    {
      category: "Gestión Comercial",
      items: ["Control de Ventas", "Abonos y Créditos", "Pedidos Especiales", "Promociones"]
    },
    {
      category: "Administrativo",
      items: ["Inventario Automatizado", "Proveedores", "Reportes Financieros", "Métricas KPI"]
    },
    {
      category: "Servicio al Cliente",
      items: ["Historial Médico", "Recordatorios de Citas", "Seguimiento Post-venta", "Fidelización"]
    },
    {
      category: "Operaciones",
      items: ["Agenda de Citas", "Gestión de Empleados", "Campañas de Salud Visual", "Horarios"]
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <div className="section-header">
          <h2 className="section-title">
            Especializado para 
            <span className="gradient-text"> ópticas modernas</span>
          </h2>
          <p className="section-description">
            Cada funcionalidad diseñada pensando en las necesidades específicas del sector óptico
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-category">
              <h3 className="category-title">{service.category}</h3>
              <ul className="service-list">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="service-item">
                    <span className="check-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="services-demo">
          <div className="demo-content">
            <h3>¿No estás convencido?</h3>
            <p>Agenda una demostración personalizada y descubre cómo Visual Outlet puede transformar tu negocio</p>
            <div className="demo-actions">
              <button className="btn btn-primary">Agendar Demo</button>
              <button className="btn btn-outline">Ver Casos de Éxito</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;