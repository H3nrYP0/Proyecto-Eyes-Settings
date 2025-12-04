import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../shared/styles/features/home/ProductsPage.css";

const ProductsPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [expandedProduct, setExpandedProduct] = useState(null);

  const handleLogin = () => navigate("/login");
  const handleDashboard = () => user ? navigate("/admin/dashboard") : navigate("/login");
  const handleLogout = () => { setUser(null); navigate("/"); };

  const products = [
    {
      id: 1,
      name: "Lentes Ray-Ban Aviator",
      category: "Lentes de Sol",
      price: 250000,
      description: "Lentes de sol clásicos con protección UV 400. Ideales para uso diario y deportivo.",
      fullDescription: "Los Ray-Ban Aviator son un ícono de estilo y funcionalidad. Con protección UV 400 que bloquea el 100% de los rayos UVA/UVB, montura de metal ligero y lentes de cristal mineral resistente. Disponible en varios colores y tamaños.",
      features: ["Protección UV 400", "Montura de metal", "Lentes de cristal mineral", "Estilo clásico", "Varios colores disponibles"],
      inStock: true,
      image: "🕶️",
      specifications: {
        material: "Metal y Cristal Mineral",
        protección: "UV 400",
        colores: ["Dorado", "Plateado", "Negro", "Tortoise"],
        garantía: "2 años"
      }
    },
    {
      id: 2,
      name: "Armazón Oakley Frame",
      category: "Monturas Deportivas",
      price: 180000,
      description: "Armazón deportivo de alta resistencia, perfecto para actividades físicas.",
      fullDescription: "Diseñado específicamente para atletas y personas activas. Material O Matter™ ultra resistente, bisagras de resorte Unobtainium™ y tecnología High Definition Optics® para una visión perfecta sin distorsiones.",
      features: ["Material O Matter™", "Bisagras de resorte", "HD Optics®", "Resistente al impacto", "Ligero y cómodo"],
      inStock: true,
      image: "⚡",
      specifications: {
        material: "O Matter™",
        peso: "26 gramos",
        colores: ["Negro mate", "Blanco", "Rojo racing", "Azul eléctrico"],
        garantía: "Vitalicia en marco"
      }
    },
    {
      id: 3,
      name: "Lentes de Contacto Acuvue",
      category: "Lentes de Contacto",
      price: 120000,
      description: "Lentes de contacto desechables mensuales con máxima comodidad.",
      fullDescription: "Lentes de contacto blandos desechables mensuales con tecnología HydraClear® que proporciona una hidratación excepcional y comodidad durante todo el día. Protección UV integrada y diseño estabilizado para visión nítida.",
      features: ["Tecnología HydraClear®", "Protección UV", "Hidratación prolongada", "Diseño estabilizado", "Comodidad todo el día"],
      inStock: false,
      image: "🔍",
      specifications: {
        tipo: "Blandos desechables",
        duración: "1 mes",
        hidratación: "58% contenido de agua",
        protección: "Clase 1 UV",
        disponible: "Próximamente"
      }
    },
    {
      id: 4,
      name: "Lentes Transition Signature",
      category: "Lentes Fotocromáticos",
      price: 320000,
      description: "Lentes que se oscurecen con la luz solar y se aclaran en interiores.",
      fullDescription: "Los lentes Transition Signature GEN 8™ ofrecen la tecnología fotocromática más avanzada. Se oscurecen rápidamente al salir y se aclaran instantáneamente al entrar. Protección 100% UV y disponible en todos los materiales de lentes.",
      features: ["Tecnología GEN 8™", "Transición rápida", "Protección 100% UV", "Disponible en todos los materiales", "Cristalino en interiores"],
      inStock: true,
      image: "🌓",
      specifications: {
        tecnología: "Transition GEN 8™",
        velocidad: "20 segundos para oscurecer",
        protección: "100% UV A/B",
        materiales: ["CR-39", "Policarbonato", "Trivex", "High-Index"],
        garantía: "2 años"
      }
    }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const toggleProduct = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="products-page">
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
              className="nav-link active"
              onClick={() => navigate("/productos")}
            >
              Productos
            </button>
            <button 
              className="nav-link"
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
      <section className="products-hero">
        <div className="products-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Nuestros <span className="vibrant-text">Productos</span>
            </h1>
            <p className="hero-description">
              Descubre nuestra selección premium de lentes, monturas y accesorios diseñados para tu comodidad y estilo
            </p>
          </div>
        </div>
        
        {/* Elementos decorativos animados */}
        <div className="hero-animated-elements">
          <div className="floating-element element-1">👓</div>
          <div className="floating-element element-2">🕶️</div>
          <div className="floating-element element-3">🔍</div>
          <div className="floating-element element-4">✨</div>
          <div className="floating-element element-5">⭐</div>
        </div>
        
        {/* Ola animada */}
        <div className="wave-animation"></div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">
              Productos <span className="gradient-text">Destacados</span>
            </h2>
            <p className="section-description">
              Calidad y estilo en cada producto. Selecciona para ver detalles completos
            </p>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`product-card ${expandedProduct === product.id ? 'expanded' : ''} ${!product.inStock ? 'out-of-stock' : ''}`}
                onClick={() => toggleProduct(product.id)}
              >
                <div className="product-header">
                  <div className="product-image">
                    <span className="product-emoji">{product.image}</span>
                    {!product.inStock && (
                      <div className="product-badge out-of-stock-badge">Agotado</div>
                    )}
                    {product.inStock && (
                      <div className="product-badge in-stock-badge">Disponible</div>
                    )}
                  </div>
                  
                  <div className="product-basic-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-price-section">
                      <span className="product-price">{formatCurrency(product.price)}</span>
                      <button 
                        className={`product-action-btn ${product.inStock ? 'btn-primary' : 'btn-disabled'}`}
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.inStock) {
                            alert(`Consultando disponibilidad de: ${product.name}`);
                          }
                        }}
                      >
                        {product.inStock ? 'Consultar' : 'No Disponible'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedProduct === product.id && (
                  <div className="product-expanded-content">
                    <div className="expanded-section">
                      <h4>Descripción Completa</h4>
                      <p>{product.fullDescription}</p>
                    </div>
                    
                    <div className="expanded-section">
                      <h4>Características Principales</h4>
                      <div className="features-grid">
                        {product.features.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <span className="feature-icon">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="expanded-section">
                      <h4>Especificaciones Técnicas</h4>
                      <div className="specifications-grid">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                            <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button className="btn btn-primary">
                        💬 Solicitar Información
                      </button>
                      <button className="btn btn-outline">
                        📞 Llamar para Consulta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="products-cta">
            <div className="cta-content">
              <h3>¿No encuentras lo que buscas?</h3>
              <p>Contáctanos para productos personalizados y asesoría especializada</p>
              <div className="cta-actions">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => navigate("/servicios")}
                >
                  Explorar Nuestros Servicios
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate("/#contact")}
                >
                  Contactar Asesor
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
                Tu visión es nuestra prioridad. Productos de calidad para el cuidado de tus ojos.
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
                <h4>Productos</h4>
                <div className="link-list">
                  <span className="footer-link">Lentes de Sol</span>
                  <span className="footer-link">Monturas</span>
                  <span className="footer-link">Lentes de Contacto</span>
                  <span className="footer-link">Lentes Especializados</span>
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
                    <span className="contact-text">productos@visualoutlet.com</span>
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
                <p>&copy; 2024 Visual Outlet. Todos los derechos reservados.</p>
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

export default ProductsPage;