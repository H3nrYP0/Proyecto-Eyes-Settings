// =============================================================
// ProductsGrid.jsx
// ─ Grid de 3 columnas, tarjetas compactas
// ─ Imagen pequeña con object-fit:contain (foto completa)
// ─ Paginación: Anterior izq · números centro · Siguiente der
//   siempre visible aunque solo haya una página (oculta/disabled)
// =============================================================

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { getAllProductosLanding } from "../Services/productosLandingData";

const PRODUCTOS_POR_PAGINA = 9; // 3 × 3
const MAX_NUMS_VISIBLES    = 5;

function getNumeros(total, actual) {
  if (total <= MAX_NUMS_VISIBLES)
    return Array.from({ length: total }, (_, i) => i + 1);
  const half  = Math.floor(MAX_NUMS_VISIBLES / 2);
  let ini = Math.max(1, actual - half);
  let fin = ini + MAX_NUMS_VISIBLES - 1;
  if (fin > total) { fin = total; ini = Math.max(1, fin - MAX_NUMS_VISIBLES + 1); }
  return Array.from({ length: fin - ini + 1 }, (_, i) => ini + i);
}

const ProductsGrid = () => {
  const [search,    setSearch]    = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [pagina,    setPagina]    = useState(1);

  const { data: productos = [], isLoading, error } = useQuery({
    queryKey:  ["productos-landing"],
    queryFn:   getAllProductosLanding,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
    return ["Todos", ...cats];
  }, [productos]);

  const filtrados = useMemo(() => {
    const term = search.toLowerCase();
    return productos.filter(p => {
      const ok = !search
        || p.nombre.toLowerCase().includes(term)
        || (p.marca     || "").toLowerCase().includes(term)
        || (p.categoria || "").toLowerCase().includes(term);
      return ok && (categoria === "Todos" || p.categoria === categoria);
    });
  }, [productos, search, categoria]);

  const handleSearch = (v) => { setSearch(v);    setPagina(1); };
  const handleCat    = (c) => { setCategoria(c); setPagina(1); };

  const totalPags  = Math.max(1, Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA));
  const pag        = Math.min(pagina, totalPags);
  const slice      = filtrados.slice((pag - 1) * PRODUCTOS_POR_PAGINA, pag * PRODUCTOS_POR_PAGINA);
  const numeros    = getNumeros(totalPags, pag);
  const mostrarEli = totalPags > 1;  // paginador visible si hay más de 1 página

  const irA = (p) => {
    const dest = Math.max(1, Math.min(p, totalPags));
    setPagina(dest);
    const el = document.getElementById("productos");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="pg-section" id="productos">

      {/* ── Estilos encapsulados ─────────────────────────────── */}
      <style>{`
        /* ── Grid 3 columnas ── */
        .pg-grid--3col {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 1rem !important;
        }
        @media (max-width: 860px)  { .pg-grid--3col { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 520px)  { .pg-grid--3col { grid-template-columns: 1fr !important; } }

        /* ── Tarjeta compacta ── */
        .pg-grid--3col .pc-card {
          border-radius: .75rem;
          overflow: hidden;
          cursor: pointer;
          transition: transform .18s, box-shadow .18s;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          display: flex;
          flex-direction: column;
        }
        .pg-grid--3col .pc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,.35);
        }

        /* ── Zona de imagen pequeña ── */
        .pg-grid--3col .pc-image-wrap {
          position: relative;
          width: 100%;
          height: 140px;          /* altura fija reducida */
          overflow: hidden;
          background: rgba(255,255,255,.06);
          flex-shrink: 0;
        }

        /* Imagen completa, sin recortes */
        .pg-grid--3col .pc-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;    /* foto completa, sin cortar */
          object-position: center;
          transition: opacity .25s, transform .25s;
          padding: 6px;           /* pequeño margen para que "respire" */
          box-sizing: border-box;
        }
        .pg-grid--3col .pc-image--primary   { opacity: 1; }
        .pg-grid--3col .pc-image--fade-out  { opacity: 0; }
        .pg-grid--3col .pc-image--secondary { position: absolute; inset: 0; opacity: 0; }
        .pg-grid--3col .pc-image--fade-in   { opacity: 1; }
        .pg-grid--3col .pc-image--zoomed    { transform: scale(1.04); }

        /* Placeholder sin imagen */
        .pg-grid--3col .pc-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,.18);
        }
        .pg-grid--3col .pc-placeholder svg { width: 36px; height: 36px; }

        /* Botón wishlist pequeño */
        .pg-grid--3col .pc-wish-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: rgba(10,37,37,.7);
          backdrop-filter: blur(4px);
          color: rgba(255,255,255,.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color .15s, background .15s;
          padding: 0;
        }
        .pg-grid--3col .pc-wish-btn svg    { width: 13px; height: 13px; }
        .pg-grid--3col .pc-wish-btn:hover,
        .pg-grid--3col .pc-wish-btn--active { color: #e05252; background: rgba(10,37,37,.9); }

        /* ── Cuerpo de la tarjeta ── */
        .pg-grid--3col .pc-body {
          padding: .55rem .7rem .65rem;
          display: flex;
          flex-direction: column;
          gap: .2rem;
          flex: 1;
        }
        .pg-grid--3col .pc-meta {
          font-size: .6rem;
          color: rgba(255,255,255,.35);
          text-transform: uppercase;
          letter-spacing: .06em;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pg-grid--3col .pc-name {
          font-size: .78rem;
          font-weight: 700;
          color: rgba(255,255,255,.88);
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pg-grid--3col .pc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: .3rem;
        }
        .pg-grid--3col .pc-price {
          font-size: .82rem;
          font-weight: 800;
          color: #6aaeae;
          letter-spacing: -.01em;
        }
        .pg-grid--3col .pc-stock {
          font-size: .58rem;
          font-weight: 700;
          padding: .15rem .4rem;
          border-radius: 999px;
          letter-spacing: .04em;
        }
        .pg-grid--3col .pc-stock--in  { background: rgba(34,197,94,.12);  color: #4ade80; }
        .pg-grid--3col .pc-stock--low { background: rgba(251,191,36,.12); color: #fbbf24; }
        .pg-grid--3col .pc-stock--out { background: rgba(239,68,68,.1);  color: #f87171; }
        .pg-grid--3col .pc-card--unavailable { opacity: .55; }

        /* ── Paginación ── */
        .pg-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;   /* ← Anterior izq, Siguiente der */
          gap: .4rem;
          margin-top: 2.25rem;
          padding: 0 .25rem;
        }
        .pg-pag-center {
          display: flex;
          align-items: center;
          gap: .35rem;
          flex-wrap: wrap;
          justify-content: center;
          flex: 1;
        }

        /* Botón base */
        .pg-page-btn {
          min-width: 36px;
          height: 36px;
          padding: 0 .7rem;
          border-radius: .5rem;
          border: 1.5px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.04);
          color: rgba(255,255,255,.6);
          font-size: .78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .17s;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .3rem;
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pg-page-btn:hover:not(:disabled):not(.pg-page-btn--active) {
          background: rgba(61,128,128,.2);
          border-color: rgba(61,128,128,.55);
          color: #6aaeae;
          transform: translateY(-1px);
        }

        /* Número activo */
        .pg-page-btn--active {
          background: linear-gradient(135deg,#3d8080,#1a4a4a) !important;
          border-color: #3d8080 !important;
          color: #fff !important;
          box-shadow: 0 3px 12px rgba(61,128,128,.4);
          cursor: default;
          transform: translateY(-1px);
        }

        /* Nav Anterior / Siguiente — siempre visibles */
        .pg-page-btn--nav {
          min-width: unset;
          padding: 0 .9rem;
          border-color: rgba(255,255,255,.1);
        }
        .pg-page-btn--nav:disabled {
          opacity: .28;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Elipsis */
        .pg-page-ellipsis {
          color: rgba(255,255,255,.22);
          font-size: .85rem;
          padding: 0 .1rem;
          user-select: none;
          line-height: 36px;
        }

        /* Contador */
        .pg-results-page { color: rgba(255,255,255,.3); }
      `}</style>

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

        {/* Controles */}
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
                onChange={e => handleSearch(e.target.value)}
              />
              {search && (
                <button className="pg-search-clear" onClick={() => handleSearch("")} aria-label="Limpiar">×</button>
              )}
            </div>
            <div className="pg-cats">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`pg-cat-btn${categoria === cat ? " pg-cat-btn--active" : ""}`}
                  onClick={() => handleCat(cat)}
                >{cat}</button>
              ))}
            </div>
          </div>
        )}

        {/* Contador */}
        {!isLoading && !error && filtrados.length > 0 && (
          <p className="pg-results-count">
            {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
            {(search || categoria !== "Todos") ? " encontrados" : " en total"}
            {totalPags > 1 && (
              <span className="pg-results-page"> — página {pag} de {totalPags}</span>
            )}
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

        {!isLoading && !error && filtrados.length === 0 && (
          <div className="pg-empty">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="8" y="16" width="32" height="24" rx="3"/>
              <path d="M16 16v-4a8 8 0 0116 0v4"/>
              <line x1="20" y1="28" x2="28" y2="28"/>
            </svg>
            <p>No se encontraron productos{search ? ` para "${search}"` : ""}.</p>
            {(search || categoria !== "Todos") && (
              <button className="pg-reset-btn" onClick={() => { handleSearch(""); handleCat("Todos"); }}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Grid 3 columnas */}
        {!isLoading && !error && slice.length > 0 && (
          <div className="pg-grid pg-grid--3col">
            {slice.map(p => <ProductCard key={p.id} producto={p} />)}
          </div>
        )}

        {/* ── Paginación: Anterior | números | Siguiente ── */}
        {!isLoading && !error && filtrados.length > 0 && (
          <nav className="pg-pagination" aria-label="Navegación de páginas">

            {/* Anterior — extremo izquierdo */}
            <button
              className="pg-page-btn pg-page-btn--nav"
              onClick={() => irA(pag - 1)}
              disabled={pag === 1}
              aria-label="Página anterior"
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <polyline points="9 3 5 7 9 11"/>
              </svg>
              Anterior
            </button>

            {/* Números centrales */}
            <div className="pg-pag-center">
              {/* Primera página + elipsis izquierda */}
              {numeros[0] > 1 && (
                <>
                  <button className="pg-page-btn" onClick={() => irA(1)}>1</button>
                  {numeros[0] > 2 && <span className="pg-page-ellipsis">…</span>}
                </>
              )}

              {numeros.map(n => (
                <button
                  key={n}
                  className={`pg-page-btn${n === pag ? " pg-page-btn--active" : ""}`}
                  onClick={() => irA(n)}
                  aria-label={`Página ${n}`}
                  aria-current={n === pag ? "page" : undefined}
                >{n}</button>
              ))}

              {/* Elipsis derecha + última página */}
              {numeros[numeros.length - 1] < totalPags && (
                <>
                  {numeros[numeros.length - 1] < totalPags - 1 && (
                    <span className="pg-page-ellipsis">…</span>
                  )}
                  <button className="pg-page-btn" onClick={() => irA(totalPags)}>
                    {totalPags}
                  </button>
                </>
              )}
            </div>

            {/* Siguiente — extremo derecho */}
            <button
              className="pg-page-btn pg-page-btn--nav"
              onClick={() => irA(pag + 1)}
              disabled={pag === totalPags}
              aria-label="Página siguiente"
            >
              Siguiente
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <polyline points="5 3 9 7 5 11"/>
              </svg>
            </button>

          </nav>
        )}

      </div>
    </section>
  );
};

export default ProductsGrid;