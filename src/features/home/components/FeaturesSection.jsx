// FeaturesSection.jsx — Carrusel de productos con datos reales del backend
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./Shared/LoadingSpinner";
import { getAllProductosLanding } from "../components/Services/productosLandingData";
import "/src/shared/styles/features/home/FeaturesSection.css";

const FALLBACK_ICONS = ["🕶️", "👓", "🔍", "✨", "⚡", "🌓"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);

// ── Estilos inline para las flechas — centrado perfecto garantizado ──
const arrowBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  padding: "0",
  fontSize: "1.2rem",
};

const arrowIconStyle = {
  display: "block",
  lineHeight: "1",
  margin: "0",
  padding: "0",
};

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchProductos = async () => {
      try {
        const data = await getAllProductosLanding();
        if (mounted) setProductos(data.slice(0, 6));
      } catch (err) {
        console.error("Error cargando productos para carrusel:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProductos();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (productos.length < 2) return;
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
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

  const toggleDescription = (id, e) => {
    e.stopPropagation();
    setShowDescriptions(p => ({ ...p, [id]: !p[id] }));
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
                <span className="product-counter">
                  {currentIndex + 1} / {productos.length}
                </span>
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

          {/* ── CAMBIO: inline style en botón para centrar la flecha ── */}
          <button
            className="carousel-control-horizontal prev"
            onClick={prevSlide}
            aria-label="Producto anterior"
            style={arrowBtnStyle}
          >
            <span style={arrowIconStyle}>←</span>
          </button>

          <div className="carousel-3d-wrapper">
            {productos.map((producto, index) => {
              const position = index - currentIndex;
              const half = Math.floor(productos.length / 2);
              let pos = position;
              if (position > half) pos = position - productos.length;
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
                  onClick={() => isActive && navigate("/productos")}
                >
                  <div className="product-card-horizontal">
                    <div className="product-image-horizontal">
                      {producto.imagenPrincipal ? (
                        <img
                          src={producto.imagenPrincipal}
                          alt={producto.nombre}
                          style={{
                            width: "100%", height: "100%",
                            objectFit: "cover", borderRadius: "0.875rem",
                          }}
                          onError={e => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span
                        className="product-emoji-horizontal"
                        style={{ display: producto.imagenPrincipal ? "none" : "block" }}
                      >
                        {FALLBACK_ICONS[index % FALLBACK_ICONS.length]}
                      </span>
                      <div className="product-badge-horizontal">Destacado</div>
                    </div>

                    <div className="product-content-horizontal">
                      <h3 className="product-name-horizontal">{producto.nombre}</h3>

                      {showDescriptions[producto.id] && producto.descripcion && (
                        <div className="product-description-popup">
                          <p className="product-description-full">{producto.descripcion}</p>
                        </div>
                      )}

                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          background: producto.stockActual > 0 ? "#dcfce7" : "#fee2e2",
                          color: producto.stockActual > 0 ? "#166534" : "#dc2626",
                        }}>
                          {producto.stockActual > 0 ? `${producto.stockActual} disponibles` : "Agotado"}
                        </span>
                      </div>

                      <div className="product-price-section-horizontal">
                        <span className="product-price-horizontal">
                          {formatCurrency(producto.precioVenta)}
                        </span>
                        <div className="product-buttons-container">
                          <button
                            className="product-action-btn-horizontal"
                            onClick={e => {
                              e.stopPropagation();
                              navigate("/productos");
                            }}
                          >
                            Ver más
                          </button>
                          {producto.descripcion && (
                            <button
                              className="product-description-btn-horizontal"
                              onClick={e => toggleDescription(producto.id, e)}
                            >
                              {showDescriptions[producto.id] ? "Ocultar" : "Descripción"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CAMBIO: inline style en botón para centrar la flecha ── */}
          <button
            className="carousel-control-horizontal next"
            onClick={nextSlide}
            aria-label="Siguiente producto"
            style={arrowBtnStyle}
          >
            <span style={arrowIconStyle}>→</span>
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

        {/* ── CAMBIO: CTA con inline styles — textos separados y centrados ── */}
        <div className="features-cta">
          <div className="cta-content">
            <h3 style={{
              textAlign: "center",
              marginBottom: "1.25rem",
            }}>
              ¿Quieres ver más opciones?
            </h3>
            <p style={{
              textAlign: "center",
              marginBottom: "1.75rem",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Explora nuestra colección completa de productos especializados en óptica
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate("/productos")}
            >
              Ver Todos los Productos →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;