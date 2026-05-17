import { useDropzone } from "react-dropzone";
import { CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

/**
 * Dropzone de UNA imagen para el comprobante de transferencia.
 *
 * Props:
 *  preview    — string URL (blob o cloudinary)
 *  uploading  — boolean
 *  error      — string | null
 *  onDrop(files)
 *  onRemove()
 *  disabled   — boolean
 */
export default function ComprobanteDropzone({
  preview,
  uploading,
  error,
  onDrop,
  onRemove,
  disabled = false,
}) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png":  [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: disabled || uploading,
    noClick: !!preview,
  });

  return (
    <div style={{ width: "100%" }}>
      <div
        {...getRootProps()}
        style={{
          border: isDragActive
            ? "2px dashed #6366f1"
            : preview
              ? "2px solid #e5e7eb"
              : "2px dashed #d1d5db",
          borderRadius: 12,
          background: isDragActive ? "rgba(99,102,241,0.04)" : "#fafafa",
          overflow: "hidden",
          position: "relative",
          transition: "border 0.2s, background 0.2s",
          cursor: preview || disabled ? "default" : "pointer",
          minHeight: preview ? "auto" : 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input {...getInputProps()} />

        {/* ── Cargando ── */}
        {uploading && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.85)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
            borderRadius: 10, zIndex: 2,
          }}>
            <CircularProgress size={28} sx={{ color: "#6366f1" }} />
            <span style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: 500 }}>
              Subiendo comprobante…
            </span>
          </div>
        )}

        {/* ── Con preview ── */}
        {preview && !uploading && (
          <div style={{ width: "100%", position: "relative" }}
            onMouseEnter={(e) => {
              const ov = e.currentTarget.querySelector(".img-ov");
              if (ov) ov.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              const ov = e.currentTarget.querySelector(".img-ov");
              if (ov) ov.style.opacity = "0";
            }}
          >
            <img
              src={preview}
              alt="Comprobante"
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "contain",
                display: "block",
                borderRadius: 10,
              }}
            />

            {!disabled && (
              <div className="img-ov" style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                opacity: 0,
                transition: "opacity 0.2s",
                borderRadius: 10,
              }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); open(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff", border: "1px solid rgba(255,255,255,0.5)",
                    borderRadius: 8, padding: "8px 16px",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                  }}
                >
                  <SwapHorizIcon style={{ fontSize: 16 }} />
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#ef4444",
                    color: "#fff", border: "none",
                    borderRadius: 8, padding: "8px 16px",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                  }}
                >
                  <DeleteOutlineIcon style={{ fontSize: 16 }} />
                  Quitar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Sin preview ── */}
        {!preview && !uploading && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8, padding: "28px 16px",
          }}>
            <CloudUploadIcon style={{ fontSize: 42, color: "#9ca3af" }} />
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.88rem", fontWeight: 500 }}>
              {isDragActive
                ? "Suelta el comprobante aquí"
                : "Arrastra el comprobante o haz clic para seleccionar"}
            </p>
            <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.75rem" }}>
              JPG, PNG, WebP · máx. 5 MB
            </p>
          </div>
        )}
      </div>

      {/* ── Link ver imagen completa (solo si hay preview) ── */}
      {preview && !disabled && (
        <div style={{ marginTop: 6, textAlign: "right" }}>
          <a
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: "0.75rem", color: "#6366f1", textDecoration: "none",
            }}
          >
            <OpenInNewIcon style={{ fontSize: 13 }} />
            Ver imagen completa
          </a>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <p style={{
          margin: "6px 0 0", color: "#ef4444",
          fontSize: "0.8rem", textAlign: "left",
        }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}