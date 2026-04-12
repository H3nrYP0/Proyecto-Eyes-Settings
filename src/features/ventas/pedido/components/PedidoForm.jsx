import { useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { usePedidoForm } from "../hooks/usePedidoForm";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

export default function PedidoForm({
  mode = "create",
  title = "Pedido",
  initialData = null,
  onCancel,
  onSuccess,
  onEdit,
  onPdf,
}) {
  const {
    clientes, productos, catalogLoading,
    abonosInfo, formData, setFormData,
    itemsSeleccionados, notification, setNotification,
    saving, isView, isEdit, isCreate,
    clienteNombreVisible, mostrarTabla,
    calcularTotal, formatCurrency,
    agregarItem, removerItem, actualizarCantidad, guardarPedido,
    ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA,
  } = usePedidoForm({ mode, initialData, onSuccess });

  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  return (
    <>
      <BaseFormLayout title={title}>

        {/* INFORMACIÓN DEL PEDIDO */}
        <BaseFormSection title="Información del Pedido">

          {/* Cliente */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Cliente" value={clienteNombreVisible}
                InputProps={{ readOnly: true, style: viewFieldStyle }} InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select value={formData.cliente_id} label="Cliente"
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  disabled={catalogLoading}>
                  {catalogLoading
                    ? <MenuItem disabled><em>Cargando clientes…</em></MenuItem>
                    : clientes.map((c) => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)
                  }
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de pago */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Método de Pago" value={formData.metodo_pago}
                InputProps={{ readOnly: true, style: viewFieldStyle }} InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select value={formData.metodo_pago} label="Método de Pago"
                  onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}>
                  {METODOS_PAGO.map((m) => (
                    <MenuItem key={m} value={m} style={{ textTransform: "capitalize" }}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de entrega */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Método de Entrega" value={formData.metodo_entrega}
                InputProps={{ readOnly: true, style: viewFieldStyle }} InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Entrega</InputLabel>
                <Select value={formData.metodo_entrega} label="Método de Entrega"
                  onChange={(e) => setFormData({ ...formData, metodo_entrega: e.target.value })}>
                  {METODOS_ENTREGA.map((m) => (
                    <MenuItem key={m} value={m} style={{ textTransform: "capitalize" }}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Dirección (solo domicilio) */}
          {(formData.metodo_entrega === "domicilio" || (isView && formData.direccion_entrega)) && (
            <BaseFormField>
              <TextField fullWidth label="Dirección de Entrega" value={formData.direccion_entrega}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? (e) => setFormData({ ...formData, direccion_entrega: e.target.value }) : undefined}
                placeholder="Calle, barrio, ciudad…" />
            </BaseFormField>
          )}

          {/* Comprobante (solo transferencia) */}
          {(formData.metodo_pago === "transferencia" || (isView && formData.transferencia_comprobante)) && (
            <BaseFormField>
              <TextField fullWidth label="URL Comprobante de Transferencia" value={formData.transferencia_comprobante}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? (e) => setFormData({ ...formData, transferencia_comprobante: e.target.value }) : undefined}
                placeholder="https://…" />
            </BaseFormField>
          )}

          {/* Estado (edit/view) */}
          {(isEdit || isView) && (
            <BaseFormField>
              {isView ? (
                <TextField fullWidth label="Estado"
                  value={ESTADOS_PEDIDO.find(e => e.value === formData.estado)?.label || formData.estado}
                  InputProps={{ readOnly: true, style: viewFieldStyle }} InputLabelProps={{ shrink: true }} />
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select value={formData.estado} label="Estado"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                    {ESTADOS_PEDIDO.map((e) => (
                      <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </BaseFormField>
          )}

          {/* Selectores de productos y servicios (create/edit) */}
          {!isView && (
            <>
              <BaseFormField>
                <FormControl fullWidth>
                  <InputLabel>Agregar Producto</InputLabel>
                  <Select value="" label="Agregar Producto"
                    onChange={(e) => {
                      const prod = productos.find((p) => p.id === e.target.value);
                      if (prod) agregarItem(prod);
                    }}
                    disabled={catalogLoading || productos.length === 0}>
                    {catalogLoading ? (
                      <MenuItem disabled><em>Cargando…</em></MenuItem>
                    ) : productos.length === 0 ? (
                      <MenuItem disabled><em>No hay productos disponibles</em></MenuItem>
                    ) : (
                      productos.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.nombre} — {formatCurrency(p.precio)}
                          {p.stock !== undefined && ` (stock: ${p.stock})`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </BaseFormField>


            </>
          )}
        </BaseFormSection>

        {/* TABLA DE ÍTEMS + TOTALES */}
        {mostrarTabla && (
          <BaseFormSection title={isView ? "Ítems del Pedido" : "Resumen del Pedido"}>
            <div style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "1fr 200px",
              gap: 32,
              background: "#f9fafb",
              padding: 28,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
            }}>
              {/* Tabla */}
              <div>
                {/* Cabecera */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isView ? "3fr 1fr 1.5fr 1.5fr" : "3fr 1fr 1.5fr 1.5fr 40px",
                  fontWeight: 600, paddingBottom: 12,
                  borderBottom: "2px solid #e5e7eb",
                  textAlign: "center", color: "#9ca3af", userSelect: "none",
                }}>
                  <div style={{ textAlign: "left" }}>Producto</div>
                  <div>Cantidad</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Subtotal</div>
                  {!isView && <div />}
                </div>

                {/* Filas */}
                {itemsSeleccionados.map((item, index) => {
                  return (
                    <div key={`${item.tipo}-${item.producto_id ?? item.servicio_id}-${index}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isView ? "3fr 0.8fr 1fr 1.5fr 1.5fr" : "3fr 0.8fr 1fr 1.5fr 1.5fr 40px",
                        padding: "12px 4px", borderBottom: "1px solid #eee",
                        alignItems: "center", textAlign: "center",
                        backgroundColor: isView ? "#f3f4f6" : "transparent",
                        color: isView ? "#6b7280" : "inherit",
                        borderRadius: 6, marginBottom: 2,
                      }}>
                      <div style={{ textAlign: "left", fontWeight: 500 }}>{item.nombre}</div>

                      {/* Cantidad */}
                      <div>
                        {!isView ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <button type="button" onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                              style={{ width: 22, height: 22, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>−</button>
                            <input type="number" value={item.cantidad}
                              onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                              style={{ width: 40, textAlign: "center", padding: "2px 4px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.85rem" }}
                              min="1" />
                            <button type="button" onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                              style={{ width: 22, height: 22, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>+</button>
                          </div>
                        ) : item.cantidad}
                      </div>

                      <div style={{ textAlign: "right" }}>{formatCurrency(item.precio)}</div>
                      <div style={{ textAlign: "right", fontWeight: 600 }}>
                        {formatCurrency((item.precio ?? 0) * item.cantidad)}
                      </div>

                      {!isView && (
                        <button type="button" className="crud-btn crud-btn-delete"
                          onClick={() => removerItem(index)}
                          style={{ padding: "4px 6px", fontSize: "0.85rem" }}>
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Panel totales + abonos */}
              <div style={{
                background: isView ? "#f3f4f6" : "#ffffff",
                borderRadius: 14, padding: 18,
                border: "1px solid #e5e7eb",
                height: "fit-content", fontSize: 14,
              }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: "#9ca3af" }}>Método de pago</span>
                  <strong style={{ float: "right", textTransform: "capitalize" }}>{formData.metodo_pago || "—"}</strong>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: "#9ca3af" }}>Entrega</span>
                  <strong style={{ float: "right", textTransform: "capitalize" }}>{formData.metodo_entrega || "—"}</strong>
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "2px solid #e5e7eb", fontSize: 15 }}>
                  <span style={{ color: "#9ca3af" }}>Total</span>
                  <strong style={{ float: "right", color: "#111827" }}>{formatCurrency(calcularTotal())}</strong>
                </div>

                {/* Abonos — solo en view cuando el pedido está entregado */}
                {isView && abonosInfo && (
                  <div style={{ marginTop: 12, borderTop: "2px solid #e5e7eb", paddingTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>Abonado</span>
                      <strong style={{ color: "#10b981", fontSize: 13 }}>{formatCurrency(abonosInfo.totalAbonado)}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>Saldo pendiente</span>
                      <strong style={{ fontSize: 13, color: abonosInfo.saldoPendiente <= 0 ? "#10b981" : "#ef4444" }}>
                        {abonosInfo.saldoPendiente <= 0 ? "✓ Pagado" : formatCurrency(abonosInfo.saldoPendiente)}
                      </strong>
                    </div>

                    {abonosInfo.abonos.length > 0 && (
                      <div>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                          Historial
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                          {abonosInfo.abonos.map((a, i) => (
                            <div key={a.id} style={{
                              background: "#f0fdf4", border: "1px solid #bbf7d0",
                              borderRadius: 8, padding: "6px 8px",
                              display: "flex", flexDirection: "column", gap: 2,
                            }}>
                              <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                                #{i + 1} · {a.fecha ? new Date(a.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                              </span>
                              <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 700 }}>
                                {formatCurrency(a.monto_abonado)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </BaseFormSection>
        )}

        {/* ACCIONES */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 36 }}>
          {isView ? (
            <div style={{ display: "flex", gap: 12 }}>
              <button className="crud-btn crud-btn-secondary" onClick={onCancel}>Volver</button>
              {onPdf && <button className="crud-btn unified-btn-pdf" onClick={onPdf}>Generar PDF</button>}
              {onEdit && <button className="crud-btn crud-btn-primary" onClick={onEdit}>Editar</button>}
            </div>
          ) : (
            <BaseFormActions
              onCancel={onCancel}
              onSave={guardarPedido}
              saveLabel={saving ? "Guardando…" : isEdit ? "Actualizar Pedido" : "Guardar Pedido"}
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
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
}