import { useState, useEffect } from "react";
import "/src/shared/styles/features/home/HeroSection.css";

const HeroSection = ({ onGetStarted, user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Imágenes del carrusel (puedes reemplazar con tus propias imágenes)
  const carouselImages = [
    "/api/placeholder/1200/600", // Imagen 1 - Dashboard
    "/api/placeholder/1200/600", // Imagen 2 - Gestión de clientes
    "/api/placeholder/1200/600", // Imagen 3 - Control de inventario
  ];

  const carouselTexts = [
    "Dashboard intuitivo con métricas en tiempo real",
    "Gestión completa de historial de clientes",
    "Control automatizado de inventario"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section className="hero-section">
      {/* Carrusel de fondo */}
      <div className="hero-carousel">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
        
        {/* Controles del carrusel */}
        <button className="carousel-control prev" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-control next" onClick={nextSlide}>
          ›
        </button>
        
        {/* Indicadores */}
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">Sistema de Gestión para Ópticas</span>
          </div>
          
          <h1 className="hero-title">
            Optimiza tu 
            <span className="gradient-text"> óptica</span> 
            <br />con inteligencia
          </h1>
          
          <p className="hero-description">
            {carouselTexts[currentSlide]}
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large" 
              onClick={onGetStarted}
            >
              {user ? "Ir al Dashboard" : "Comenzar Gratis"}
            </button>
            <button className="btn btn-secondary btn-large">
              Ver Demo
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">+500</div>
              <div className="stat-label">Ópticas Confían</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Disponibilidad</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Soporte</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
              </div>
              <div className="preview-metrics">
                <div className="metric-card"></div>
                <div className="metric-card"></div>
                <div className="metric-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos flotantes */}
      <div className="hero-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
    </section>
  );
};

export default HeroSection;