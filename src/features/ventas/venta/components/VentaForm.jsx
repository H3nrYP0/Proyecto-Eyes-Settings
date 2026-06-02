import { useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import BaseFormLayout    from "@shared/components/base/BaseFormLayout";
import BaseFormSection   from "@shared/components/base/BaseFormSection";
import BaseFormField     from "@shared/components/base/BaseFormField";
import BaseFormActions   from "@shared/components/base/BaseFormActions";
import CrudNotification  from "@shared/styles/components/notifications/CrudNotification";
import { useVentaForm }  from "../hooks/useVentaForm";
import { COLORES_ESTADO_VENTA, getEstadoLabelVenta } from "../utils/ventasUtils";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

/* ── Visor readonly del comprobante ──────────────────────────────────────── */
function ComprobanteViewer({ url }) {
  if (!url) return (
    <div style={{
      background: "#f9fafb", border: "1px dashed #d1d5db",
      borderRadius: 10, padding: "24px 16px",
      textAlign: "center", color: "#9ca3af", fontSize: "0.85rem",
    }}>
      Sin comprobante adjunto
    </div>
  );

  const esImagen = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url) ||
    url.includes("cloudinary.com") || url.includes("res.cloudinary");

  if (esImagen) {
    return (
      <div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt="Comprobante"
            style={{
              width: "100%", maxHeight: 260, objectFit: "contain",
              borderRadius: 10, border: "1px solid #e5e7eb",
              display: "block", cursor: "pointer",
            }}
          />
        </a>
        <div style={{ marginTop: 6, textAlign: "right" }}>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#6366f1", textDecoration: "none" }}>
            <OpenInNewIcon style={{ fontSize: 13 }} /> Ver imagen completa
          </a>
        </div>
      </div>
    );
  }

  // URL plana (no imagen)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: "0.85rem", color: "#6366f1", wordBreak: "break-all" }}>
      🔗 {url}
    </a>
  );
}

