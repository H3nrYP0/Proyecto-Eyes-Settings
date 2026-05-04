// =============================================================
// ProductsGrid.jsx
// UBICACIÓN: src/features/home/components/Products/ProductsGrid.jsx
//
// Grid de productos. Las tarjetas son clickeables y navegan
// a /productos/:id. Sin botones de consultar, sin flip.
// Incluye buscador y filtros de categoría.
// =============================================================

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { getAllProductosLanding } from "../Services/productosLandingData";

const ProductsGrid = () => {
  const navigate = useNavigate();
  const [productos, setProductos]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  useEffect(() => {
    let mounted = true;
    (async () => {
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
    })();
    return () => { mounted = false; };
  }, []);

  // Categorías únicas
  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
    return ["Todos", ...cats];
  }, [productos]);

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchSearch = !search ||
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.marca || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.categoria || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = categoriaFiltro === "Todos" || p.categoria === categoriaFiltro;
      return matchSearch && matchCat;
    });
  }, [productos, search, categoriaFiltro]);

  return (
    <section className="pg-section" id="productos">
      <div className="pg-container">

        {/* Encabezado */}
        <div className="pg-header">
          <h2 className="pg-title">
            Nuestra{" "}
            <span className="pg-title-accent">Colección</span>
          </h2>
          <p className="pg-subtitle">
            Descubre cada producto en detalle — haz click para explorar
          </p>
        </div>

        {/* Controles: búsqueda + categorías */}
        {!loading && !error && productos.length > 0 && (
          <div className="pg-controls">
            <div className="pg-search-wrap">
              <svg className="pg-search-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="pg-search"
                placeholder="Buscar por nombre, marca o categoría…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="pg-search-clear" onClick={() => setSearch("")} aria-label="Limpiar búsqueda">
                  ×
                </button>
              )}
            </div>

            <div className="pg-cats">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`pg-cat-btn${categoriaFiltro === cat ? " pg-cat-btn--active" : ""}`}
                  onClick={() => setCategoriaFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultados info */}
        {!loading && !error && productosFiltrados.length > 0 && (
          <p className="pg-results-count">
            {productosFiltrados.length} {productosFiltrados.length === 1 ? "producto" : "productos"}
            {(search || categoriaFiltro !== "Todos") ? " encontrados" : " en total"}
          </p>
        )}

        {/* Estados */}
        {loading && <LoadingSpinner mensaje="Cargando productos..." />}

        {error && !loading && (
          <div className="pg-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && productosFiltrados.length === 0 && (
          <div className="pg-empty">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="8" y="16" width="32" height="24" rx="3"/>
              <path d="M16 16v-4a8 8 0 0116 0v4"/>
              <line x1="20" y1="28" x2="28" y2="28"/>
            </svg>
            <p>No se encontraron productos{search ? ` para "${search}"` : ""}.</p>
            {(search || categoriaFiltro !== "Todos") && (
              <button className="pg-reset-btn" onClick={() => { setSearch(""); setCategoriaFiltro("Todos"); }}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && productosFiltrados.length > 0 && (
          <div className="pg-grid">
            {productosFiltrados.map(producto => (
              <ProductCard
                key={producto.id}
                producto={producto}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductsGrid;