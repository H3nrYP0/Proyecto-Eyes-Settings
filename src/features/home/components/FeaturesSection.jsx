import "/src/shared/styles/features/home/FeaturesSection.css";

const FeaturesSection = () => {
  const features = [
    {
      icon: "📊",
      title: "Dashboard Inteligente",
      description: "Métricas en tiempo real de ventas, inventario y rendimiento de tu óptica.",
      color: "var(--emerald)"
    },
    {
      icon: "👥",
      title: "Gestión de Clientes",
      description: "Historial completo de clientes, recetas y preferencias de lentes.",
      color: "var(--ocean-teal)"
    },
    {
      icon: "📦",
      title: "Control de Inventario",
      description: "Seguimiento automático de armazones, lentes y accesorios.",
      color: "var(--vibrant-green)"
    },
    {
      icon: "🔄",
      title: "Procesos Automatizados",
      description: "Automatiza citas, recordatorios y seguimiento de ventas.",
      color: "var(--sky-teal)"
    },
    {
      icon: "💳",
      title: "Sistema de Ventas",
      description: "Procesa ventas, abonos y maneja múltiples métodos de pago.",
      color: "var(--deep-teal)"
    },
    {
      icon: "📅",
      title: "Agenda de Citas",
      description: "Programa y gestiona citas para exámenes de la vista y ajustes.",
      color: "var(--warm-beige)"
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">
            Todo lo que necesitas para 
            <span className="gradient-text"> gestionar tu óptica</span>
          </h2>
          <p className="section-description">
            Diseñado específicamente para las necesidades únicas de las ópticas modernas
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div 
                className="feature-icon"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <span 
                  className="icon-emoji"
                  style={{ color: feature.color }}
                >
                  {feature.icon}
                </span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <div className="cta-content">
            <h3>¿Listo para transformar tu óptica?</h3>
            <p>Únete a más de 500 ópticas que ya usan Visual Outlet</p>
            <button className="btn btn-primary btn-large">
              Comenzar Prueba Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;