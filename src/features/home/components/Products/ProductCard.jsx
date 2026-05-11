// =============================================================
// ProductCard.jsx — Crossfade real + wishlist aislada
// Fix definitivo scroll: scroll síncrono antes de navegar
// =============================================================

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./ShoppingCart";

const formatPrice = (price) => {
  if (!price && price !== 0) return "Consultar";
  const num = Number(price);
  if (isNaN(num)) return "Consultar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(num);
};

const getStockStatus = (stock) => {
  if (!stock || stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "in";
};

export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useCart();

  const [hovered,   setHovered]   = useState(false);
  const [imgError1, setImgError1] = useState(false);
  const [imgError2, setImgError2] = useState(false);

  if (!producto) return null;

  const {
    id,
    nombre      = "Producto",
    precioVenta = 0,
    stockActual = 0,
    categoria   = "",
    marca       = "",
    imagenes    = [],
    estado      = "activo",
  } = producto;

  const stockStatus = getStockStatus(stockActual);
  const isActive    = estado === "activo" || estado === true;
  const disponible  = isActive && stockStatus !== "out";

  const img1 = imagenes?.[0]?.url || null;
  const img2 = imagenes?.[1]?.url || null;

  const showImg2 = hovered && img2 && !imgError2;

  const inWish = isInWishlist(id);

  const stockLabel =
    stockStatus === "out" ? "Agotado" :
    stockStatus === "low" ? `Últimas ${stockActual}` :
    "Disponible";

  // Wishlist: completamente aislado de la navegación
  const handleWishClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(producto);
  }, [producto, toggleWishlist]);

  // Función que fuerza scroll al top en TODOS los contenedores posibles
  // y luego navega. Se llama de forma síncrona antes del navigate.
  const irAlDetalle = useCallback(() => {
    // Resetear todos los posibles contenedores de scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Buscar cualquier contenedor con scroll activo y resetearlo
    const scrollables = document.querySelectorAll("*");
    scrollables.forEach((el) => {
      if (el.scrollTop > 0) el.scrollTop = 0;
    });
    navigate(`/productos/${id}`);
  }, [id, navigate]);

  const handleCardClick = useCallback((e) => {
    if (e.target.closest(".pc-wish-btn")) return;
    irAlDetalle();
  }, [irAlDetalle]);

  return (
    <article
      className={`pc-card${!disponible ? " pc-card--unavailable" : ""}`}
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter") irAlDetalle();
      }}
      aria-label={`Ver ${nombre}`}
    >
      <div className="pc-image-wrap">

        {img1 && !imgError1 ? (
          <img
            src={img1}
            alt={nombre}
            className={`pc-image pc-image--primary${showImg2 ? " pc-image--fade-out" : ""}${hovered && !showImg2 ? " pc-image--zoomed" : ""}`}
            onError={() => setImgError1(true)}
            draggable={false}
          />
        ) : (
          <div className="pc-placeholder">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="14" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="17" cy="22" r="3" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 32l10-8 7 6 5-4 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {img2 && !imgError2 && (
          <img
            src={img2}
            alt={`${nombre} — vista 2`}
            className={`pc-image pc-image--secondary${showImg2 ? " pc-image--fade-in pc-image--zoomed" : ""}`}
            onError={() => setImgError2(true)}
            draggable={false}
          />
        )}

        <button
          className={`pc-wish-btn${inWish ? " pc-wish-btn--active" : ""}`}
          onClick={handleWishClick}
          onMouseDown={e => e.stopPropagation()}
          aria-label={inWish ? "Quitar de lista de deseos" : "Añadir a lista de deseos"}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill={inWish ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="pc-body">
        {(marca || categoria) && (
          <p className="pc-meta">{[marca, categoria].filter(Boolean).join(" · ")}</p>
        )}
        <h3 className="pc-name">{nombre}</h3>
        <div className="pc-footer">
          <span className="pc-price">{formatPrice(precioVenta)}</span>
          <span className={`pc-stock pc-stock--${stockStatus}`}>{stockLabel}</span>
        </div>
      </div>
    </article>
  );
}