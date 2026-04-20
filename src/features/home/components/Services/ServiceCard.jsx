// ServiceCard.jsx
// Tarjeta de servicio con Material UI icons - sin emojis

import { useState } from "react";
import {
  Visibility,
  VisibilityOff,
  RemoveRedEye,
  Build,
  Search,
  Description,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";

// ── Función para obtener el icono según el servicio ────────────────────────────
const getServiceIcon = (nombre = "", color = "currentColor", fontSize = "20px") => {
  const lower = nombre.toLowerCase();
  const iconProps = { sx: { fontSize, color } };
  
  if (lower.includes("limpie") || lower.includes("lentes") || lower.includes("montura")) {
    return <Visibility {...iconProps} />;
  }
  if (lower.includes("ajuste") || lower.includes("reparaci") || lower.includes("arregl")) {
    return <Build {...iconProps} />;
  }
  if (lower.includes("contacto") || lower.includes("busqueda") || lower.includes("búsqueda")) {
    return <Search {...iconProps} />;
  }
  if (lower.includes("examen") || lower.includes("consulta")) {
    return <Description {...iconProps} />;
  }
  return <RemoveRedEye {...iconProps} />;
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

// Modal de alerta interno (sin emojis, con Material UI)
const AlertModal = ({ title, message, onClose }) => {
  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon" style={{ background: "#fee2e2", color: "#991b1b" }}>
          <span style={{ fontSize: "2rem" }}>!</span>
        </div>
        <h3>{title || "Atención"}</h3>
        <p>{message}</p>
        <button className="success-btn" onClick={onClose}>Entendido</button>
      </div>
    </div>
  );
};

const ServiceCard = ({ servicio, onAgendar, disabledMessage }) => {
  const [hovered, setHovered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAgendarClick = (e) => {
    e.stopPropagation();
    if (onAgendar) {
      onAgendar(servicio);
    } else {
      setShowAlert(true);
    }
  };

  const iconColor = hovered ? "#9ecfcf" : C.tealMid;
  const iconBg = hovered ? "rgba(255,255,255,0.10)" : "#eaf4f4";
  const iconBorder = hovered ? "1px solid rgba(255,255,255,0.14)" : `1px solid ${C.border}`;

  return (
    <>
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
          height: "220px",
          width: "100%",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Barra superior */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${C.tealMid}, ${C.tealLight})`,
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.28s ease",
          }}
        />

        {/* Fila: icono + nombre */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
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
            }}
          >
            {getServiceIcon(servicio.nombre, iconColor, "22px")}
          </div>

          <h3
            style={{
              fontSize: "0.92rem",
              fontWeight: "700",
              color: hovered ? "#ffffff" : C.text,
              margin: 0,
              lineHeight: "1.3",
              letterSpacing: "-0.01em",
              transition: "color 0.28s ease",
            }}
          >
            {servicio.nombre}
          </h3>
        </div>

        {/* Descripción */}
        <div style={{ flex: 1 }}>
          {servicio.descripcion && (
            <p
              style={{
                color: hovered ? "rgba(255,255,255,0.65)" : C.textLight,
                fontSize: "0.78rem",
                margin: 0,
                lineHeight: "1.6",
                transition: "color 0.28s ease",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {servicio.descripcion}
            </p>
          )}
        </div>

        {/* Footer: duración + precio + botón — siempre en una línea, sin wrap */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            paddingTop: "0.75rem",
            borderTop: hovered ? "1px solid rgba(255,255,255,0.10)" : "1px solid #eaf4f4",
            transition: "border-color 0.28s ease",
            flexWrap: "nowrap",
            minHeight: "36px",
          }}
        >
          {/* Duración */}
          <span
            style={{
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
              flexShrink: 0,
            }}
          >
            <AccessTime sx={{ fontSize: "11px", color: hovered ? "rgba(255,255,255,0.50)" : C.textLight }} />
            {servicio.duracion} min
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            {/* Precio */}
            <span
              style={{
                fontSize: "0.92rem",
                fontWeight: "800",
                color: hovered ? "#8dd4d4" : C.tealMid,
                transition: "color 0.28s ease",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {formatCurrency(servicio.precio)}
            </span>

            {/* Botón agendar — ocupa espacio siempre, solo se muestra en hover */}
            <button
              style={{
                padding: "0.3rem 0.65rem",
                background: hovered ? "rgba(255,255,255,0.10)" : "transparent",
                color: hovered ? "#ffffff" : "transparent",
                border: hovered ? "1px solid rgba(255,255,255,0.26)" : "1px solid transparent",
                borderRadius: "4px",
                fontSize: "0.68rem",
                fontWeight: "600",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: hovered ? "pointer" : "default",
                transition: "all 0.28s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                height: "26px",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                pointerEvents: hovered ? "auto" : "none",
              }}
              onClick={handleAgendarClick}
              onMouseEnter={(e) => {
                if (hovered) e.currentTarget.style.background = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                if (hovered) e.currentTarget.style.background = "rgba(255,255,255,0.10)";
              }}
            >
              <CalendarToday sx={{ fontSize: "11px", color: "#ffffff" }} />
              Agendar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de alerta */}
      {showAlert && (
        <AlertModal
          title="Atención"
          message={disabledMessage || "No puedes agendar citas en este momento. Inicia sesión como cliente."}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default ServiceCard;