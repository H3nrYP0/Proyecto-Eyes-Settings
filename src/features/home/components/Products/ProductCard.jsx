// ProductCard.jsx
// Tarjeta de producto para el Landing Page
// Recibe datos reales desde la API (estructura mapeada en productosLandingData.js)

import { useState } from "react";

const CATEGORY_ICONS = {
  default: "🕶️",
  "lentes": "🕶️",
  "montura": "👓",
  "contacto": "🔍",
  "accesorio": "✨",
  "sol": "☀️",
};

const getCategoryIcon = (categoria = "") => {
  const key = Object.keys(CATEGORY_ICONS).find(k =>
    categoria.toLowerCase().includes(k)
  );
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);

const ProductCard = ({ producto, onConsultar }) => {
  const [expanded, setExpanded] = useState(false);
  const inStock = producto.stockActual > 0;

  return (
    <div
      style={{
        background: '#ffffff',
        border: expanded ? '1px solid #2563eb' : '1px solid #e2e8f0',
        borderRadius: '1rem',
        padding: '1.75rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        boxShadow: expanded
          ? '0 12px 30px -6px rgba(37,99,235,0.15)'
          : '0 2px 8px -2px rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!expanded) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0,0,0,0.12)';
          e.currentTarget.style.borderColor = '#93c5fd';
        }
      }}
      onMouseLeave={e => {
        if (!expanded) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(0,0,0,0.06)';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }
      }}
      onClick={() => setExpanded(p => !p)}
    >
      {/* Barra superior de acento */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)',
        transform: expanded ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.3s ease',
        transformOrigin: 'left',
      }} />

      {/* Header de la tarjeta */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        {/* Imagen o icono */}
        <div style={{
          width: '72px', height: '72px',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          borderRadius: '0.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}>
          {producto.imagenPrincipal ? (
            <img
              src={producto.imagenPrincipal}
              alt={producto.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
          ) : null}
          <span style={{
            fontSize: '2rem',
            display: producto.imagenPrincipal ? 'none' : 'block',
          }}>
            {getCategoryIcon(producto.categoria || '')}
          </span>
        </div>

        {/* Info básica */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge de stock */}
          <span style={{
            display: 'inline-block',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            background: inStock ? '#dcfce7' : '#fee2e2',
            color: inStock ? '#166534' : '#dc2626',
            marginBottom: '0.4rem',
          }}>
            {inStock ? `${producto.stockActual} disponibles` : 'Agotado'}
          </span>

          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 0.3rem 0',
            lineHeight: '1.3',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {producto.nombre}
          </h3>

          {producto.descripcion && (
            <p style={{
              color: '#64748b',
              fontSize: '0.8rem',
              margin: 0,
              lineHeight: '1.5',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {producto.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Precio y acción */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '1rem',
      }}>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: '800',
          color: '#1e3a8a',
        }}>
          {formatCurrency(producto.precioVenta)}
        </span>

        <button
          style={{
            padding: '0.5rem 1.1rem',
            background: inStock
              ? 'linear-gradient(135deg, #1e3a8a, #2563eb)'
              : '#94a3b8',
            color: '#fff',
            border: 'none',
            borderRadius: '0.6rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: inStock ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
          disabled={!inStock}
          onClick={e => {
            e.stopPropagation();
            if (inStock && onConsultar) onConsultar(producto);
          }}
          onMouseEnter={e => {
            if (inStock) e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {inStock ? 'Consultar' : 'Agotado'}
        </button>
      </div>

      {/* Contenido expandido */}
      {expanded && producto.descripcion && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f1f5f9',
          animation: 'fadeInDown 0.25s ease',
        }}>
          <p style={{
            color: '#475569',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            margin: 0,
          }}>
            {producto.descripcion}
          </p>
          {producto.codigo && (
            <p style={{
              marginTop: '0.5rem',
              color: '#94a3b8',
              fontSize: '0.75rem',
            }}>
              Código: <strong style={{ color: '#64748b' }}>{producto.codigo}</strong>
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;