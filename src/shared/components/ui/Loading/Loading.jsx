import React from "react";
import PropTypes from "prop-types";

const Loading = ({
  message = "Cargando...",
  minHeight = "220px",
  size = "48px",
  color = "#2563eb"
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
        width: "100%",
        padding: "24px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "3px solid #e5e7eb",
          borderTop: `3px solid ${color}`,
          borderRadius: "50%",
          animation: "shared-loading-spin 1s linear infinite",
          marginBottom: "16px"
        }}
      />

      <p style={{ color: "#475569", margin: 0, fontSize: "0.95rem", fontWeight: 500 }}>
        {message}
      </p>

      <style>{`
        @keyframes shared-loading-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  minHeight: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string
};

export default Loading;