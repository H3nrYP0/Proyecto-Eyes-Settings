import { useEffect, useState } from "react";
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

import { createPedido, updatePedido } from "../../../../lib/data/pedidosData";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

// Catálogo local de productos y servicios
const PRODUCTOS = [
  { id: 1, nombre: "Lentes de sol", descripcion: "Protección UV", precio: 120000, tipo: "producto" },
  { id: 2, nombre: "Armazón metálico", descripcion: "Color plateado", precio: 85000, tipo: "producto" },
  { id: 3, nombre: "Lentes progresivos", descripcion: "Alta definición", precio: 250000, tipo: "producto" },
  { id: 4, nombre: "Estuche para lentes", descripcion: "Cuero sintético", precio: 35000, tipo: "producto" },
];

const SERVICIOS = [
  { id: 5, nombre: "Consulta oftalmológica", descripcion: "Examen completo", precio: 50000, tipo: "servicio" },
  { id: 6, nombre: "Adaptación de lentes de contacto", descripcion: "Incluye enseñanza", precio: 75000, tipo: "servicio" },
  { id: 7, nombre: "Reparación de armazón", descripcion: "Soldadura y ajuste", precio: 30000, tipo: "servicio" },
  { id: 8, nombre: "Limpieza de lentes", descripcion: "Limpieza profesional", precio: 15000, tipo: "servicio" },
];

