// ServiceCard.jsx
// Tarjeta de servicio para el Landing Page — minimalista y profesional
// Sin emojis — íconos SVG inline según categoría del servicio

import { useState } from "react";

// ── SVG Icons por categoría ────────────────────────────────────────────────────
const Icons = {
  eye: (color = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  glasses: (color = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="14" r="4"/>
      <circle cx="17" cy="14" r="4"/>
      <path d="M3 14c0-2 1-4 4-4m6 0c3 0 4 2 4 4M11 14h2"/>
      <path d="M1 10l2 4M23 10l-2 4"/>
    </svg>
  ),
  tool: (color = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  search: (color = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  clipboard: (color = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  calendar: (color = "currentColor") => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  clock: (color = "currentColor") => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

const getServiceIcon = (nombre = "", color = "currentColor") => {
  const lower = nombre.toLowerCase();
  if (lower.includes("limpie") || lower.includes("lentes") || lower.includes("montura")) return Icons.glasses(color);
  if (lower.includes("ajuste") || lower.includes("reparaci") || lower.includes("arregl")) return Icons.tool(color);
  if (lower.includes("contacto") || lower.includes("busqueda") || lower.includes("búsqueda")) return Icons.search(color);
  if (lower.includes("examen") || lower.includes("consulta")) return Icons.clipboard(color);
  return Icons.eye(color);
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);

// Paleta teal
const C = {
  tealDark:  "#0d2e2e",
  tealMid:   "#1a4a4a",
  tealLight: "#3d8080",
  border:    "#d4e6e6",
  softBg:    "#f3f8f8",
  text:      "#0c2222",
  textLight: "#4e6e6e",
};

const ServiceCard = ({ servicio, onAgendar }) => {
  const [hovered, setHovered] = useState(false);

  const iconColor  = hovered ? "#9ecfcf" : C.tealMid;
  const iconBg     = hovered ? "rgba(255,255,255,0.10)" : "#eaf4f4";
  const iconBorder = hovered ? "1px solid rgba(255,255,255,0.14)" : `1px solid ${C.border}`;

  return (
    <div
      style={{
        background: hovered
          ? `linear-gradient(145deg, ${C.tealDark} 0%, ${C.tealMid} 100%)`
          : "#ffffff",
        border: hovered ? `1px solid ${C.tealMid}` : `1px solid ${C.border}`,
        borderRadius: "0.875rem",
        padding: "1.35rem",
        cursor: "pointer",
        transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered
          ? "0 12px 28px -6px rgba(13,46,46,0.22)"
          : "0 1px 4px rgba(13,46,46,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        minHeight: "160px",
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
        height: "2px",
        background: `linear-gradient(90deg, ${C.tealMid}, ${C.tealLight})`,
        opacity: hovered ? 0 : 1,
        transition: "opacity 0.28s ease",
      }} />

      {/* Fila: icono SVG + nombre */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <div style={{
          width: "40px",
          height: "40px",
          background: iconBg,
          borderRadius: "0.6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: iconBorder,
          transition: "all 0.28s ease",
          flexShrink: 0,
        }}>
          {getServiceIcon(servicio.nombre, iconColor)}
        </div>

        <h3 style={{
          fontSize: "0.92rem",
          fontWeight: "700",
          color: hovered ? "#ffffff" : C.text,
          margin: 0,
          lineHeight: "1.3",
          letterSpacing: "-0.01em",
          transition: "color 0.28s ease",
        }}>
          {servicio.nombre}
        </h3>
      </div>

      {/* Descripción + espaciador flex */}
      <div style={{ flex: 1 }}>
        {servicio.descripcion && (
          <p style={{
            color: hovered ? "rgba(255,255,255,0.65)" : C.textLight,
            fontSize: "0.78rem",
            margin: 0,
            lineHeight: "1.6",
            transition: "color 0.28s ease",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {servicio.descripcion}
          </p>
        )}
      </div>

      {/* Footer: duración + precio + botón */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
        paddingTop: "0.75rem",
        borderTop: hovered
          ? "1px solid rgba(255,255,255,0.10)"
          : "1px solid #eaf4f4",
        transition: "border-color 0.28s ease",
        flexWrap: "wrap",
      }}>

        {/* Duración con icon SVG clock */}
        <span style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.2rem 0.55rem",
          borderRadius: "4px",
          fontSize: "0.7rem",
          fontWeight: "600",
          letterSpacing: "0.01em",
          background: hovered ? "rgba(255,255,255,0.08)" : C.softBg,
          color: hovered ? "rgba(255,255,255,0.60)" : C.textLight,
          border: hovered ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e0eeee",
          transition: "all 0.28s ease",
          whiteSpace: "nowrap",
        }}>
          {Icons.clock(hovered ? "rgba(255,255,255,0.50)" : C.textLight)}
          {servicio.duracion} min
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Precio */}
          <span style={{
            fontSize: "0.92rem",
            fontWeight: "800",
            color: hovered ? "#8dd4d4" : C.tealMid,
            transition: "color 0.28s ease",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}>
            {formatCurrency(servicio.precio)}
          </span>

          {/* Botón agendar — sin emoji, con icon SVG, aparece en hover */}
          <button
            style={{
              padding: hovered ? "0.3rem 0.65rem" : "0",
              background: hovered ? "rgba(255,255,255,0.10)" : "transparent",
              color: hovered ? "#ffffff" : "transparent",
              border: hovered
                ? "1px solid rgba(255,255,255,0.26)"
                : "1px solid transparent",
              borderRadius: "4px",
              fontSize: "0.68rem",
              fontWeight: "600",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.28s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              height: hovered ? "26px" : "0px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onAgendar) onAgendar(servicio);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.10)";
            }}
          >
            {Icons.calendar("#ffffff")}
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;