import { useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

import { PedidosData } from "../../../../lib/data/pedidosData";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

// Estados válidos del backend
const ESTADOS_PEDIDO = [
  { value: "pendiente",      label: "Pendiente" },
  { value: "confirmado",     label: "Confirmado" },
  { value: "en_preparacion", label: "En preparación" },
  { value: "enviado",        label: "Enviado" },
  { value: "entregado",      label: "Entregado" },
  { value: "cancelado",      label: "Cancelado" },
];

const METODOS_PAGO = ["efectivo", "transferencia"];
const METODOS_ENTREGA = ["tienda", "domicilio"];

export default function PedidosForm({
  mode = "create",
  title = "Pedido",
  initialData = null,
  onCancel,
  onSubmit,
  onEdit,
  onPdf,
}) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";

  // ── Catálogos del backend ─────────────────────────────────────────────────
  const [clientes,  setClientes]  = useState([]);
  const [productos, setProductos] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // ── Abonos (solo en view) ─────────────────────────────────────────────────
  const [abonosInfo, setAbonosInfo] = useState(null); // { totalAbonado, saldoPendiente, abonos[] }

  // ── Formulario ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    cliente_id:              "",
    metodo_pago:             "efectivo",
    metodo_entrega:          "tienda",
    direccion_entrega:       "",
    transferencia_comprobante: "",
    estado:                  "pendiente",
  });

  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });

  const [saving, setSaving] = useState(false);

  // ── Cargar catálogos ──────────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const [cli, prod] = await Promise.all([
          PedidosData.getClientesActivos(),
          PedidosData.getProductosActivos(),
        ]);
        setClientes(cli);
        setProductos(prod);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
      } finally {
        setCatalogLoading(false);
      }
    };
    cargar();
  }, []);

  // ── Carga de datos iniciales (edit / view) ────────────────────────────────
  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente_id:              initialData.cliente_id ?? "",
        metodo_pago:             initialData.metodo_pago       ?? "efectivo",
        metodo_entrega:          initialData.metodo_entrega    ?? "tienda",
        direccion_entrega:       initialData.direccion_entrega ?? "",
        transferencia_comprobante: initialData.transferencia_comprobante ?? "",
        estado:                  initialData.estado            ?? "pendiente",
      });

      if (Array.isArray(initialData.items) && initialData.items.length > 0) {
        setItemsSeleccionados(initialData.items);
      }

      // Cargar abonos si es vista y el pedido ya fue entregado (tiene Venta en backend)
      if (isView && initialData.id && initialData.estado === "entregado") {
        PedidosData.getInfoAbonos(initialData.id, initialData.total ?? 0)
          .then((info) => {
            if (info.abonos.length > 0) {
              setAbonosInfo(info);
            }
          })
          .catch(() => {});
      }
    }
  }, [initialData]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatCurrency = (v) => `$${(v || 0).toLocaleString("es-CO")}`;

  const calcularTotal = () =>
    itemsSeleccionados.reduce((sum, item) => sum + (item.precio ?? 0) * item.cantidad, 0);

  // ── Manejo de ítems ───────────────────────────────────────────────────────
  const agregarItem = (producto) => {
    const existente = itemsSeleccionados.find((i) => i.producto_id === producto.id);
    if (existente) {
      setItemsSeleccionados(
        itemsSeleccionados.map((i) =>
          i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      setItemsSeleccionados([
        ...itemsSeleccionados,
        {
          producto_id: producto.id,
          nombre:      producto.nombre,
          descripcion: producto.descripcion,
          precio:      producto.precio,
          cantidad:    1,
          tipo:        "producto",
        },
      ]);
    }
  };

  const removerItem = (index) => {
    const nuevos = [...itemsSeleccionados];
    nuevos.splice(index, 1);
    setItemsSeleccionados(nuevos);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) { removerItem(index); return; }
    const nuevos = [...itemsSeleccionados];
    nuevos[index] = { ...nuevos[index], cantidad: nuevaCantidad };
    setItemsSeleccionados(nuevos);
  };

  // ── Guardar ───────────────────────────────────────────────────────────────
  const guardarPedido = async () => {
    if (!formData.cliente_id) {
      setNotification({ isVisible: true, message: "Por favor seleccione un cliente.", type: "error" });
      return;
    }
    if (isCreate && itemsSeleccionados.length === 0) {
      setNotification({ isVisible: true, message: "Por favor agregue al menos un producto.", type: "error" });
      return;
    }
    if (!formData.metodo_pago) {
      setNotification({ isVisible: true, message: "Por favor seleccione el método de pago.", type: "error" });
      return;
    }
    if (!formData.metodo_entrega) {
      setNotification({ isVisible: true, message: "Por favor seleccione el método de entrega.", type: "error" });
      return;
    }
    if (formData.metodo_entrega === "domicilio" && !formData.direccion_entrega.trim()) {
      setNotification({ isVisible: true, message: "Ingrese la dirección de entrega.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        items: itemsSeleccionados,
        total: calcularTotal(),
      };

      if (isEdit && initialData?.id) {
        await PedidosData.updatePedido(initialData.id, payload);
        setNotification({ isVisible: true, message: "Pedido actualizado correctamente.", type: "success" });
        if (onSubmit) onSubmit(payload);
      } else {
        await PedidosData.createPedido(payload);
        setNotification({ isVisible: true, message: "Pedido creado correctamente.", type: "success" });
        setTimeout(() => { if (onCancel) onCancel(); }, 1200);
      }
    } catch (error) {
      const msg = error?.response?.data?.error ?? "Error al guardar el pedido.";
      setNotification({ isVisible: true, message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Para vista: nombre del cliente
  const clienteNombreVisible =
    initialData?.cliente
    ?? clientes.find((c) => c.id === Number(formData.cliente_id))?.nombre
    ?? "";

  const mostrarTabla = itemsSeleccionados.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <BaseFormLayout title={title}>

        {/* INFORMACIÓN DEL PEDIDO */}
        <BaseFormSection title="Información del Pedido">

          {/* Cliente */}
          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Cliente"
                value={clienteNombreVisible}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.cliente_id}
                  label="Cliente"
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  disabled={catalogLoading}
                >
                  {catalogLoading ? (
                    <MenuItem disabled><em>Cargando clientes…</em></MenuItem>
                  ) : (
                    clientes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Método de pago */}
          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Método de Pago"
                value={formData.metodo_pago}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={formData.metodo_pago}
                  label="Método de Pago"
                  onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                >
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
              <TextField
                fullWidth
                label="Método de Entrega"
                value={formData.metodo_entrega}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Método de Entrega</InputLabel>
                <Select
                  value={formData.metodo_entrega}
                  label="Método de Entrega"
                  onChange={(e) => setFormData({ ...formData, metodo_entrega: e.target.value })}
                >
                  {METODOS_ENTREGA.map((m) => (
                    <MenuItem key={m} value={m} style={{ textTransform: "capitalize" }}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {/* Dirección de entrega (solo si es domicilio) */}
          {(formData.metodo_entrega === "domicilio" || (isView && formData.direccion_entrega)) && (
            <BaseFormField>
              <TextField
                fullWidth
                label="Dirección de Entrega"
                value={formData.direccion_entrega}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? (e) => setFormData({ ...formData, direccion_entrega: e.target.value }) : undefined}
                placeholder="Calle, barrio, ciudad…"
              />
            </BaseFormField>
          )}

          {/* Comprobante transferencia */}
          {(formData.metodo_pago === "transferencia" || (isView && formData.transferencia_comprobante)) && (
            <BaseFormField>
              <TextField
                fullWidth
                label="URL Comprobante de Transferencia"
                value={formData.transferencia_comprobante}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
                onChange={!isView ? (e) => setFormData({ ...formData, transferencia_comprobante: e.target.value }) : undefined}
                placeholder="https://..."
              />
            </BaseFormField>
          )}

          {/* Estado (solo en edit/view) */}
          {(isEdit || isView) && (
            <BaseFormField>
              {isView ? (
                <TextField
                  fullWidth
                  label="Estado"
                  value={PedidosData.getEstadoLabel(formData.estado)}
                  InputProps={{ readOnly: true, style: viewFieldStyle }}
                  InputLabelProps={{ shrink: true }}
                />
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    {ESTADOS_PEDIDO.map((e) => (
                      <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </BaseFormField>
          )}

          {/* Selector de productos (solo create/edit) */}
          {!isView && (
            <BaseFormField>
              <FormControl fullWidth>
                <InputLabel>Agregar Producto</InputLabel>
                <Select
                  value=""
                  label="Agregar Producto"
                  onChange={(e) => {
                    const prod = productos.find((p) => p.id === e.target.value);
                    if (prod) agregarItem(prod);
                  }}
                  disabled={catalogLoading || productos.length === 0}
                >
                  {catalogLoading ? (
                    <MenuItem disabled><em>Cargando productos…</em></MenuItem>
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
              {/* Tabla de ítems */}
              <div>
                {/* Cabecera */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isView ? "3fr 1fr 1.5fr 1.5fr" : "3fr 1fr 1.5fr 1.5fr 40px",
                  fontWeight: 600,
                  paddingBottom: 12,
                  borderBottom: "2px solid #e5e7eb",
                  textAlign: "center",
                  color: "#9ca3af",
                  userSelect: "none",
                }}>
                  <div style={{ textAlign: "left" }}>Producto</div>
                  <div>Cantidad</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Subtotal</div>
                  {!isView && <div />}
                </div>

                {/* Filas */}
                {itemsSeleccionados.map((item, index) => (
                  <div
                    key={item.producto_id || index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isView ? "3fr 1fr 1.5fr 1.5fr" : "3fr 1fr 1.5fr 1.5fr 40px",
                      padding: "14px 4px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: isView ? "#f3f4f6" : "transparent",
                      color: isView ? "#6b7280" : "inherit",
                      borderRadius: 6,
                      marginBottom: 2,
                    }}
                  >
                    <div style={{ textAlign: "left", fontWeight: 500 }}>{item.nombre}</div>

                    <div>
                      {!isView ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <button type="button" onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                            style={{ width: 22, height: 22, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>−</button>
                          <input type="number" value={item.cantidad}
                            onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                            style={{ width: 44, textAlign: "center", padding: "2px 4px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: "0.85rem" }}
                            min="1" />
                          <button type="button" onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                            style={{ width: 22, height: 22, background: "#e5e7eb", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>+</button>
                        </div>
                      ) : (
                        item.cantidad
                      )}
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
                ))}
              </div>

              {/* Panel totales */}
              <div style={{
                background: isView ? "#f3f4f6" : "#ffffff",
                borderRadius: 14, padding: 18,
                border: "1px solid #e5e7eb",
                height: "fit-content", fontSize: 14,
              }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: "#9ca3af" }}>Método de pago</span>
                  <strong style={{ float: "right", textTransform: "capitalize" }}>
                    {formData.metodo_pago || "—"}
                  </strong>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: "#9ca3af" }}>Entrega</span>
                  <strong style={{ float: "right", textTransform: "capitalize" }}>
                    {formData.metodo_entrega || "—"}
                  </strong>
                </div>

                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "2px solid #e5e7eb", fontSize: 15 }}>
                  <span style={{ color: "#9ca3af" }}>Total</span>
                  <strong style={{ float: "right", color: "#111827" }}>
                    {formatCurrency(calcularTotal())}
                  </strong>
                </div>

                {/* Abonos — solo en view cuando el pedido está entregado */}
                {isView && abonosInfo && (
                  <>
                    <div style={{ margin: "12px 0 0", borderTop: "2px solid #e5e7eb", paddingTop: 12 }}>
                      {/* Fila abonado */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "#9ca3af", fontSize: 13 }}>Abonado</span>
                        <strong style={{ color: "#10b981", fontSize: 13 }}>
                          {formatCurrency(abonosInfo.totalAbonado)}
                        </strong>
                      </div>
                      {/* Fila saldo */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ color: "#9ca3af", fontSize: 13 }}>Saldo pendiente</span>
                        <strong style={{
                          fontSize: 13,
                          color: abonosInfo.saldoPendiente <= 0 ? "#10b981" : "#ef4444",
                        }}>
                          {abonosInfo.saldoPendiente <= 0 ? "✓ Pagado" : formatCurrency(abonosInfo.saldoPendiente)}
                        </strong>
                      </div>

                      {/* Barra de progreso */}
                      {calcularTotal() > 0 && (() => {
                        const pct = Math.min(100, Math.round((abonosInfo.totalAbonado / calcularTotal()) * 100));
                        return (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#9ca3af", marginBottom: 4 }}>
                              <span>Progreso de pago</span>
                              <span>{pct}%</span>
                            </div>
                            <div style={{ background: "#e5e7eb", borderRadius: 99, height: 6, overflow: "hidden" }}>
                              <div style={{
                                width: `${pct}%`,
                                background: pct >= 100 ? "#10b981" : "#6366f1",
                                height: "100%", borderRadius: 99, transition: "width 0.4s",
                              }} />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Historial de abonos — grid de dos columnas */}
                      {abonosInfo.abonos.length > 0 && (
                        <div>
                          <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                            Historial
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                            {abonosInfo.abonos.map((a, i) => (
                              <div key={a.id} style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                borderRadius: 8,
                                padding: "6px 8px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
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
                  </>
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
              {onPdf && (
                <button className="crud-btn unified-btn-pdf" onClick={onPdf}>Generar PDF</button>
              )}
              {onEdit && (
                <button className="crud-btn crud-btn-primary" onClick={onEdit}>Editar</button>
              )}
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
        {...notification}
        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}