export default function PedidosForm({
  mode = "create",
  title = "Pedido",
  initialData = null,
  onCancel,
  onSubmit,
  onEdit,
  onPdf,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    cliente: "",
    fechaPedido: new Date().toISOString().split("T")[0],
    fechaEntrega: "",
    estado: "En proceso",
  });

  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });

  // =============================
  //        CARGA DE DATOS
  // =============================
  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente: initialData.cliente || "",
        fechaPedido: initialData.fechaPedido || new Date().toISOString().split("T")[0],
        fechaEntrega: initialData.fechaEntrega || "",
        estado: initialData.estado || "En proceso",
      });
      
      if (initialData.items && initialData.items.length > 0) {
        setItemsSeleccionados(initialData.items);
      } else {
        setItemsSeleccionados([]);
      }
    }
  }, [initialData]);

  const formatCurrency = (v) => `$${(v || 0).toLocaleString()}`;
  const formatDate = (d) => {
    if (!d) return "";
    if (d.includes("/")) return d;
    return new Date(d).toLocaleDateString("es-ES");
  };

  // =============================
  //       MANEJO DE ITEMS
  // =============================
  const agregarItem = (item) => {
    const existente = itemsSeleccionados.find((i) => i.id === item.id);
    if (existente) {
      setItemsSeleccionados(
        itemsSeleccionados.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      setItemsSeleccionados([...itemsSeleccionados, { ...item, cantidad: 1 }]);
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

  // =============================
  //          TOTALES
  // =============================
  const calcularTotal = () => {
    if (itemsSeleccionados.length > 0)
      return itemsSeleccionados.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    if (initialData) return initialData.total || 0;
    return 0;
  };

  const obtenerTipo = () => {
    if (itemsSeleccionados.length === 0) return initialData?.tipo || "Sin items";
    const tieneP = itemsSeleccionados.some((i) => i.tipo === "producto");
    const tieneS = itemsSeleccionados.some((i) => i.tipo === "servicio");
    if (tieneP && tieneS) return "Productos y Servicios";
    if (tieneS) return "Servicios";
    return "Productos";
  };

  // =============================
  //        GUARDAR
  // =============================
  const guardarPedido = () => {
    if (!formData.cliente.trim()) {
      setNotification({ isVisible: true, message: "Por favor ingrese el nombre del cliente.", type: "error" });
      return;
    }
    if (!isEdit && itemsSeleccionados.length === 0) {
      setNotification({ isVisible: true, message: "Por favor agregue al menos un producto o servicio.", type: "error" });
      return;
    }
    if (!formData.fechaPedido || !formData.fechaEntrega) {
      setNotification({ isVisible: true, message: "Por favor complete ambas fechas.", type: "error" });
      return;
    }

    const total = calcularTotal();

    const payload = {
      ...formData,
      tipo: obtenerTipo(),
      total,
      abono: initialData?.abono || 0,
      saldoPendiente: total - (initialData?.abono || 0),
      items: itemsSeleccionados.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        cantidad: item.cantidad,
        tipo: item.tipo,
      })),
    };

    if (isEdit && initialData?.id) {
      updatePedido(initialData.id, payload);
      if (onSubmit) onSubmit(payload);
      setNotification({ isVisible: true, message: "Pedido actualizado correctamente", type: "success" });
    } else {
      createPedido(payload);
      setNotification({ isVisible: true, message: "Pedido creado correctamente", type: "success" });
      if (onCancel) onCancel();
    }
  };

  // Datos de abono para mostrar
  const abonoActual = initialData?.abono || 0;
  const saldoPendiente = initialData?.saldoPendiente ?? (calcularTotal() - abonoActual);
  const porcentajePagado = calcularTotal() > 0 ? Math.round((abonoActual / calcularTotal()) * 100) : 0;

  // =============================
  //    ¿Hay items que mostrar?
  // =============================
  const mostrarTabla = itemsSeleccionados.length > 0;

  return (
    <>
      <BaseFormLayout title={title}>

        {/* INFORMACIÓN DEL PEDIDO */}
        <BaseFormSection title="Información del Pedido">

          {/* Cliente */}
          <BaseFormField>
            <TextField
              fullWidth
              label="Cliente"
              value={formData.cliente}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
              onChange={!isView ? (e) => setFormData({ ...formData, cliente: e.target.value }) : undefined}
            />
          </BaseFormField>

          {/* Fecha Pedido */}
          <BaseFormField>
            <TextField
              fullWidth
              type={isView ? "text" : "date"}
              label="Fecha Pedido"
              value={isView ? formatDate(formData.fechaPedido) : formData.fechaPedido}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
              onChange={!isView ? (e) => setFormData({ ...formData, fechaPedido: e.target.value }) : undefined}
            />
          </BaseFormField>

          {/* Fecha Entrega */}
          <BaseFormField>
            <TextField
              fullWidth
              type={isView ? "text" : "date"}
              label="Fecha Entrega"
              value={isView ? formatDate(formData.fechaEntrega) : formData.fechaEntrega}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: isView, style: isView ? viewFieldStyle : {} }}
              onChange={!isView ? (e) => setFormData({ ...formData, fechaEntrega: e.target.value }) : undefined}
            />
          </BaseFormField>

          {/* Estado */}
          {isView ? (
            <BaseFormField>
              <TextField
                fullWidth
                label="Estado"
                value={formData.estado}
                InputProps={{
                  readOnly: true,
                  style: {
                    ...viewFieldStyle,
                    color:
                      formData.estado === "Entregado" ? "#10b981"
                      : formData.estado === "Pagado" ? "#10b981"
                      : formData.estado === "Pendiente" ? "#f59e0b"
                      : "#6b7280",
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </BaseFormField>
          ) : (
            <BaseFormField>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <MenuItem value="En proceso">En proceso</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Pagado">Pagado</MenuItem>
                  <MenuItem value="Entregado">Entregado</MenuItem>
                </Select>
              </FormControl>
            </BaseFormField>
          )}

          {/* Selects de productos y servicios — en create Y en edit */}
          {!isView && (
            <>
              <BaseFormField>
                <FormControl fullWidth>
                  <InputLabel>Agregar Producto</InputLabel>
                  <Select
                    value=""
                    label="Agregar Producto"
                    onChange={(e) => {
                      const item = PRODUCTOS.find((p) => p.id === e.target.value);
                      if (item) agregarItem(item);
                    }}
                  >
                    {PRODUCTOS.map((p) => (
                      <MenuItem key={`prod-${p.id}`} value={p.id}>
                        {p.nombre} — {formatCurrency(p.precio)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </BaseFormField>

              <BaseFormField>
                <FormControl fullWidth>
                  <InputLabel>Agregar Servicio</InputLabel>
                  <Select
                    value=""
                    label="Agregar Servicio"
                    onChange={(e) => {
                      const item = SERVICIOS.find((s) => s.id === e.target.value);
                      if (item) agregarItem(item);
                    }}
                  >
                    {SERVICIOS.map((s) => (
                      <MenuItem key={`serv-${s.id}`} value={s.id}>
                        {s.nombre} — {formatCurrency(s.precio)}
                      </MenuItem>
                    ))}
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
              gridTemplateColumns: "1fr 240px",
              gap: 32,
              background: "#f9fafb",
              padding: 28,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
            }}>
              {/* TABLA */}
              <div>
                {/* Cabecera */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isView ? "3fr 1fr 1fr 1.5fr 1.5fr" : "3fr 1fr 1fr 1.5fr 1.5fr 40px",
                  fontWeight: 600,
                  paddingBottom: 12,
                  borderBottom: "2px solid #e5e7eb",
                  textAlign: "center",
                  color: "#9ca3af",
                  userSelect: "none",
                }}>
                  <div style={{ textAlign: "left" }}>Ítem</div>
                  <div>Tipo</div>
                  <div>Cantidad</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Total</div>
                  {!isView && <div />}
                </div>

                {/* Filas */}
                {itemsSeleccionados.map((item, index) => (
                  <div
                    key={item.id || index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isView ? "3fr 1fr 1fr 1.5fr 1.5fr" : "3fr 1fr 1fr 1.5fr 1.5fr 40px",
                      padding: "14px 12px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: isView ? "#f3f4f6" : "transparent",
                      color: isView ? "#6b7280" : "inherit",
                      borderRadius: 6,
                      marginBottom: 2,
                      userSelect: isView ? "none" : "auto",
                      pointerEvents: isView ? "none" : "auto",
                    }}
                  >
                    <div style={{ textAlign: "left", fontWeight: 500 }}>{item.nombre}</div>
                    <div>
                      <span style={{
                        fontSize: "0.75rem", padding: "2px 6px", borderRadius: 3,
                        background: item.tipo === "servicio" ? "#dcfce7" : "#dbeafe",
                        color: item.tipo === "servicio" ? "#166534" : "#1d4ed8",
                      }}>
                        {item.tipo === "servicio" ? "Servicio" : "Producto"}
                      </span>
                    </div>
                    <div>
                      {!isView ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <button type="button" onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                            style={{ width: 20, height: 20, background: "var(--gray-200)", border: "none", borderRadius: 3, cursor: "pointer", fontSize: "0.8rem" }}>-</button>
                          <input type="number" value={item.cantidad}
                            onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                            style={{ width: 40, textAlign: "center", padding: "2px 4px", border: "1px solid var(--gray-300)", borderRadius: 3, fontSize: "0.8rem" }}
                            min="1" />
                          <button type="button" onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                            style={{ width: 20, height: 20, background: "var(--gray-200)", border: "none", borderRadius: 3, cursor: "pointer", fontSize: "0.8rem" }}>+</button>
                        </div>
                      ) : (
                        item.cantidad
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>{formatCurrency(item.precio)}</div>
                    <div style={{ textAlign: "right", fontWeight: 600, color: isView ? "#6b7280" : "inherit" }}>
                      {formatCurrency(item.precio * item.cantidad)}
                    </div>
                    {!isView && (
                      <button type="button" className="crud-btn crud-btn-delete" onClick={() => removerItem(index)}>
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* PANEL TOTALES CON ABONOS */}
              <div style={{
                background: isView ? "#f3f4f6" : "#ffffff",
                borderRadius: 14, padding: 18,
                border: "1px solid #e5e7eb",
                height: "fit-content", fontSize: 14,
              }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: "#9ca3af" }}>Tipo</span>
                  <strong style={{ float: "right" }}>
                    {isView ? (initialData?.tipo || "—") : obtenerTipo()}
                  </strong>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <span style={{ color: "#9ca3af" }}>Total</span>
                  <strong style={{ float: "right" }}>
                    {formatCurrency(calcularTotal())}
                  </strong>
                </div>

                {/* Mostrar abonos solo en view y edit */}
                {(isView || isEdit) && (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ color: "#9ca3af" }}>Abonado</span>
                      <strong style={{ float: "right", color: "#10b981" }}>
                        {formatCurrency(abonoActual)}
                      </strong>
                    </div>

                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "2px solid #e5e7eb", fontSize: 15 }}>
                      <span style={{ color: "#9ca3af" }}>Saldo Pendiente</span>
                      <strong style={{
                        float: "right",
                        color: saldoPendiente > 0 ? "#ef4444" : "#10b981",
                      }}>
                        {formatCurrency(saldoPendiente)}
                      </strong>
                    </div>

                    {/* Barra de progreso de pago */}
                    {calcularTotal() > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ background: "#e5e7eb", borderRadius: 99, height: 6, overflow: "hidden" }}>
                          <div style={{
                            width: `${porcentajePagado}%`,
                            background: "#10b981",
                            height: "100%",
                            borderRadius: 99,
                            transition: "width 0.3s",
                          }} />
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>
                          {porcentajePagado}% pagado
                        </div>
                      </div>
                    )}
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
              saveLabel={isEdit ? "Actualizar Pedido" : "Guardar Pedido"}
              showSave
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