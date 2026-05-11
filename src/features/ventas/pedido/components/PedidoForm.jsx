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

const bannerStyle = (color, bg, border) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 8,
  padding: "10px 16px",
  marginBottom: 16,
  color,
  fontWeight: 600,
  fontSize: "0.9rem",
});

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
    clienteNombreVisible, mostrarTabla, stockWarning,
    pedidoAnulado, pedidoPagado,
    calcularTotal, formatCurrency,
    agregarItem, removerItem, actualizarCantidad, guardarPedido,
    ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA,
  } = usePedidoForm({ mode, initialData, onSuccess });

  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(
        () => setNotification({ ...notification, isVisible: false }),
        5000
      );
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    day: "2-digit", month: "long", year: "numeric",
  });

  // Bloquear edición si está anulado O pagado (un pedido pagado ya generó venta)
  const isDisabled = isView || pedidoAnulado || pedidoPagado || saving;

  return (
    <>
      <BaseFormLayout title={title}>

        {/* Banner anulado */}
        {pedidoAnulado && (
          <div style={bannerStyle("#991b1b", "#fee2e2", "#fecaca")}>
            🚫 Este pedido está anulado y no puede ser modificado.
          </div>
        )}

        {/* Banner pagado */}
        {pedidoPagado && !isView && (
          <div style={bannerStyle("#166534", "#dcfce7", "#bbf7d0")}>
            ✅ Este pedido está pagado. Ya generó una venta y no puede ser modificado.
          </div>
        )}

        <BaseFormSection title="Información del Pedido">

          {/* Fecha */}
          <BaseFormField>
            <TextField fullWidth label="Fecha del Pedido"
              value={
                isCreate ? fechaHoy
                : initialData?.fechaPedido
                  ? new Date(initialData.fechaPedido).toLocaleDateString("es-CO", {
                      day: "2-digit", month: "long", year: "numeric",
                    })
                  : fechaHoy
              }
              InputProps={{ readOnly: true, style: viewFieldStyle }}
              InputLabelProps={{ shrink: true }}
              helperText={isCreate ? "Se registra automáticamente al guardar" : ""}
            />
          </BaseFormField>

          {/* Cliente */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Cliente" value={clienteNombreVisible}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth disabled={isDisabled || catalogLoading}>
                <InputLabel>Cliente</InputLabel>
                <Select value={formData.cliente_id} label="Cliente"
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}>
                  {catalogLoading
                    ? <MenuItem disabled><em>Cargando…</em></MenuItem>
                    : clientes.length === 0
                      ? <MenuItem disabled><em>No hay clientes activos</em></MenuItem>
                      : clientes.map((c) => (
                          <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                        ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de pago */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Método de Pago"
                value={formData.metodo_pago?.charAt(0).toUpperCase() + formData.metodo_pago?.slice(1)}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>Método de Pago</InputLabel>
                <Select value={formData.metodo_pago} label="Método de Pago"
                  onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}>
                  {METODOS_PAGO.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de entrega */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Método de Entrega"
                value={formData.metodo_entrega?.charAt(0).toUpperCase() + formData.metodo_entrega?.slice(1)}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>Método de Entrega</InputLabel>
                <Select value={formData.metodo_entrega} label="Método de Entrega"
                  onChange={(e) => setFormData({ ...formData, metodo_entrega: e.target.value })}>
                  {METODOS_ENTREGA.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Dirección domicilio */}
          {(formData.metodo_entrega === "domicilio" || (isView && formData.direccion_entrega)) && (
            <BaseFormField>
              <TextField fullWidth label="Dirección de Entrega"
                value={formData.direccion_entrega}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isDisabled
                  ? (e) => setFormData({ ...formData, direccion_entrega: e.target.value })
                  : undefined}
                placeholder="Calle, barrio, ciudad…" />
            </BaseFormField>
          )}

          {/* Comprobante transferencia */}
          {(formData.metodo_pago === "transferencia" || (isView && formData.transferencia_comprobante)) && (
            <BaseFormField>
              <TextField fullWidth label="URL Comprobante de Transferencia"
                value={formData.transferencia_comprobante}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isDisabled
                  ? (e) => setFormData({ ...formData, transferencia_comprobante: e.target.value })
                  : undefined}
                placeholder="https://…" />
            </BaseFormField>
          )}

          {/* Estado (edit/view) */}
          {(isEdit || isView) && (
            <BaseFormField>
              {isView ? (
                <TextField fullWidth label="Estado"
                  value={ESTADOS_PEDIDO.find((e) => e.value === formData.estado)?.label || formData.estado}
                  InputProps={{ readOnly: true, style: viewFieldStyle }}
                  InputLabelProps={{ shrink: true }} />
              ) : (
                <FormControl fullWidth disabled={pedidoAnulado || pedidoPagado}>
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

          {/* Selector de productos (solo en crear/editar sobre pedidos pendientes) */}
          {!isView && !pedidoAnulado && !pedidoPagado && (
            <>
              <BaseFormField>
                <FormControl fullWidth disabled={catalogLoading || productos.length === 0}>
                  <InputLabel>Agregar Producto</InputLabel>
                  <Select value="" label="Agregar Producto"
                    onChange={(e) => {
                      const prod = productos.find((p) => p.id === e.target.value);
                      if (prod) agregarItem(prod);
                    }}>
                    {catalogLoading ? (
                      <MenuItem disabled><em>Cargando…</em></MenuItem>
                    ) : productos.length === 0 ? (
                      <MenuItem disabled><em>No hay productos con stock disponible</em></MenuItem>
                    ) : (
                      productos.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.nombre} — {formatCurrency(p.precio)}
                          <span style={{ color: "#9ca3af", fontSize: "0.82em", marginLeft: 6 }}>
                            (stock: {p.stock})
                          </span>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </BaseFormField>

              {/* Advertencia stock */}
              {stockWarning && (
                <div style={{
                  background: "#fef3c7", border: "1px solid #f59e0b",
                  borderRadius: 8, padding: "8px 14px", marginTop: 4,
                  fontSize: "0.85rem", color: "#92400e",
                }}>
                  ⚠️ {stockWarning}
                </div>
              )}
            </>
          )}

          {/* Abono inicial (solo crear) */}
          {isCreate && (
            <BaseFormField>
              <TextField fullWidth label="Abono inicial (opcional)"
                type="number"
                value={formData.abono_inicial}
                onChange={(e) => setFormData({ ...formData, abono_inicial: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
                helperText={
                  formData.abono_inicial &&
                  parseFloat(formData.abono_inicial) >= calcularTotal() &&
                  calcularTotal() > 0
                    ? "El pedido quedará como Pagado al guardar"
                    : "Abono que entrega el cliente al registrar el pedido"
                }
              />
            </BaseFormField>
          )}
        </BaseFormSection>

        {/* ── TABLA DE ITEMS ── */}
        {mostrarTabla && (
          <BaseFormSection title={isView ? "Ítems del Pedido" : "Resumen del Pedido"}>
            <div style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "1fr 220px",
              gap: 24,
              background: "#f9fafb",
              padding: 24,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
            }}>
              {/* Tabla items */}
              <div>
                {/* Cabecera */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isView ? "3fr 1fr 1.2fr 1.2fr" : "3fr 1fr 1.2fr 1.2fr 36px",
                  fontWeight: 600, paddingBottom: 10,
                  borderBottom: "2px solid #e5e7eb",
                  color: "#9ca3af", fontSize: "0.82rem", textAlign: "center",
                }}>
                  <div style={{ textAlign: "left" }}>Producto</div>
                  <div>Cant.</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Subtotal</div>
                  {!isView && <div />}
                </div>

                {/* Filas */}
                {itemsSeleccionados.map((item, index) => (
                  <div key={`${item.producto_id}-${index}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isView ? "3fr 1fr 1.2fr 1.2fr" : "3fr 1fr 1.2fr 1.2fr 36px",
                      padding: "10px 4px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      textAlign: "center",
                    }}>
                    <div style={{ textAlign: "left", fontWeight: 500 }}>
                      {item.nombre}
                      {!isView && item.stock !== null && (
                        <span style={{ color: "#9ca3af", fontSize: "0.72rem", marginLeft: 6 }}>
                          (máx. {item.stock})
                        </span>
                      )}
                    </div>

                    {/* Cantidad */}
                    <div>
                      {!isView && !pedidoAnulado && !pedidoPagado ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                          <button type="button"
                            onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                            style={{ width: 20, height: 20, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
                            −
                          </button>
                          <input type="number" value={item.cantidad}
                            onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                            style={{ width: 36, textAlign: "center", padding: "2px 4px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.82rem" }}
                            min="1" max={item.stock ?? undefined} />
                          <button type="button"
                            onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                            style={{ width: 20, height: 20, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
                            +
                          </button>
                        </div>
                      ) : item.cantidad}
                    </div>

                    <div style={{ textAlign: "right" }}>{formatCurrency(item.precio)}</div>
                    <div style={{ textAlign: "right", fontWeight: 600 }}>
                      {formatCurrency((item.precio ?? 0) * item.cantidad)}
                    </div>

                    {!isView && !pedidoAnulado && !pedidoPagado && (
                      <button type="button" onClick={() => removerItem(index)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1rem" }}>
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Panel totales */}
              <div style={{
                background: isView ? "#f3f4f6" : "#fff",
                borderRadius: 12, padding: 16,
                border: "1px solid #e5e7eb",
                height: "fit-content", fontSize: 14,
              }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "#9ca3af" }}>Pago</span>
                  <strong style={{ float: "right", textTransform: "capitalize" }}>
                    {formData.metodo_pago || "—"}
                  </strong>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "#9ca3af" }}>Entrega</span>
                  <strong style={{ float: "right", textTransform: "capitalize" }}>
                    {formData.metodo_entrega || "—"}
                  </strong>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "2px solid #e5e7eb", fontSize: 15 }}>
                  <span style={{ color: "#9ca3af" }}>Total</span>
                  <strong style={{ float: "right" }}>{formatCurrency(calcularTotal())}</strong>
                </div>

                {/* Preview abono inicial en crear */}
                {isCreate && formData.abono_inicial && parseFloat(formData.abono_inicial) > 0 && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#9ca3af" }}>Abono inicial</span>
                    <strong style={{ float: "right", color: "#10b981" }}>
                      {formatCurrency(parseFloat(formData.abono_inicial))}
                    </strong>
                    <br />
                    <span style={{ color: "#9ca3af" }}>Saldo</span>
                    <strong style={{
                      float: "right",
                      color: calcularTotal() - parseFloat(formData.abono_inicial) <= 0 ? "#10b981" : "#ef4444",
                    }}>
                      {calcularTotal() - parseFloat(formData.abono_inicial) <= 0
                        ? "✓ Pagado"
                        : formatCurrency(calcularTotal() - parseFloat(formData.abono_inicial))}
                    </strong>
                  </div>
                )}

                {/* Abonos en vista / edición */}
                {(isView || isEdit) && abonosInfo && (
                  <div style={{ marginTop: 10, borderTop: "2px solid #e5e7eb", paddingTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>Abonado</span>
                      <strong style={{ color: "#10b981", fontSize: 13 }}>
                        {formatCurrency(abonosInfo.totalAbonado)}
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>Saldo</span>
                      <strong style={{ fontSize: 13, color: abonosInfo.saldoPendiente <= 0 ? "#10b981" : "#ef4444" }}>
                        {abonosInfo.saldoPendiente <= 0 ? "✓ Pagado" : formatCurrency(abonosInfo.saldoPendiente)}
                      </strong>
                    </div>
                    {abonosInfo.abonos.length > 0 && (
                      <>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
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
                                #{i + 1} · {a.fecha
                                  ? new Date(a.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" })
                                  : "—"}
                              </span>
                              <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 700 }}>
                                {formatCurrency(a.monto_abonado)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </BaseFormSection>
        )}

        {/* ── ACCIONES ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36 }}>
          {isView ? (
            <div style={{ display: "flex", gap: 12 }}>
              <button className="crud-btn crud-btn-secondary" onClick={onCancel}>Volver</button>
              {onPdf && (
                <button className="crud-btn crud-btn-primary" onClick={onPdf}>
                  Generar PDF
                </button>
              )}
              {onEdit && !pedidoAnulado && !pedidoPagado && (
                <button className="crud-btn crud-btn-primary" onClick={onEdit}>Editar</button>
              )}
            </div>
          ) : (
            <BaseFormActions
              onCancel={onCancel}
              onSave={guardarPedido}
              saveLabel={saving ? "Guardando…" : "Guardar"}
              showSave={!pedidoAnulado && !pedidoPagado}
              saveDisabled={saving || pedidoAnulado || pedidoPagado}
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