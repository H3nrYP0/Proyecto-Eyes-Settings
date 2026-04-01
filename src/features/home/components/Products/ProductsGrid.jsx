// ProductsGrid.jsx
// Grid de productos con datos reales desde la API
// Usa productosLandingData.js para la conexión al backend

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import PageHeader from "../Shared/PageHeader";
import { getAllProductosLanding } from "../Services/productosLandingData";

const ProductsGrid = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <PageHeader
          titulo="Productos"
          acento="Destacados"
          subtitulo="Calidad y estilo en cada producto. Haz clic en una tarjeta para ver los detalles."
        />

        {loading && <LoadingSpinner mensaje="Cargando productos..." />}

        {error && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            color: '#dc2626',
            fontSize: '0.9rem',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            {error}
          </div>
        )}

        {!loading && !error && productos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#64748b',
            fontSize: '0.95rem',
          }}>
            No hay productos disponibles en este momento.
          </div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="products-grid">
            {productos.map(producto => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onConsultar={handleConsultar}
              />
            ))}
          </div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="products-cta">
            <div className="cta-content">
              <h3>¿No encuentras lo que buscas?</h3>
              <p>Contáctanos para productos personalizados y asesoría especializada</p>
              <div className="cta-actions">
                <a
                  href="https://wa.me/573006139449"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-large"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  💬 Contactar por WhatsApp
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