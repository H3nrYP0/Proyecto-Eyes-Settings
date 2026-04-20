// ProductsGrid.jsx
// Grid de productos con datos reales desde la API

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { getAllProductosLanding } from "../Services/productosLandingData";
import "/src/shared/styles/features/home/ProductsPage.css";

const ProductsGrid = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProductosLanding();
        if (mounted) setProductos(data);
      } catch (err) {
        if (mounted) {
          console.error("Error cargando productos:", err);
          setError("No pudimos cargar los productos. Por favor intenta más tarde.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProductos();
    return () => { mounted = false; };
  }, []);

  const handleConsultar = (producto) => {
    const mensaje = `Hola, me interesa el producto: *${producto.nombre}*%0APrecio: $${producto.precioVenta?.toLocaleString()}`;
    window.open(`https://wa.me/573006139449?text=${mensaje}`, "_blank");
  };

  return (
    <section className="products-section" id="productos">
      <div className="products-container">

        {/* Encabezado — teal hardcoded, sin PageHeader */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "0.6rem",
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #0d2e2e, #1a4a4a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Productos{" "}
            <span style={{
              background: "linear-gradient(135deg, #1a4a4a, #3d8080)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Destacados
            </span>
          </h2>
          <p style={{
            color: "#4e6e6e",
            fontSize: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Calidad y estilo en cada producto. Pasa el cursor sobre una tarjeta para ver los detalles.
          </p>
          <div style={{
            width: "44px",
            height: "3px",
            background: "linear-gradient(90deg, #1a4a4a, #3d8080)",
            borderRadius: "4px",
            margin: "0.875rem auto 0",
          }} />
        </div>

        {loading && <LoadingSpinner mensaje="Cargando productos..." />}

        {error && !loading && (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            background: "#f3f8f8",
            border: "1px solid #d4e6e6",
            borderRadius: "0.75rem",
            color: "#4e6e6e",
            fontSize: "0.9rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}>
            {error}
          </div>
        )}

        {!loading && !error && productos.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#4e6e6e", fontSize: "0.95rem" }}>
            No hay productos disponibles en este momento.
          </div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.75rem",
            maxWidth: "1100px",
            margin: "0 auto",
          }}>
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onConsultar={handleConsultar}
              />
            ))}
          </div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="products-cta" style={{ marginTop: "3rem" }}>
            <div className="cta-content">
              <h3>¿No encuentras lo que buscas?</h3>
              <p>Contáctanos para productos personalizados y asesoría especializada</p>
              <div className="cta-actions">
                <a
                  href="https://wa.me/573006139449"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp btn-large"
                  style={{ textDecoration: "none" }}
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGrid;