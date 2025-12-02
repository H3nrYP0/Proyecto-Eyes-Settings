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
          <h1 className="hero-title">
            Calidad Y
            <span className="gradient-text"> Responsabilidad</span> 
            <br />A Precio Justo
          </h1>
          
          <p className="hero-description">
            {carouselTexts[currentSlide]}
          </p>
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
        <div className="floating-shape shape-5"></div>
        <div className="floating-shape shape-6"></div>
      </div>
      
      {/* Ola animada */}
      <div className="wave-animation"></div>
    </section>
  );
};

export default HeroSection;