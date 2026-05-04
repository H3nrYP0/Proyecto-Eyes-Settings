// FeaturesSection.jsx — Carrusel minimalista
// Tarjeta: solo imagen + precio, click → /productos/:id
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./Shared/LoadingSpinner";
import { getAllProductosLanding } from "../components/Services/productosLandingData";
import "/src/shared/styles/features/home/FeaturesSection.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", minimumFractionDigits: 0,
  }).format(amount);

const arrowBtnStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  lineHeight: "1", padding: "0",
};

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [productos,     setProductos]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [isAnimating,   setIsAnimating]   = useState(false);

  useEffect(() => {
    let mounted = true;
    getAllProductosLanding()
      .then(data => { if (mounted) setProductos(data.slice(0, 6)); })
      .catch(err => console.error("Error carrusel:", err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (productos.length < 2) return;
    const t = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(t);
  }, [currentIndex, productos.length]);

  const nextSlide = () => {
    if (isAnimating || productos.length < 2) return;
    setIsAnimating(true);
    setCurrentIndex(p => (p + 1) % productos.length);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const prevSlide = () => {
    if (isAnimating || productos.length < 2) return;
    setIsAnimating(true);
    setCurrentIndex(p => (p === 0 ? productos.length - 1 : p - 1));
    setTimeout(() => setIsAnimating(false), 350);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 350);
  };

  if (loading) {
    return (
      <section id="features" className="features-section">
        <div className="features-container">
          <LoadingSpinner mensaje="Cargando productos destacados..." />
        </div>
      </section>
    );
  }

  if (productos.length === 0) return null;

  const current = productos[currentIndex];

  return (
    <section id="features" className="features-section">
      <div className="features-container">

        {/* Header */}
        <div className="section-header-enhanced">
          <div className="header-left">
            <h2 className="section-title-large">
              <span className="blue-gradient-text">PRODUCTOS</span>
            </h2>
            <p className="section-subtitle">Selección premium</p>
          </div>
          <div className="header-center">
            <div className="carousel-info">
              <div className="current-product-info">
                <span className="product-counter">{currentIndex + 1} / {productos.length}</span>
                <h3 className="current-product-name">{current.nombre}</h3>
              </div>
            </div>
          </div>
          <div className="header-right">
            <h2 className="section-title-large">
              <span className="blue-gradient-text">DESTACADOS</span>
            </h2>
            <p className="section-subtitle">Lo mejor de la colección</p>
          </div>
        </div>

        {/* Carrusel */}
        <div className="carousel-3d-horizontal">
          <button
            className="carousel-control-horizontal prev"
            onClick={prevSlide}
            aria-label="Producto anterior"
            style={arrowBtnStyle}
          >
            ←
          </button>

          <div className="carousel-3d-wrapper">
            {productos.map((producto, index) => {
              const position = index - currentIndex;
              const half     = Math.floor(productos.length / 2);
              let pos        = position;
              if (position > half)  pos = position - productos.length;
              if (position < -half) pos = position + productos.length;

              const isActive  = pos === 0;
              const isNext    = pos === 1;
              const isPrev    = pos === -1;
              const isFarNext = pos === 2;
              const isFarPrev = pos === -2;

              let className = "hidden";
              if (isActive)   className = "active";
              else if (isNext)    className = "next";
              else if (isPrev)    className = "prev";
              else if (isFarNext) className = "far-next";
              else if (isFarPrev) className = "far-prev";

              return (
                <div
                  key={producto.id}
                  className={`carousel-slide-horizontal ${className}`}
                  onClick={() => isActive && navigate(`/productos/${producto.id}`)}
                >
                  {/* Tarjeta minimalista: solo imagen + precio */}
                  <div className="fcs-card">
                    <div className="fcs-image-wrap">
                      {producto.imagenPrincipal ? (
                        <img
                          src={producto.imagenPrincipal}
                          alt={producto.nombre}
                          className="fcs-image"
                          draggable={false}
                        />
                      ) : (
                        <div className="fcs-placeholder">
                          <svg viewBox="0 0 48 48" fill="none">
                            <rect x="6" y="14" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                            <circle cx="17" cy="22" r="3" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M6 32l10-8 7 6 5-4 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="fcs-info">
                      <p className="fcs-name">{producto.nombre}</p>
                      <p className="fcs-price">{formatCurrency(producto.precioVenta)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="carousel-control-horizontal next"
            onClick={nextSlide}
            aria-label="Siguiente producto"
            style={arrowBtnStyle}
          >
            →
          </button>

          <div className="carousel-indicators-horizontal">
            {productos.map((_, index) => (
              <button
                key={index}
                className={`indicator-horizontal ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="features-cta">
          <div className="cta-content">
            <h3>¿Quieres ver más opciones?</h3>
            <p>Explora nuestra colección completa de productos especializados en óptica</p>
            <button className="btn btn-primary btn-large" onClick={() => navigate("/productos")}>
              Ver Todos los Productos →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;