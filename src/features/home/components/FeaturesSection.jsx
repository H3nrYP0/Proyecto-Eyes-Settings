import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/src/shared/styles/features/home/FeaturesSection.css";

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState({});

  // Productos destacados
  const featuredProducts = [
    {
      id: 1,
      name: "Ray-Ban Aviator Clásico",
      category: "Lentes de Sol Premium",
      price: 250000,
      description: "Icono de estilo desde 1937. Protección UV400, montura de metal ligera y lentes minerales resistentes para uso diario.",
      image: "🕶️",
      color: "#2563eb"
    },
    {
      id: 2,
      name: "Oakley Frame X",
      category: "Monturas Deportivas",
      price: 180000,
      description: "Diseñadas para atletas profesionales. Material flexible O Matter™, máxima resistencia y comodidad para actividades intensas.",
      image: "⚡",
      color: "#0284c7"
    },
    {
      id: 3,
      name: "Transition Gen 8",
      category: "Lentes Fotocromáticos",
      price: 320000,
      description: "Tecnología inteligente que se adapta automáticamente a la luz. Protección 100% UV y transición rápida entre interiores y exteriores.",
      image: "🌓",
      color: "#3b82f6"
    },
    {
      id: 4,
      name: "Acuvue Oasys",
      category: "Lentes de Contacto",
      price: 120000,
      description: "Con tecnología HydraClear® para hidratación prolongada y máxima comodidad durante todo el día. Protección UV incluida.",
      image: "🔍",
      color: "#93c5fd"
    }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 350);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const toggleDescription = (productId, e) => {
    e.stopPropagation();
    setShowDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Auto-rotación del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleViewAllProducts = () => {
    navigate("/productos");
  };

  const handleViewProductDetails = (productId) => {
    navigate(`/productos#product-${productId}`);
  };

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        {/* Header mejorado con diseño dividido */}
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
                  {currentIndex + 1} / {featuredProducts.length}
                </span>
                <h3 className="current-product-name">
                  {featuredProducts[currentIndex].name}
                </h3>
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

        {/* Carrusel Horizontal */}
        <div className="carousel-3d-horizontal">
          {/* Flecha izquierda */}
          <button 
            className="carousel-control-horizontal prev" 
            onClick={prevSlide}
            aria-label="Producto anterior"
          >
            <span className="control-icon-horizontal">←</span>
          </button>

          {/* Contenedor del carrusel */}
          <div className="carousel-3d-wrapper">
            {featuredProducts.map((product, index) => {
              const position = index - currentIndex;
              const isActive = position === 0;
              const isNext = position === 1 || (currentIndex === featuredProducts.length - 1 && index === 0);
              const isPrev = position === -1 || (currentIndex === 0 && index === featuredProducts.length - 1);
              const isFarNext = position === 2 || (currentIndex >= featuredProducts.length - 2 && position === -2);
              const isFarPrev = position === -2 || (currentIndex <= 1 && position === 2);
              
              let adjustedPosition = position;
              if (position > 2) adjustedPosition = -2;
              if (position < -2) adjustedPosition = 2;

              return (
                <div
                  key={product.id}
                  className={`carousel-slide-horizontal ${
                    isActive ? 'active' : 
                    isNext ? 'next' : 
                    isPrev ? 'prev' : 
                    isFarNext ? 'far-next' : 
                    isFarPrev ? 'far-prev' : 'hidden'
                  }`}
                  style={{
                    '--position': adjustedPosition,
                    '--product-color': product.color
                  }}
                  onClick={() => isActive && handleViewProductDetails(product.id)}
                >
                  <div className="product-card-horizontal">
                    <div className="product-image-horizontal">
                      <span className="product-emoji-horizontal">{product.image}</span>
                      <div className="product-badge-horizontal">Destacado</div>
                    </div>
                    
                    <div className="product-content-horizontal">
                      <span className="product-category-horizontal">{product.category}</span>
                      <h3 className="product-name-horizontal">{product.name}</h3>
                      
                      {/* DESCRIPCIÓN CONDICIONAL */}
                      {showDescriptions[product.id] && (
                        <div className="product-description-popup">
                          <p className="product-description-full">{product.description}</p>
                        </div>
                      )}
                      
                      <div className="product-price-section-horizontal">
                        <span className="product-price-horizontal">{formatCurrency(product.price)}</span>
                        
                        <div className="product-buttons-container">
                          <button 
                            className="product-action-btn-horizontal"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProductDetails(product.id);
                            }}
                          >
                            Comprar
                          </button>
                          
                          <button 
                            className="product-description-btn-horizontal"
                            onClick={(e) => toggleDescription(product.id, e)}
                          >
                            {showDescriptions[product.id] ? "Ocultar" : "Ver Descripción"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flecha derecha */}
          <button 
            className="carousel-control-horizontal next" 
            onClick={nextSlide}
            aria-label="Siguiente producto"
          >
            <span className="control-icon-horizontal">→</span>
          </button>

          {/* Indicadores */}
          <div className="carousel-indicators-horizontal">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                className={`indicator-horizontal ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="features-cta">
          <div className="cta-content">
            <h3>¿Quieres ver más opciones?</h3>
            <p>Explora nuestra colección completa de productos especializados en óptica</p>
            <button className="btn btn-primary btn-large" onClick={handleViewAllProducts}>
              Ver Todos los Productos →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;