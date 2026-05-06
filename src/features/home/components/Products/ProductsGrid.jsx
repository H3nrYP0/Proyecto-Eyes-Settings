// =============================================================
// ProductsGrid.jsx
// =============================================================
// MIGRADO a React Query:
// - ['productos-landing'] — caché compartido con FeaturesSection
//   (si también migra, reutiliza los datos sin nueva petición)
// - staleTime: 10 min — productos del landing no cambian frecuente
// =============================================================

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { getAllProductosLanding } from "../Services/productosLandingData";

const ProductsGrid = () => {
  const [search, setSearch]                   = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  const { data: productos = [], isLoading, error } = useQuery({
    queryKey: ['productos-landing'],
    queryFn:  getAllProductosLanding,
    staleTime: 10 * 60 * 1000,   // 10 min — datos estables
    retry: 2,
  });

  // Categorías únicas derivadas de los datos
  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
    return ["Todos", ...cats];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const term = search.toLowerCase();
      const matchSearch = !search
        || p.nombre.toLowerCase().includes(term)
        || (p.marca     || "").toLowerCase().includes(term)
        || (p.categoria || "").toLowerCase().includes(term);
      const matchCat = categoriaFiltro === "Todos" || p.categoria === categoriaFiltro;
      return matchSearch && matchCat;
    });
  }, [productos, search, categoriaFiltro]);

  return (
    <section className="pg-section" id="productos">
      <div className="pg-container">

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
        {!isLoading && !error && productos.length > 0 && (
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

        {/* Contador de resultados */}
        {!isLoading && !error && productosFiltrados.length > 0 && (
          <p className="pg-results-count">
            {productosFiltrados.length}{" "}
            {productosFiltrados.length === 1 ? "producto" : "productos"}
            {(search || categoriaFiltro !== "Todos") ? " encontrados" : " en total"}
          </p>
        )}

        {/* Estados */}
        {isLoading && <LoadingSpinner mensaje="Cargando productos..." />}

        {error && !isLoading && (
          <div className="pg-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>No pudimos cargar los productos. Por favor intenta más tarde.</p>
          </div>
        )}

        {!isLoading && !error && productosFiltrados.length === 0 && (
          <div className="pg-empty">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="8" y="16" width="32" height="24" rx="3"/>
              <path d="M16 16v-4a8 8 0 0116 0v4"/>
              <line x1="20" y1="28" x2="28" y2="28"/>
            </svg>
            <p>No se encontraron productos{search ? ` para "${search}"` : ""}.</p>
            {(search || categoriaFiltro !== "Todos") && (
              <button
                className="pg-reset-btn"
                onClick={() => { setSearch(""); setCategoriaFiltro("Todos"); }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && productosFiltrados.length > 0 && (
          <div className="pg-grid">
            {productosFiltrados.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductsGrid;