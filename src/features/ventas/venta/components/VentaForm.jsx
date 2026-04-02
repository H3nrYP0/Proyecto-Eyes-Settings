import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { useVentaForm } from "../hooks/useVentaForm";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

export default function VentaForm({
  mode = "view",
  title = "Venta",
  initialData = null,
  onCancel,
  onSuccess,
}) {
  const {
    formData,
    detalles,
    abonos,
    loading,
    saving,
    notification,
    setNotification,
    isView,
    isEdit,
    handleChange,
    guardarVenta,
    calcularTotalAbonado,
    saldoPendiente,
    formatCurrency,
    ESTADOS_VENTA,
    METODOS_PAGO,
    METODOS_ENTREGA,
  } = useVentaForm({
    mode,
    initialData,
    onSuccess,
  });

  if (loading) {
    return (
      <BaseFormLayout title={title}>
        <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Cargando...</div>
      </BaseFormLayout>
    );
  }

  return (
    <>
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Venta">
          {/* ID y Cliente */}
          <BaseFormField>
            <TextField
              fullWidth
              label="ID Venta"
              value={`V-${initialData?.id || ""}`}
              InputProps={{ readOnly: true, style: viewFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />
          </BaseFormField>

          <BaseFormField>
            <TextField
              fullWidth
              label="Cliente"
              value={initialData?.cliente_nombre || "—"}
              InputProps={{ readOnly: true, style: viewFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />
          </BaseFormField>

          <BaseFormField>
            <TextField
              fullWidth
              label="Fecha Venta"
              value={initialData?.fecha_venta || "—"}
              InputProps={{ readOnly: true, style: viewFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />
          </BaseFormField>

          {/* Método de Pago */}
          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Método de Pago"
                value={formData.metodo_pago || "—"}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={formData.metodo_pago}
                  label="Método de Pago"
                  onChange={handleChange}
                  name="metodo_pago"
                >
                  <MenuItem value="">— Seleccionar —</MenuItem>
                  {METODOS_PAGO.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de Entrega */}
          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Método de Entrega"
                value={formData.metodo_entrega || "—"}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Entrega</InputLabel>
                <Select
                  value={formData.metodo_entrega}
                  label="Método de Entrega"
                  onChange={handleChange}
                  name="metodo_entrega"
                >
                  <MenuItem value="">— Seleccionar —</MenuItem>
                  {METODOS_ENTREGA.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Dirección de Entrega */}
          {(formData.metodo_entrega === "domicilio" || (isView && formData.direccion_entrega)) && (
            <BaseFormField>
              <TextField
                fullWidth
                label="Dirección de Entrega"
                value={formData.direccion_entrega}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? handleChange : undefined}
                name="direccion_entrega"
                placeholder="Calle, barrio, ciudad…"
              />
            </BaseFormField>
          )}

          {/* Comprobante Transferencia */}
          {(formData.metodo_pago === "transferencia" || (isView && formData.transferencia_comprobante)) && (
            <BaseFormField>
              <TextField
                fullWidth
                label="URL Comprobante"
                value={formData.transferencia_comprobante}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? handleChange : undefined}
                name="transferencia_comprobante"
                placeholder="https://..."
              />
            </BaseFormField>
          )}

          {/* Total */}
          <BaseFormField>
            <TextField
              fullWidth
              label="Total"
              value={formatCurrency(formData.total)}
              InputProps={{ readOnly: true, style: viewFieldStyle }}
              InputLabelProps={{ shrink: true }}
            />
          </BaseFormField>

          {/* Estado */}
          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Estado"
                value={ESTADOS_VENTA.find(e => e.value === formData.estado)?.label || formData.estado}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={handleChange}
                  name="estado"
                >
                  {ESTADOS_VENTA.map((e) => (
                    <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>
        </BaseFormSection>

        {/* Detalles de productos */}
        {detalles.length > 0 && (
          <BaseFormSection title="Productos">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  <th style={{ padding: 8, textAlign: "left" }}>Producto</th>
                  <th style={{ padding: 8, textAlign: "center" }}>Cantidad</th>
                  <th style={{ padding: 8, textAlign: "right" }}>Precio</th>
                  <th style={{ padding: 8, textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8 }}>{item.producto_nombre || item.nombre || "—"}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>{item.cantidad}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{formatCurrency(item.precio_unitario || item.precio)}</td>
                    <td style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BaseFormSection>
        )}

        {/* Abonos */}
        {abonos.length > 0 && (
          <BaseFormSection title="Abonos">
            <div style={{
              background: "#f9fafb",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #e5e7eb",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>Total abonado:</span>
                <strong style={{ color: "#10b981" }}>{formatCurrency(calcularTotalAbonado())}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span>Saldo pendiente:</span>
                <strong style={{ color: saldoPendiente > 0 ? "#ef4444" : "#10b981" }}>
                  {saldoPendiente <= 0 ? "✓ Pagado" : formatCurrency(saldoPendiente)}
                </strong>
              </div>

              {saldoPendiente > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ background: "#e5e7eb", borderRadius: 99, height: 6, overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(100, Math.round((calcularTotalAbonado() / formData.total) * 100))}%`,
                      background: "#6366f1",
                      height: "100%",
                      borderRadius: 99,
                      transition: "width 0.4s",
                    }} />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600, marginBottom: 8 }}>
                  HISTORIAL DE ABONOS
                </div>
                {abonos.map((a, i) => (
                  <div key={a.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: i < abonos.length - 1 ? "1px solid #e5e7eb" : "none",
                  }}>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      #{i + 1} · {a.fecha ? new Date(a.fecha).toLocaleDateString("es-CO") : "—"}
                    </span>
                    <span style={{ color: "#10b981", fontWeight: 600 }}>+{formatCurrency(a.monto_abonado)}</span>
                  </div>
                ))}
              </div>
            </div>
          </BaseFormSection>
        )}

        {/* Acciones */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36 }}>
          {isView ? (
            <div style={{ display: "flex", gap: 12 }}>
              <button className="crud-btn crud-btn-secondary" onClick={onCancel}>Volver</button>
              {onSuccess && (
                <button className="crud-btn crud-btn-primary" onClick={() => onSuccess()}>Editar</button>
              )}
            </div>
          ) : (
            <BaseFormActions
              onCancel={onCancel}
              onSave={guardarVenta}
              saveLabel={saving ? "Guardando…" : "Guardar Cambios"}
              showSave
              disabled={saving}
            />
          )}
        </div>
      </BaseFormLayout>

      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}