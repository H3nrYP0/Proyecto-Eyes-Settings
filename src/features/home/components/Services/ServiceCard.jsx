// ServiceCard.jsx
// Tarjeta de servicio para el Landing Page — compacta y bien espaciada
// Recibe datos reales desde la API (estructura mapeada en serviciosLandingData.js)

import { useState } from "react";

const SERVICE_ICONS = {
  default:  "👁️",
  optometr: "👁️",
  consulta: "🔬",
  lentes:   "🕶️",
  contacto: "🔍",
  ajuste:   "🔧",
  reparaci: "🔧",
  examen:   "📋",
  visual:   "👁️",
};

const getServiceIcon = (nombre = "") => {
  const lower = nombre.toLowerCase();
  const key = Object.keys(SERVICE_ICONS).find((k) => lower.includes(k));
  return SERVICE_ICONS[key] || SERVICE_ICONS.default;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);

// Paleta teal — sin azules hardcoded
const C = {
  tealDark:  "#0d2e2e",
  tealMid:   "#1a4a4a",
  tealLight: "#3d8080",
  tealSky:   "#6aaeae",
  border:    "#d4e6e6",
  softBg:    "#f3f8f8",
  text:      "#0c2222",
  textLight: "#4e6e6e",
};

const ServiceCard = ({ servicio, onAgendar }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${C.tealDark} 0%, ${C.tealMid} 100%)`
          : "#ffffff",
        border: hovered ? "1px solid transparent" : `1px solid ${C.border}`,
        borderRadius: "1rem",
        /* Padding reducido para tarjeta más compacta */
        padding: "1.25rem",
        cursor: "pointer",
        transition: "all 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered
          ? "0 14px 30px -6px rgba(13,46,46,0.28)"
          : "0 2px 6px -1px rgba(13,46,46,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        /* Altura fija: suficiente para que no sobre espacio */
        minHeight: "0",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Barra superior */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: `linear-gradient(90deg, ${C.tealMid}, ${C.tealLight})`,
        opacity: hovered ? 0 : 1,
        transition: "opacity 0.32s ease",
      }} />

      {/* Fila superior: icono + nombre */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        {/* Icono — más pequeño */}
        <div style={{
          width: "42px",
          height: "42px",
          background: hovered
            ? "rgba(255,255,255,0.14)"
            : `linear-gradient(135deg, #dff0f0, ${C.border})`,
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.35rem",
          border: hovered
            ? "1px solid rgba(255,255,255,0.18)"
            : `1px solid ${C.border}`,
          transition: "all 0.32s ease",
          flexShrink: 0,
        }}>
          {getServiceIcon(servicio.nombre)}
        </div>

        <h3 style={{
          fontSize: "0.95rem",
          fontWeight: "700",
          color: hovered ? "#ffffff" : C.text,
          margin: 0,
          lineHeight: "1.3",
          transition: "color 0.32s ease",
        }}>
          {servicio.nombre}
        </h3>
      </div>

      {/* Descripción */}
      {servicio.descripcion && (
        <p style={{
          color: hovered ? "rgba(255,255,255,0.82)" : C.textLight,
          fontSize: "0.8rem",
          margin: 0,
          lineHeight: "1.55",
          transition: "color 0.32s ease",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          flex: 1,
        }}>
          {servicio.descripcion}
        </p>
      )}

      {/* Footer: duración + precio + botón */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
        paddingTop: "0.6rem",
        borderTop: hovered
          ? "1px solid rgba(255,255,255,0.16)"
          : `1px solid ${C.softBg}`,
        transition: "border-color 0.32s ease",
        flexWrap: "wrap",
      }}>
        {/* Duración */}
        <span style={{
          padding: "0.22rem 0.6rem",
          borderRadius: "999px",
          fontSize: "0.7rem",
          fontWeight: "600",
          background: hovered ? "rgba(255,255,255,0.13)" : C.softBg,
          color: hovered ? "#c8eaea" : C.textLight,
          border: hovered
            ? "1px solid rgba(255,255,255,0.18)"
            : `1px solid ${C.border}`,
          transition: "all 0.32s ease",
          whiteSpace: "nowrap",
        }}>
          ⏱ {servicio.duracion} min
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Precio */}
          <span style={{
            fontSize: "0.95rem",
            fontWeight: "800",
            color: hovered ? C.tealSky : C.tealMid,
            transition: "color 0.32s ease",
            whiteSpace: "nowrap",
          }}>
            {formatCurrency(servicio.precio)}
          </span>

          {/* Botón agendar — compacto, aparece en hover */}
          <button
            style={{
              padding: hovered ? "0.35rem 0.75rem" : "0",
              background: hovered ? "#ffffff" : "transparent",
              color: hovered ? C.tealDark : "transparent",
              border: hovered
                ? `1.5px solid #ffffff`
                : "1.5px solid transparent",
              borderRadius: "0.6rem",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.32s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              height: hovered ? "30px" : "0px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onAgendar) onAgendar(servicio);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.softBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
          >
            📅 Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;