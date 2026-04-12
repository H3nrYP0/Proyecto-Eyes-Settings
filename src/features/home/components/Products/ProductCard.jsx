// ProductCard.jsx
// Tarjeta de producto con flip 3D activado SOLO por el botón "Ver detalles".
// Cara delantera: imagen limpia (sin badge), nombre, precio, botones.
// Cara trasera: descripción del producto desde el backend.

import { useState, useCallback, useEffect } from "react";
import { getProductoById } from "../Services/productosLandingData";

// ─── helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (price) => {
  if (!price && price !== 0) return "Consultar";
  const num = Number(price);
  if (isNaN(num)) return "Consultar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(num);
};

const getStockStatus = (stock) => {
  if (!stock || stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "in";
};

const FALLBACK_EMOJI = "👓";

// ─── componente ───────────────────────────────────────────────────────────────
export default function ProductCard({ producto, onConsultar }) {
  const [flipped, setFlipped]           = useState(false);
  const [descripcion, setDescripcion]   = useState(producto?.descripcion || "");
  const [loadingDesc, setLoadingDesc]   = useState(false);

  // Carga la descripción completa desde el backend cuando se voltea por primera vez
  useEffect(() => {
    if (!flipped || descripcion) return; // ya tiene descripción, no volver a pedir
    if (!producto?.id) return;

    let cancelled = false;
    setLoadingDesc(true);

    getProductoById(producto.id)
      .then((data) => {
        if (!cancelled && data?.descripcion) {
          setDescripcion(data.descripcion);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingDesc(false);
      });

    return () => { cancelled = true; };
  }, [flipped, producto?.id]);

  const handleVerDetalles = useCallback((e) => {
    e.stopPropagation(); // no propagar al wrapper
    setFlipped(true);
  }, []);

  const handleVolver = useCallback((e) => {
    e.stopPropagation();
    setFlipped(false);
  }, []);

  const handleConsultar = useCallback((e) => {
    e.stopPropagation();
    if (onConsultar) onConsultar(producto);
  }, [onConsultar, producto]);

  if (!producto) return null;

  const {
    nombre      = "Producto",
    precioVenta = 0,
    stockActual = 0,
    categoria   = "",
    imagenes    = [],
    estado      = "activo",
  } = producto;

  const stockStatus   = getStockStatus(stockActual);
  const isActive      = estado === "activo" || estado === true;
  const disponible    = isActive && stockStatus !== "out";
  const primeraImagen = imagenes?.[0]?.url || null;

  return (
    <div className="product-card-flip-wrapper">
      <div className={`product-card-flip ${flipped ? "flipped" : ""}`}>

        {/* ════ CARA DELANTERA ════ */}
        <div className="flip-face flip-front">

          {/* Imagen — SIN badge encima */}
          <div className="product-image">
            {primeraImagen ? (
              <img src={primeraImagen} alt={nombre} />
            ) : (
              <span className="product-emoji">{FALLBACK_EMOJI}</span>
            )}
          </div>

          {/* Info */}
          <div className="product-basic-info">
            {categoria ? (
              <span className="product-category">{categoria}</span>
            ) : null}
            <p className="product-name">{nombre}</p>
          </div>

          {/* Footer: precio + botones */}
          <div className="product-price-section">
            <span className="product-price">{formatPrice(precioVenta)}</span>

            <div className="product-btns">
              {/* Ver detalles — activa el flip */}
              <button
                className="product-action-btn details"
                onClick={handleVerDetalles}
                aria-label={`Ver detalles de ${nombre}`}
              >
                Ver detalles
              </button>

              {/* Consultar — abre WhatsApp */}
              <button
                className={`product-action-btn ${disponible ? "available" : "sold-out"}`}
                onClick={handleConsultar}
                disabled={!disponible}
                aria-label={disponible ? `Consultar ${nombre}` : "Agotado"}
              >
                {disponible ? "Consultar" : "Agotado"}
              </button>
            </div>
          </div>
        </div>

        {/* ════ CARA TRASERA — solo descripción ════ */}
        <div className="flip-face flip-back">

          {/* Encabezado */}
          <div className="back-header">
            {categoria ? (
              <span className="back-product-category">{categoria}</span>
            ) : null}
            <p className="back-product-name">{nombre}</p>
            <div className="back-divider" />
          </div>

          {/* Descripción */}
          <div className="back-description-text">
            {loadingDesc ? (
              <span className="back-description-empty">Cargando descripción…</span>
            ) : descripcion && descripcion.trim() ? (
              descripcion
            ) : (
              <span className="back-description-empty">Sin descripción disponible.</span>
            )}
          </div>

          {/* Botón volver */}
          <button
            className="back-return-btn"
            onClick={handleVolver}
            aria-label="Volver"
          >
            ← Volver
          </button>
        </div>

      </div>
    </div>
  );
}