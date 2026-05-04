// =============================================================
// ProductDetail.jsx
// UBICACIÓN: src/features/home/components/Products/ProductDetail.jsx
//
// Subpágina de detalle de producto estilo Farfetch.
// Ruta: /productos/:id
// Consume: GET /productos/:id + GET /imagenes/producto/:id
// Conecta con el carrito de compras (ShoppingCart).
// =============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductoById } from "../Services/productosLandingData";
import ShoppingCart, { useCart } from "./ShoppingCart";
import LoadingSpinner from "../Shared/LoadingSpinner";

const BASE_URL = "https://optica-api-vad8.onrender.com";

const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "Consultar precio";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(num);
};

// ─── Placeholder sin imagen ─────────────────────────────────
const ImagePlaceholder = () => (
  <div className="pd-img-placeholder">
    <svg viewBox="0 0 80 80" fill="none">
      <rect x="10" y="22" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="27" cy="36" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 52l17-14 11 10 8-7 24 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
    <p>Imagen no disponible</p>
  </div>
);

// ─── Componente principal ────────────────────────────────────
const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount, toggleCart } = useCart();

  const [producto, setProducto]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad]         = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgErrors, setImgErrors]       = useState({});

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProductoById(Number(id))
      .then(data => {
        if (!cancelled) {
          setProducto(data);
          setImagenActiva(0);
          setCantidad(1);
        }
      })
      .catch(err => {
        if (!cancelled) setError("No pudimos cargar este producto. Intenta más tarde.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const handleImgError = (idx) => setImgErrors(p => ({ ...p, [idx]: true }));

  const handleAddToCart = () => {
    if (!producto || producto.stockActual < 1) return;
    addToCart({ ...producto, cantidad });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleCantidadChange = (delta) => {
    setCantidad(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (producto && next > producto.stockActual) return producto.stockActual;
      return next;
    });
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-loading">
          <LoadingSpinner mensaje="Cargando producto…" />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !producto) {
    return (
      <div className="pd-page">
        <div className="pd-error-state">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="24" cy="24" r="20"/>
            <line x1="24" y1="16" x2="24" y2="24"/>
            <circle cx="24" cy="32" r="1" fill="currentColor"/>
          </svg>
          <h2>Producto no encontrado</h2>
          <p>{error || "Este producto no existe o fue eliminado."}</p>
          <button onClick={() => navigate("/productos")} className="pd-back-btn">
            ← Volver a productos
          </button>
        </div>
      </div>
    );
  }

  const {
    nombre       = "Producto",
    descripcion  = "",
    precioVenta  = 0,
    precioCompra = 0,
    stockActual  = 0,
    stockMinimo  = 0,
    categoria    = "",
    marca        = "",
    codigo       = "",
    imagenes     = [],
  } = producto;

  const disponible    = stockActual > 0;
  const stockBajo     = disponible && stockActual <= stockMinimo;
  const imagenesFiltradas = imagenes.filter(img => img?.url);
  const tieneImagenes = imagenesFiltradas.length > 0;

  return (
    <div className="pd-page">

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <button onClick={() => navigate("/")} className="pd-bread-link">Inicio</button>
        <span className="pd-bread-sep">›</span>
        <button onClick={() => navigate("/productos")} className="pd-bread-link">Productos</button>
        <span className="pd-bread-sep">›</span>
        <span className="pd-bread-current">{nombre}</span>
      </nav>

      {/* Layout principal */}
      <div className="pd-layout">

        {/* ─── Galería izquierda ─────────────────────────── */}
        <div className="pd-gallery">

          {/* Miniaturas verticales */}
          {tieneImagenes && imagenesFiltradas.length > 1 && (
            <div className="pd-thumbs">
              {imagenesFiltradas.map((img, idx) => (
                <button
                  key={idx}
                  className={`pd-thumb${imagenActiva === idx ? " pd-thumb--active" : ""}`}
                  onClick={() => setImagenActiva(idx)}
                  aria-label={`Ver imagen ${idx + 1}`}
                >
                  {imgErrors[idx] ? (
                    <div className="pd-thumb-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="7" width="18" height="14" rx="2"/>
                        <circle cx="8" cy="11" r="1.5" fill="currentColor"/>
                        <path d="M3 16l5-4 4 4 3-3 8 6" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={img.url}
                      alt={`Vista ${idx + 1}`}
                      onError={() => handleImgError(idx)}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Imagen principal */}
          <div className="pd-main-image-wrap">
            {tieneImagenes && !imgErrors[imagenActiva] ? (
              <img
                src={imagenesFiltradas[imagenActiva]?.url}
                alt={nombre}
                className="pd-main-image"
                onError={() => handleImgError(imagenActiva)}
              />
            ) : (
              <ImagePlaceholder />
            )}

            {/* Navegación de imagen si hay más de una */}
            {tieneImagenes && imagenesFiltradas.length > 1 && (
              <div className="pd-img-nav">
                <button
                  className="pd-img-arrow"
                  onClick={() => setImagenActiva(p => p === 0 ? imagenesFiltradas.length - 1 : p - 1)}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <span className="pd-img-counter">
                  {imagenActiva + 1} / {imagenesFiltradas.length}
                </span>
                <button
                  className="pd-img-arrow"
                  onClick={() => setImagenActiva(p => (p + 1) % imagenesFiltradas.length)}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Info derecha ──────────────────────────────── */}
        <div className="pd-info">

          {/* Meta: marca + categoria */}
          {(marca || categoria) && (
            <p className="pd-meta">
              {[marca, categoria].filter(Boolean).join(" · ")}
            </p>
          )}

          {/* Nombre */}
          <h1 className="pd-nombre">{nombre}</h1>

          {/* Código de referencia */}
          {codigo && (
            <p className="pd-codigo">Ref: {codigo}</p>
          )}

          {/* Precio */}
          <div className="pd-precio-wrap">
            <span className="pd-precio">{formatPrice(precioVenta)}</span>
          </div>

          {/* Disponibilidad */}
          <div className="pd-disponibilidad">
            {!disponible ? (
              <span className="pd-stock pd-stock--out">
                <span className="pd-stock-dot" />
                Agotado
              </span>
            ) : stockBajo ? (
              <span className="pd-stock pd-stock--low">
                <span className="pd-stock-dot" />
                Últimas {stockActual} unidades
              </span>
            ) : (
              <span className="pd-stock pd-stock--in">
                <span className="pd-stock-dot" />
                En stock ({stockActual} disponibles)
              </span>
            )}
          </div>

          {/* Separador */}
          <div className="pd-divider" />

          {/* Descripción */}
          {descripcion && (
            <div className="pd-descripcion">
              <h3 className="pd-descripcion-title">Descripción</h3>
              <p className="pd-descripcion-text">{descripcion}</p>
            </div>
          )}

          {/* Cantidad + Añadir al carrito */}
          {disponible && (
            <div className="pd-actions">
              {/* Selector de cantidad */}
              <div className="pd-cantidad-wrap">
                <span className="pd-cantidad-label">Cantidad</span>
                <div className="pd-cantidad-ctrl">
                  <button
                    className="pd-cantidad-btn"
                    onClick={() => handleCantidadChange(-1)}
                    disabled={cantidad <= 1}
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className="pd-cantidad-val">{cantidad}</span>
                  <button
                    className="pd-cantidad-btn"
                    onClick={() => handleCantidadChange(1)}
                    disabled={cantidad >= stockActual}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botón añadir al carrito */}
              <button
                className={`pd-add-btn${addedFeedback ? " pd-add-btn--added" : ""}`}
                onClick={handleAddToCart}
                disabled={!disponible}
              >
                {addedFeedback ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Añadido al carrito
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    Añadir al carrito
                  </>
                )}
              </button>

              {/* Ver carrito si hay items */}
              {cartCount > 0 && (
                <button className="pd-view-cart-btn" onClick={toggleCart}>
                  Ver carrito ({cartCount})
                </button>
              )}
            </div>
          )}

          {!disponible && (
            <div className="pd-agotado-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Este producto no está disponible actualmente.
            </div>
          )}

          {/* Ficha técnica */}
          <div className="pd-ficha">
            <h3 className="pd-ficha-title">Detalles del producto</h3>
            <dl className="pd-ficha-list">
              {marca && (
                <>
                  <dt>Marca</dt>
                  <dd>{marca}</dd>
                </>
              )}
              {categoria && (
                <>
                  <dt>Categoría</dt>
                  <dd>{categoria}</dd>
                </>
              )}
              {codigo && (
                <>
                  <dt>Referencia</dt>
                  <dd>{codigo}</dd>
                </>
              )}
              <dt>Disponibilidad</dt>
              <dd>{disponible ? `${stockActual} unidades` : "Sin stock"}</dd>
            </dl>
          </div>

        </div>
      </div>

      {/* Botón volver */}
      <div className="pd-bottom-nav">
        <button onClick={() => navigate("/productos")} className="pd-back-products">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver a productos
        </button>
      </div>

    </div>
  );
};

export default ProductDetail;