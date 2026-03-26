import React from "react";
import PropTypes from "prop-types";

const Loading = ({
  message = "Cargando...",
  minHeight = "300px",
  size = "50px",
  color = "#3498db"
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
        width: "100%",
        padding: "40px"
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "3px solid #f3f3f3",
          borderTop: `3px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px"
        }}
      />

      <p style={{ color: "#666", margin: 0 }}>
        {message}
      </p>

      <style>{`
        @keyframes spin {
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