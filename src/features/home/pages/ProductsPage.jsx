// =============================================================
// ProductsPage.jsx
// RESPONSABILIDAD: Página de productos.
//   - Usa el Navbar compartido con activePage="productos"
//   - Maneja su propio estado de UI (expandedProduct)
//   - Calcula permisos con hasPermiso desde el archivo central
// =============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterCompact from "../components/FooterCompact";
import { hasPermiso } from "../utils/permissions";
import "../../../shared/styles/features/home/ProductsPage.css";

const ProductsPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [expandedProduct, setExpandedProduct] = useState(null);

  // --- Permisos ---
  const puedeVerDashboard = hasPermiso(user, "dashboard");

  // --- Handlers ---
  const handleNavigation = (path) => { 
    navigate(path); 
    window.scrollTo(0, 0); 
  };
  const handleLogin = () => navigate("/login");
  const handleLogout = () => { 
    setUser(null); 
    navigate("/"); 
  };
  const handleDashboard = () => navigate(user ? "/admin/dashboard" : "/login");

  const toggleProduct = (id) => setExpandedProduct(expandedProduct === id ? null : id);
  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

  const products = [
    {
      id: 1, name: "Lentes Ray-Ban Aviator", category: "Lentes de Sol", price: 250000,
      description: "Lentes de sol clásicos con protección UV 400. Ideales para uso diario y deportivo.",
      fullDescription: "Los Ray-Ban Aviator son un ícono de estilo y funcionalidad. Con protección UV 400 que bloquea el 100% de los rayos UVA/UVB, montura de metal ligero y lentes de cristal mineral resistente.",
      features: ["Protección UV 400", "Montura de metal", "Lentes de cristal mineral", "Estilo clásico", "Varios colores disponibles"],
      inStock: true, image: "🕶️",
      specifications: { material: "Metal y Cristal Mineral", protección: "UV 400", colores: ["Dorado", "Plateado", "Negro", "Tortoise"], garantía: "2 años" }
    },
    {
      id: 2, name: "Armazón Oakley Frame", category: "Monturas Deportivas", price: 180000,
      description: "Armazón deportivo de alta resistencia, perfecto para actividades físicas.",
      fullDescription: "Diseñado para atletas y personas activas. Material O Matter™ ultra resistente, bisagras de resorte Unobtainium™ y tecnología High Definition Optics®.",
      features: ["Material O Matter™", "Bisagras de resorte", "HD Optics®", "Resistente al impacto", "Ligero y cómodo"],
      inStock: true, image: "⚡",
      specifications: { material: "O Matter™", peso: "26 gramos", colores: ["Negro mate", "Blanco", "Rojo racing", "Azul eléctrico"], garantía: "Vitalicia en marco" }
    },
    {
      id: 3, name: "Lentes de Contacto Acuvue", category: "Lentes de Contacto", price: 120000,
      description: "Lentes de contacto desechables mensuales con máxima comodidad.",
      fullDescription: "Lentes blandos desechables mensuales con tecnología HydraClear® que proporciona hidratación excepcional durante todo el día.",
      features: ["Tecnología HydraClear®", "Protección UV", "Hidratación prolongada", "Diseño estabilizado", "Comodidad todo el día"],
      inStock: false, image: "🔍",
      specifications: { tipo: "Blandos desechables", duración: "1 mes", hidratación: "58% contenido de agua", protección: "Clase 1 UV", disponible: "Próximamente" }
    },
    {
      id: 4, name: "Lentes Transition Signature", category: "Lentes Fotocromáticos", price: 320000,
      description: "Lentes que se oscurecen con la luz solar y se aclaran en interiores.",
      fullDescription: "Los Transition Signature GEN 8™ ofrecen la tecnología fotocromática más avanzada. Se oscurecen rápidamente al salir y se aclaran instantáneamente al entrar.",
      features: ["Tecnología GEN 8™", "Transición rápida", "Protección 100% UV", "Todos los materiales", "Cristalino en interiores"],
      inStock: true, image: "🌓",
      specifications: { tecnología: "Transition GEN 8™", velocidad: "20 segundos", protección: "100% UV A/B", materiales: ["CR-39", "Policarbonato", "Trivex", "High-Index"], garantía: "2 años" }
    }
  ];

  return (
    <div className="products-page">

      {/* Navbar compartido — active en "productos" */}
      <Navbar
        user={user}
        activePage="productos"
        puedeVerDashboard={puedeVerDashboard}
        onNavigation={handleNavigation}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onDashboard={handleDashboard}
      />

      {/* Hero */}
      <section className="products-hero">
        <div className="products-container">
          <div className="hero-content">
            <h1 className="hero-title">Nuestros <span className="vibrant-text">Productos</span></h1>
            <p className="hero-description">
              Descubre nuestra selección premium de lentes, monturas y accesorios
            </p>
          </div>
        </div>
        <div className="hero-animated-elements">
          <div className="floating-element element-1">👓</div>
          <div className="floating-element element-2">🕶️</div>
          <div className="floating-element element-3">🔍</div>
          <div className="floating-element element-4">✨</div>
          <div className="floating-element element-5">⭐</div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Productos <span className="blue-gradient-text">Destacados</span></h2>
            <p className="section-description">Calidad y estilo en cada producto. Selecciona para ver detalles</p>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className={`product-card ${expandedProduct === product.id ? "expanded" : ""} ${!product.inStock ? "out-of-stock" : ""}`}
                onClick={() => toggleProduct(product.id)}
              >
                <div className="product-header">
                  <div className="product-image">
                    <span className="product-emoji">{product.image}</span>
                    {!product.inStock && <div className="product-badge out-of-stock-badge">Agotado</div>}
                    {product.inStock  && <div className="product-badge in-stock-badge">Disponible</div>}
                  </div>
                  <div className="product-basic-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price-section">
                      <span className="product-price">{formatCurrency(product.price)}</span>
                      <button
                        className={`product-action-btn ${product.inStock ? "btn-primary" : "btn-disabled"}`}
                        disabled={!product.inStock}
                        onClick={(e) => { e.stopPropagation(); if (product.inStock) alert(`Consultando: ${product.name}`); }}
                      >
                        {product.inStock ? "Consultar" : "No Disponible"}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedProduct === product.id && (
                  <div className="product-expanded-content">
                    <div className="expanded-section">
                      <h4>Descripción Completa</h4>
                      <p>{product.fullDescription}</p>
                    </div>
                    <div className="expanded-section">
                      <h4>Características Principales</h4>
                      <div className="features-grid">
                        {product.features.map((f, i) => (
                          <div key={i} className="feature-item"><span className="feature-icon">✓</span>{f}</div>
                        ))}
                      </div>
                    </div>
                    <div className="expanded-section">
                      <h4>Especificaciones Técnicas</h4>
                      <div className="specifications-grid">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                            <span>{Array.isArray(value) ? value.join(", ") : value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-primary">💬 Solicitar Información</button>
                      <button className="btn btn-outline">📞 Llamar para Consulta</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="products-cta">
            <div className="cta-content">
              <h3>¿No encuentras lo que buscas?</h3>
              <p>Contáctanos para productos personalizados y asesoría especializada</p>
              <div className="cta-actions">
                <button className="btn btn-primary btn-large" onClick={() => navigate("/servicios")}>
                  Explorar Nuestros Servicios
                </button>
                <button className="btn btn-outline" onClick={() => navigate("/#contact")}>
                  Contactar Asesor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default ProductsPage;