// ServiceCard.jsx
// Tarjeta de servicio para el Landing Page
// Recibe datos reales desde la API (estructura mapeada en serviciosLandingData.js)

import { useState } from "react";

const SERVICE_ICONS = {
  default: "👁️",
  "optometr": "👁️",
  "consulta": "🔬",
  "lentes": "🕶️",
  "contacto": "🔍",
  "ajuste": "🔧",
  "reparaci": "🔧",
  "examen": "📋",
  "campaña": "🩺",
  "campaña": "🩺",
  "visual": "👁️",
};

const getServiceIcon = (nombre = "") => {
  const lower = nombre.toLowerCase();
  const key = Object.keys(SERVICE_ICONS).find(k => lower.includes(k));
  return SERVICE_ICONS[key] || SERVICE_ICONS.default;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);

const ServiceCard = ({ servicio, onAgendar }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: hovered
          ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
          : '#ffffff',
        border: hovered ? '1px solid transparent' : '1px solid #e2e8f0',
        borderRadius: '1.25rem',
        padding: '2rem',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered
          ? '0 20px 40px -8px rgba(37,99,235,0.3)'
          : '0 2px 8px -2px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: '220px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icono */}
      <div style={{
        width: '56px', height: '56px',
        background: hovered ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
        borderRadius: '0.875rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.75rem',
        border: hovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid #bfdbfe',
        transition: 'all 0.35s ease',
        flexShrink: 0,
      }}>
        {getServiceIcon(servicio.nombre)}
      </div>

      {/* Nombre y descripción */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          color: hovered ? '#ffffff' : '#1e293b',
          margin: '0 0 0.5rem 0',
          lineHeight: '1.3',
          transition: 'color 0.35s ease',
        }}>
          {servicio.nombre}
        </h3>
        {servicio.descripcion && (
          <p style={{
            color: hovered ? 'rgba(255,255,255,0.85)' : '#64748b',
            fontSize: '0.85rem',
            margin: 0,
            lineHeight: '1.6',
            transition: 'color 0.35s ease',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {servicio.descripcion}
          </p>
        )}
      </div>

      {/* Meta: duración y precio */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        paddingTop: '0.875rem',
        borderTop: hovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid #f1f5f9',
        transition: 'border-color 0.35s ease',
      }}>
        <span style={{
          padding: '0.3rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          background: hovered ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
          color: hovered ? '#e0f2fe' : '#475569',
          border: hovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e2e8f0',
          transition: 'all 0.35s ease',
          whiteSpace: 'nowrap',
        }}>
          ⏱ {servicio.duracion} min
        </span>

        <span style={{
          fontSize: '1.1rem',
          fontWeight: '800',
          color: hovered ? '#93c5fd' : '#1e3a8a',
          transition: 'color 0.35s ease',
          whiteSpace: 'nowrap',
        }}>
          {formatCurrency(servicio.precio)}
        </span>
      </div>

      {/* Botón de agendar (solo visible en hover) */}
      <button
        style={{
          padding: '0.6rem 1rem',
          background: hovered ? '#ffffff' : 'transparent',
          color: hovered ? '#1e3a8a' : 'transparent',
          border: hovered ? '2px solid #ffffff' : '2px solid transparent',
          borderRadius: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.35s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          height: hovered ? '40px' : '0px',
          overflow: 'hidden',
          padding: hovered ? '0.6rem 1rem' : '0',
        }}
        onClick={e => {
          e.stopPropagation();
          if (onAgendar) onAgendar(servicio);
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#dbeafe';
          e.currentTarget.style.color = '#1e3a8a';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#1e3a8a';
        }}
      >
        📅 Agendar cita
      </button>
    </div>
  );
};

export default ServiceCard;