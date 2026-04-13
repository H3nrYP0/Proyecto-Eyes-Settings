import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ventasService } from "../services/ventasService";
import {
  formatCurrency,
  COLORES_ESTADO_VENTA,
  getEstadoLabelVenta,
} from "../utils/ventasUtils";
import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";

const viewField = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: "0.95rem",
};

const sectionTitle = {
  fontSize: "0.75rem",
  color: "#9ca3af",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 12,
};

function Campo({ label, value }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={viewField}>{value || "—"}</div>
    </div>
  );
}

export default function DetalleVenta() {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const [venta, setVenta]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ventasService.getVentaById(Number(id))
      .then((data) => { setVenta(data); setLoading(false); })
      .catch(() => navigate(-1));
  }, [id, navigate]);

  if (loading) return <div style={{ padding: 40, color: "#9ca3af" }}>Cargando…</div>;
  if (!venta)  return null;

  const estilo = COLORES_ESTADO_VENTA[venta.estado] ?? { bg: "#f3f4f6", color: "#374151" };
  const totalAbonado = venta.abonos.reduce((s, a) => s + (a.monto_abonado ?? 0), 0);
  const { esCita } = venta;
  const tieneAbonos = venta.abonos.length > 0;
  const tieneDetalles = venta.detalles.length > 0;

  return (
    <BaseFormLayout title="Detalle de Venta">

      {/* INFO GENERAL */}
      <BaseFormSection title={esCita ? "Información de la Cita" : "Información de la Venta"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Campo label="Cliente"          value={venta.cliente_nombre} />
          <Campo label={esCita ? "Fecha de la Cita" : "Fecha de Venta"} value={venta.fecha_venta} />
          <Campo label="Método de Pago"   value={venta.metodo_pago} />
          {!esCita && venta.metodo_entrega && (
            <Campo label="Método de Entrega" value={venta.metodo_entrega} />
          )}
          {!esCita && venta.direccion_entrega && (
            <Campo label="Dirección de Entrega" value={venta.direccion_entrega} />
          )}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Estado
            </div>
            <span style={{
              background: estilo.bg, color: estilo.color,
              padding: "4px 12px", borderRadius: 99,
              fontSize: "0.85rem", fontWeight: 600,
            }}>
              {getEstadoLabelVenta(venta.estado)}
            </span>
          </div>
        </div>
      </BaseFormSection>

      {/* PRODUCTOS + ABONOS en dos columnas para aprovechar el ancho */}
      {(tieneDetalles || tieneAbonos) && (
        <div style={{
          display: "grid",
          gridTemplateColumns: tieneDetalles && tieneAbonos ? "1fr 1fr" : "1fr",
          gap: 20,
          marginTop: 8,
        }}>

          {/* COLUMNA IZQUIERDA: Productos / Servicio */}
          {tieneDetalles && (
            <div style={{
              background: "#f9fafb", borderRadius: 12,
              border: "1px solid #e5e7eb", overflow: "hidden",
            }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #e5e7eb" }}>
                <div style={sectionTitle}>{esCita ? "Servicio" : "Productos"}</div>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr",
                padding: "8px 16px", fontWeight: 600, fontSize: "0.75rem",
                color: "#9ca3af", borderBottom: "1px solid #e5e7eb",
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                <div>{esCita ? "Servicio" : "Producto"}</div>
                <div style={{ textAlign: "center" }}>Cant.</div>
                <div style={{ textAlign: "right" }}>Precio</div>
                <div style={{ textAlign: "right" }}>Subtotal</div>
              </div>
              {venta.detalles.map((item, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr",
                  padding: "10px 16px", fontSize: "0.88rem",
                  borderBottom: i < venta.detalles.length - 1 ? "1px solid #f3f4f6" : "none",
                  alignItems: "center",
                }}>
                  <div style={{ fontWeight: 500 }}>{item.nombre_display}</div>
                  <div style={{ textAlign: "center", color: "#6b7280" }}>{item.cantidad}</div>
                  <div style={{ textAlign: "right", color: "#6b7280" }}>{formatCurrency(item.precio_unitario ?? item.precio)}</div>
                  <div style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(item.subtotal)}</div>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between",
                padding: "12px 16px", fontWeight: 700, fontSize: "1rem",
                borderTop: "2px solid #e5e7eb", background: "#f3f4f6",
              }}>
                <span>Total</span>
                <span>{formatCurrency(venta.total)}</span>
              </div>
            </div>
          )}

          {/* COLUMNA DERECHA: Abonos */}
          {tieneAbonos && (
            <div style={{
              background: "#f9fafb", borderRadius: 12,
              border: "1px solid #e5e7eb", padding: 16,
            }}>
              <div style={sectionTitle}>Abonos</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>TOTAL</div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{formatCurrency(venta.total)}</div>
                </div>
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: "0.68rem", color: "#166534", fontWeight: 600, marginBottom: 4 }}>ABONADO</div>
                  <div style={{ fontWeight: 700, color: "#16a34a", fontSize: "0.9rem" }}>{formatCurrency(totalAbonado)}</div>
                </div>
                <div style={{
                  background: venta.saldo_pendiente <= 0 ? "#f0fdf4" : "#fef2f2",
                  borderRadius: 8, padding: "10px 12px",
                  border: venta.saldo_pendiente <= 0 ? "1px solid #bbf7d0" : "1px solid #fecaca",
                }}>
                  <div style={{ fontSize: "0.68rem", color: venta.saldo_pendiente <= 0 ? "#166534" : "#991b1b", fontWeight: 600, marginBottom: 4 }}>SALDO</div>
                  <div style={{ fontWeight: 700, color: venta.saldo_pendiente <= 0 ? "#16a34a" : "#dc2626", fontSize: "0.9rem" }}>
                    {venta.saldo_pendiente <= 0 ? "✓ Pagado" : formatCurrency(venta.saldo_pendiente)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Historial
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {venta.abonos.map((a, i) => (
                  <div key={a.id ?? i} style={{
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    borderRadius: 8, padding: "8px 10px",
                    display: "flex", flexDirection: "column", gap: 2,
                  }}>
                    <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                      #{i + 1} · {a.fecha
                        ? new Date(a.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" })
                        : "—"}
                    </span>
                    <span style={{ fontWeight: 700, color: "#059669", fontSize: "0.88rem" }}>
                      {formatCurrency(a.monto_abonado)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACCIONES */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36 }}>
        <button className="crud-btn crud-btn-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </BaseFormLayout>
  );
}