/* ── Tabla de items reutilizable ─────────────────────────────────────────── */
function TablaItems({ items, editable, actualizarCantidad, removerItem, formatCurrency, calcularTotal, formData }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, marginTop: 8 }}>
      <div style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: editable ? "3fr 1fr 1.2fr 1.2fr 36px" : "3fr 1fr 1.2fr 1.2fr",
          padding: "10px 16px", background: "#f3f4f6",
          fontWeight: 700, fontSize: "0.75rem", color: "#9ca3af",
          textTransform: "uppercase", borderBottom: "1px solid #e5e7eb",
        }}>
          <div>Producto / Servicio</div>
          <div style={{ textAlign: "center" }}>Cant.</div>
          <div style={{ textAlign: "right" }}>Precio</div>
          <div style={{ textAlign: "right" }}>Subtotal</div>
          {editable && <div />}
        </div>

        {items.map((item, i) => {
          const nombre   = item.nombre_display ?? item.nombre ?? "—";
          const precio   = item.precio_unitario ?? item.precio ?? 0;
          const subtotal = item.subtotal ?? precio * item.cantidad;
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: editable ? "3fr 1fr 1.2fr 1.2fr 36px" : "3fr 1fr 1.2fr 1.2fr",
              padding: "10px 16px", alignItems: "center", fontSize: "0.9rem",
              borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none",
            }}>
              <div style={{ fontWeight: 500 }}>
                {nombre}
                {editable && item.stock !== null && (
                  <span style={{ color: "#9ca3af", fontSize: "0.7rem", marginLeft: 6 }}>(máx. {item.stock})</span>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                {editable ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                    <button type="button" onClick={() => actualizarCantidad(i, item.cantidad - 1)}
                      style={{ width: 20, height: 20, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>−</button>
                    <input type="number" value={item.cantidad}
                      onChange={(e) => actualizarCantidad(i, parseInt(e.target.value) || 1)}
                      style={{ width: 36, textAlign: "center", padding: "2px 4px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.82rem" }}
                      min="1" max={item.stock ?? undefined} />
                    <button type="button" onClick={() => actualizarCantidad(i, item.cantidad + 1)}
                      style={{ width: 20, height: 20, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>+</button>
                  </div>
                ) : item.cantidad}
              </div>
              <div style={{ textAlign: "right", color: "#6b7280" }}>{formatCurrency(precio)}</div>
              <div style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(subtotal)}</div>
              {editable && (
                <button type="button" onClick={() => removerItem(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1rem" }}>🗑️</button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16, height: "fit-content" }}>
        {editable ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
              <span style={{ color: "#9ca3af" }}>Pago</span>
              <strong style={{ textTransform: "capitalize" }}>{formData?.metodo_pago || "—"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
              <span style={{ color: "#9ca3af" }}>Entrega</span>
              <strong style={{ textTransform: "capitalize" }}>{formData?.metodo_entrega || "—"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 10, borderTop: "2px solid #e5e7eb", fontWeight: 700, fontSize: 15 }}>
              <span>Total</span>
              <span>{formatCurrency(calcularTotal())}</span>
            </div>
          </>
        ) : (
          <div style={{ fontWeight: 700, fontSize: 15, display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <span>{formatCurrency(items.reduce((s, i) => s + (i.subtotal ?? (i.precio_unitario ?? i.precio) * i.cantidad), 0))}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */
export default function VentaForm({ mode = "view", title = "Venta", initialData = null, onCancel, onSuccess }) {
  const {
    clientes, productos, servicios, catalogLoading, stockWarning,
    formData, setFormData,
    itemsSeleccionados, detalles, abonos,
    saving, notification, setNotification,
    isView, isCreate,
    clienteNombreVisible, mostrarTabla,
    agregarItem, removerItem, actualizarCantidad,
    crearVenta,
    calcularTotal, calcularTotalAbonado, saldoPendiente,
    formatCurrency,
    METODOS_PAGO, METODOS_ENTREGA,
  } = useVentaForm({ mode, initialData, onSuccess });

  useEffect(() => {
    if (notification.isVisible) {
      const t = setTimeout(() => setNotification((p) => ({ ...p, isVisible: false })), 5000);
      return () => clearTimeout(t);
    }
  }, [notification.isVisible, setNotification]);

  const totalAbonado = calcularTotalAbonado();
  const estadoInfo   = initialData ? COLORES_ESTADO_VENTA[initialData.estado] ?? { bg: "#f3f4f6", color: "#374151" } : null;

  // Mostrar comprobante en vista si existe (puede venir de pedido o de cita)
  const urlComprobante = initialData?.transferencia_comprobante ?? "";
  const tieneComprobante = !!urlComprobante;

  return (
    <>
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Venta">

          {/* Cliente */}
          <BaseFormField>
            {isCreate ? (
              <FormControl fullWidth disabled={catalogLoading}>
                <InputLabel>Cliente</InputLabel>
                <Select value={formData.cliente_id} label="Cliente *"
                  onChange={(e) => setFormData((p) => ({ ...p, cliente_id: e.target.value }))}>
                  {catalogLoading
                    ? <MenuItem disabled><em>Cargando clientes…</em></MenuItem>
                    : clientes.length === 0
                      ? <MenuItem disabled><em>No hay clientes activos</em></MenuItem>
                      : clientes.map((c) => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
                </Select>
              </FormControl>
            ) : (
              <TextField fullWidth label="Cliente"
                value={initialData?.cliente_nombre || "—"}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            )}
          </BaseFormField>

          {/* Fecha — solo view */}
          {isView && (
            <BaseFormField>
              <TextField fullWidth label="Fecha de Venta"
                value={initialData?.fecha_venta || "—"}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            </BaseFormField>
          )}

          {/* Método de pago */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Método de Pago"
                value={initialData?.metodo_pago || "—"}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select value={formData.metodo_pago} label="Método de Pago *"
                  onChange={(e) => setFormData((p) => ({ ...p, metodo_pago: e.target.value }))}>
                  {METODOS_PAGO.map((m) => (
                    <MenuItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de entrega */}
          <BaseFormField>
            {isView ? (
              <TextField fullWidth label="Método de Entrega"
                value={initialData?.metodo_entrega || "—"}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }} />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Entrega</InputLabel>
                <Select value={formData.metodo_entrega} label="Método de Entrega"
                  onChange={(e) => setFormData((p) => ({ ...p, metodo_entrega: e.target.value }))}>
                  {METODOS_ENTREGA.map((m) => (
                    <MenuItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Dirección domicilio */}
          {(formData.metodo_entrega === "domicilio" || (isView && initialData?.direccion_entrega)) && (
            <BaseFormField>
              <TextField fullWidth label="Dirección de Entrega"
                value={isView ? (initialData?.direccion_entrega || "—") : formData.direccion_entrega}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? (e) => setFormData((p) => ({ ...p, direccion_entrega: e.target.value })) : undefined}
                placeholder="Calle, barrio, ciudad…" />
            </BaseFormField>
          )}

          {/* Estado — solo view */}
          {isView && estadoInfo && (
            <BaseFormField>
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>
                  Estado
                </div>
                <span style={{
                  background: estadoInfo.bg, color: estadoInfo.color,
                  padding: "5px 14px", borderRadius: 99,
                  fontSize: "0.85rem", fontWeight: 600,
                }}>
                  {getEstadoLabelVenta(initialData.estado)}
                </span>
              </div>
            </BaseFormField>
          )}

          {/* ── COMPROBANTE — solo lectura, solo si existe ── */}
          {isView && tieneComprobante && (
            <BaseFormField fullWidth>
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 20, marginTop: 8 }}>
                <div style={{
                  fontSize: "0.72rem", color: "#9ca3af",
                  fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", marginBottom: 10,
                }}>
                  Comprobante de Transferencia
                </div>
                <ComprobanteViewer url={urlComprobante} />
              </div>
            </BaseFormField>
          )}

          {/* Selectores (solo crear) */}
          {isCreate && (
            <>
              <BaseFormField>
                <FormControl fullWidth disabled={catalogLoading || productos.length === 0}>
                  <InputLabel>Agregar Producto</InputLabel>
                  <Select value="" label="Agregar Producto"
                    onChange={(e) => {
                      const prod = productos.find((p) => p.id === e.target.value);
                      if (prod) agregarItem(prod);
                    }}>
                    {catalogLoading
                      ? <MenuItem disabled><em>Cargando…</em></MenuItem>
                      : productos.length === 0
                        ? <MenuItem disabled><em>Sin stock disponible</em></MenuItem>
                        : productos.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.nombre} — {formatCurrency(p.precio)}
                              <span style={{ color: "#9ca3af", fontSize: "0.8em", marginLeft: 6 }}>(stock: {p.stock})</span>
                            </MenuItem>
                          ))}
                  </Select>
                </FormControl>
              </BaseFormField>

              <BaseFormField>
                <FormControl fullWidth disabled={catalogLoading || servicios.length === 0}>
                  <InputLabel>Agregar Servicio</InputLabel>
                  <Select value="" label="Agregar Servicio"
                    onChange={(e) => {
                      const serv = servicios.find((s) => s.id === e.target.value);
                      if (serv) agregarItem(serv);
                    }}>
                    {catalogLoading
                      ? <MenuItem disabled><em>Cargando…</em></MenuItem>
                      : servicios.length === 0
                        ? <MenuItem disabled><em>No hay servicios activos</em></MenuItem>
                        : servicios.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.nombre} — {formatCurrency(s.precio)}
                            </MenuItem>
                          ))}
                  </Select>
                </FormControl>
              </BaseFormField>

              {stockWarning && (
                <div style={{
                  background: "#fef3c7", border: "1px solid #f59e0b",
                  borderRadius: 8, padding: "8px 14px",
                  fontSize: "0.85rem", color: "#92400e",
                }}>
                  ⚠️ {stockWarning}
                </div>
              )}
            </>
          )}
        </BaseFormSection>

        {/* Tabla items crear */}
        {isCreate && mostrarTabla && (
          <BaseFormSection title="Resumen de la Venta">
            <TablaItems
              items={itemsSeleccionados} editable
              actualizarCantidad={actualizarCantidad}
              removerItem={removerItem}
              formatCurrency={formatCurrency}
              calcularTotal={calcularTotal}
              formData={formData}
            />
          </BaseFormSection>
        )}

        {/* Tabla detalles view */}
        {isView && detalles.length > 0 && (
          <BaseFormSection title="Productos / Servicios">
            <TablaItems items={detalles} editable={false} formatCurrency={formatCurrency} calcularTotal={() => 0} />

            {abonos.length > 0 && (
              <div style={{ marginTop: 20, background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
                <div style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
                  Abonos
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: "0.68rem", color: "#166534", fontWeight: 600, marginBottom: 4 }}>ABONADO</div>
                    <div style={{ fontWeight: 700, color: "#16a34a" }}>{formatCurrency(totalAbonado)}</div>
                  </div>
                  <div style={{
                    flex: 1, borderRadius: 8, padding: "10px 12px",
                    background: saldoPendiente <= 0 ? "#f0fdf4" : "#fef2f2",
                    border: saldoPendiente <= 0 ? "1px solid #bbf7d0" : "1px solid #fecaca",
                  }}>
                    <div style={{ fontSize: "0.68rem", color: saldoPendiente <= 0 ? "#166534" : "#991b1b", fontWeight: 600, marginBottom: 4 }}>SALDO</div>
                    <div style={{ fontWeight: 700, color: saldoPendiente <= 0 ? "#16a34a" : "#dc2626" }}>
                      {saldoPendiente <= 0 ? "✓ Pagado" : formatCurrency(saldoPendiente)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {abonos.map((a, i) => (
                    <div key={a.id ?? i} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "6px 10px" }}>
                      <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                        #{i + 1} · {a.fecha ? new Date(a.fecha).toLocaleDateString("es-CO") : "—"}
                      </div>
                      <div style={{ fontWeight: 700, color: "#059669", fontSize: "0.85rem" }}>
                        {formatCurrency(a.monto_abonado)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </BaseFormSection>
        )}

        {/* Acciones */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36 }}>
          {isView ? (
            <button className="crud-btn crud-btn-secondary" onClick={onCancel}>Volver</button>
          ) : (
            <BaseFormActions
              onCancel={onCancel}
              onSave={crearVenta}
              saveLabel={saving ? "Guardando…" : "Registrar Venta"}
              showSave
              saveDisabled={saving}
            />
          )}
        </div>
      </BaseFormLayout>

      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification((p) => ({ ...p, isVisible: false }))}
      />
    </>
  );
}
