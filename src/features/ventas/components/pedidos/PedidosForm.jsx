import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { createPedido } from "../../../../lib/data/pedidosData";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",    
  userSelect: "none",
};

export default function PedidosForm({
  mode = "create",
  title = "Crear Pedido",
  initialData = null,
  onCancel,
  onSubmit,
  onEdit,
  onPdf,
}) {
  const navigate = useNavigate();
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarServicios, setMostrarServicios] = useState(false);

  const [formData, setFormData] = useState({
    cliente: "",
    fechaPedido: new Date().toISOString().split("T")[0],
    fechaEntrega: "",
    estado: "En proceso",
  });

  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // =============================
  //        CARGA DE DATOS
  // =============================
  useEffect(() => {
    try {
      const productosEjemplo = [
        { id: 1, nombre: "Lentes de sol", descripcion: "Protección UV", precio: 120000, tipo: "producto" },
        { id: 2, nombre: "Armazón metálico", descripcion: "Color plateado", precio: 85000, tipo: "producto" },
        { id: 3, nombre: "Lentes progresivos", descripcion: "Alta definición", precio: 250000, tipo: "producto" },
        { id: 4, nombre: "Estuche para lentes", descripcion: "Cuero sintético", precio: 35000, tipo: "producto" },
      ];

      const serviciosEjemplo = [
        { id: 5, nombre: "Consulta oftalmológica", descripcion: "Examen completo", precio: 50000, tipo: "servicio" },
        { id: 6, nombre: "Adaptación de lentes de contacto", descripcion: "Incluye enseñanza", precio: 75000, tipo: "servicio" },
        { id: 7, nombre: "Reparación de armazón", descripcion: "Soldadura y ajuste", precio: 30000, tipo: "servicio" },
        { id: 8, nombre: "Limpieza de lentes", descripcion: "Limpieza profesional", precio: 15000, tipo: "servicio" },
      ];

      setProductos(productosEjemplo);
      setServicios(serviciosEjemplo);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setLoading(false);
    }

    if (initialData) {
      setFormData({
        cliente: initialData.cliente || "",
        fechaPedido: initialData.fechaPedido || new Date().toISOString().split("T")[0],
        fechaEntrega: initialData.fechaEntrega || "",
        estado: initialData.estado || "En proceso",
      });
      setItemsSeleccionados(initialData.items || []);
    }
  }, [initialData]);

  const formatCurrency = (v) => `$${v.toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-ES");

  // =============================
  //       MANEJO DE ITEMS
  // =============================
  const agregarItem = (item) => {
    const itemExistente = itemsSeleccionados.find((i) => i.id === item.id);
    if (itemExistente) {
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
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems.splice(index, 1);
    setItemsSeleccionados(nuevosItems);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerItem(index);
      return;
    }
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems[index].cantidad = nuevaCantidad;
    setItemsSeleccionados(nuevosItems);
  };

  // =============================
  //          TOTALES
  // =============================
  const calcularTotal = () => {
    if (isView && initialData) return initialData.total || 0;
    return itemsSeleccionados.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
  };

  const obtenerTipoPedido = () => {
    const tieneProductos = itemsSeleccionados.some((i) => i.tipo === "producto");
    const tieneServicios = itemsSeleccionados.some((i) => i.tipo === "servicio");
    if (tieneProductos && tieneServicios) return "Productos y Servicios";
    if (tieneProductos) return "Productos";
    if (tieneServicios) return "Servicios";
    return "Sin items";
  };

  // =============================
  //        GUARDAR PEDIDO
  // =============================
  const guardarPedido = () => {
    if (!formData.cliente.trim()) {
      setNotification({ isVisible: true, message: "Por favor ingrese el nombre del cliente", type: "error" });
      return;
    }
    if (itemsSeleccionados.length === 0) {
      setNotification({ isVisible: true, message: "Por favor agregue al menos un producto/servicio", type: "error" });
      return;
    }
    if (!formData.fechaPedido || !formData.fechaEntrega) {
      setNotification({ isVisible: true, message: "Por favor complete ambas fechas", type: "error" });
      return;
    }

    const total = calcularTotal();
    const payload = {
      ...formData,
      tipo: obtenerTipoPedido(),
      total,
      abono: 0,
      saldoPendiente: total,
      items: itemsSeleccionados.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        cantidad: item.cantidad,
        tipo: item.tipo,
      })),
    };

    if (isEdit && onSubmit) {
      onSubmit(payload);
    } else {
      createPedido(payload);
      if (onCancel) onCancel();
    }
  };

  if (loading && !isView) {
    return (
      <BaseFormLayout title={title}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          Cargando productos y servicios...
        </div>
      </BaseFormLayout>
    );
  }

  return (
    <>
      <BaseFormLayout title={title}>

        {/* INFORMACIÓN BÁSICA */}
        <BaseFormSection title="Información del Pedido">
          <BaseFormField>
            <TextField
              fullWidth
              label="Cliente"
              name="cliente"
              value={formData.cliente}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: isView,
                style: isView ? viewFieldStyle : {},
              }}
              onChange={
                !isView
                  ? (e) => setFormData({ ...formData, cliente: e.target.value })
                  : undefined
              }
            />
          </BaseFormField>

          <BaseFormField>
            <TextField
              fullWidth
              type={isView ? "text" : "date"}
              label="Fecha Pedido"
              value={isView ? formatDate(formData.fechaPedido) : formData.fechaPedido}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: isView,
                style: isView ? viewFieldStyle : {},
              }}
              onChange={
                !isView
                  ? (e) => setFormData({ ...formData, fechaPedido: e.target.value })
                  : undefined
              }
            />
          </BaseFormField>

          <BaseFormField>
            <TextField
              fullWidth
              type={isView ? "text" : "date"}
              label="Fecha Entrega"
              value={isView ? formatDate(formData.fechaEntrega) : formData.fechaEntrega}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: isView,
                style: isView ? viewFieldStyle : {},
              }}
              onChange={
                !isView
                  ? (e) => setFormData({ ...formData, fechaEntrega: e.target.value })
                  : undefined
              }
            />
          </BaseFormField>

          {!isView ? (
            <BaseFormField>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  label="Estado"
                >
                  <MenuItem value="En proceso">En proceso</MenuItem>
                  <MenuItem value="Pendiente pago">Pendiente pago</MenuItem>
                  <MenuItem value="Pagado">Pagado</MenuItem>
                  <MenuItem value="Entregado">Entregado</MenuItem>
                </Select>
              </FormControl>
            </BaseFormField>
          ) : (
            <BaseFormField>
              <TextField
                fullWidth
                label="Estado"
                value={initialData?.estado || ""}
                InputProps={{
                  readOnly: true,
                  style: {
                    backgroundColor: "#f3f4f6",
                    color:
                      initialData?.estado === "Entregado"
                        ? "#10b981"
                        : initialData?.estado === "Pendiente pago"
                        ? "#f59e0b"
                        : "#6b7280",
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </BaseFormField>
          )}
        </BaseFormSection>

        {/* ACORDEONES DE ITEMS — solo en create y edit */}
        {!isView && (
          <BaseFormSection title="Seleccionar Items">
            <div style={{ width: "100%" }}>

              {/* Contador */}
              <div style={{ fontSize: "0.8rem", color: "var(--gray-600)", marginBottom: "12px" }}>
                {productos.length}p • {servicios.length}s
              </div>

              {/* Acordeón productos */}
              <div style={{ marginBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => setMostrarProductos(!mostrarProductos)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "white",
                    border: "1px solid var(--gray-300)",
                    borderRadius: "5px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "var(--gray-800)",
                  }}
                >
                  <span>Productos ({productos.length})</span>
                  <span>{mostrarProductos ? "▲" : "▼"}</span>
                </button>

                {mostrarProductos && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "8px",
                      background: "white",
                      borderRadius: "4px",
                      border: "1px solid var(--gray-200)",
                    }}
                  >
                    {productos.map((item) => (
                      <div
                        key={`producto-${item.id}`}
                        onClick={() => agregarItem(item)}
                        style={{
                          padding: "8px",
                          border: "1px solid var(--gray-200)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--gray-200)")}
                      >
                        <div style={{ fontWeight: "600", color: "var(--gray-800)", marginBottom: "4px" }}>
                          {item.nombre}
                        </div>
                        <div style={{ color: "var(--gray-600)", fontSize: "0.75rem", marginBottom: "4px" }}>
                          {item.descripcion}
                        </div>
                        <div style={{ fontWeight: "600", color: "var(--primary-color)", fontSize: "0.9rem" }}>
                          {formatCurrency(item.precio)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Acordeón servicios */}
              <div>
                <button
                  type="button"
                  onClick={() => setMostrarServicios(!mostrarServicios)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "white",
                    border: "1px solid var(--gray-300)",
                    borderRadius: "5px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "var(--gray-800)",
                  }}
                >
                  <span>Servicios ({servicios.length})</span>
                  <span>{mostrarServicios ? "▲" : "▼"}</span>
                </button>

                {mostrarServicios && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "8px",
                      background: "white",
                      borderRadius: "4px",
                      border: "1px solid var(--gray-200)",
                    }}
                  >
                    {servicios.map((item) => (
                      <div
                        key={`servicio-${item.id}`}
                        onClick={() => agregarItem(item)}
                        style={{
                          padding: "8px",
                          border: "1px solid var(--gray-200)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--gray-200)")}
                      >
                        <div style={{ fontWeight: "600", color: "var(--gray-800)", marginBottom: "4px" }}>
                          {item.nombre}
                        </div>
                        <div style={{ color: "var(--gray-600)", fontSize: "0.75rem", marginBottom: "4px" }}>
                          {item.descripcion}
                        </div>
                        <div style={{ fontWeight: "600", color: "var(--primary-color)", fontSize: "0.9rem" }}>
                          {formatCurrency(item.precio)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </BaseFormSection>
        )}

        {/* TABLA DE ÍTEMS SELECCIONADOS + TOTALES */}
        {(isView ? (initialData?.items?.length > 0) : itemsSeleccionados.length > 0) && (
          <BaseFormSection title={isView ? "Ítems del Pedido" : "Resumen del Pedido"}>
            <div
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: "1fr 240px",
                gap: 32,
                background: "#f9fafb",
                padding: 28,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
              }}
            >
              {/* TABLA */}
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isView
                      ? "3fr 1fr 1fr 1.5fr 1.5fr"
                      : "3fr 1fr 1fr 1.5fr 1.5fr 40px",
                    fontWeight: 600,
                    paddingBottom: 12,
                    borderBottom: "2px solid #e5e7eb",
                    textAlign: "center",
                    color: isView ? "#9ca3af" : "inherit",
                    userSelect: isView ? "none" : "auto",
                  }}
                >
                  <div style={{ textAlign: "left" }}>Ítem</div>
                  <div>Tipo</div>
                  <div>Cantidad</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Total</div>
                  {!isView && <div />}
                </div>

                {(isView ? initialData.items : itemsSeleccionados).map((item, index) => (
                  <div
                    key={item.id || index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isView
                        ? "3fr 1fr 1fr 1.5fr 1.5fr"
                        : "3fr 1fr 1fr 1.5fr 1.5fr 40px",
                      padding: "16px 12px",
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
                    <div style={{ textAlign: "left" }}>{item.nombre}</div>
                    <div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 6px",
                          borderRadius: "3px",
                          background: item.tipo === "producto" ? "#dbeafe" : "#dcfce7",
                          color: item.tipo === "producto" ? "#1d4ed8" : "#166534",
                        }}
                      >
                        {item.tipo === "producto" ? "Producto" : "Servicio"}
                      </span>
                    </div>
                    <div>
                      {!isView ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <button
                            type="button"
                            onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                            style={{
                              width: "20px", height: "20px",
                              background: "var(--gray-200)", border: "none",
                              borderRadius: "3px", cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                            style={{
                              width: "40px", textAlign: "center",
                              padding: "2px 4px", border: "1px solid var(--gray-300)",
                              borderRadius: "3px", fontSize: "0.8rem",
                            }}
                            min="1"
                          />
                          <button
                            type="button"
                            onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                            style={{
                              width: "20px", height: "20px",
                              background: "var(--gray-200)", border: "none",
                              borderRadius: "3px", cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        item.cantidad
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {formatCurrency(item.precio)}
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 600, color: isView ? "#6b7280" : "inherit" }}>
                      {formatCurrency(item.precio * item.cantidad)}
                    </div>
                    {!isView && (
                      <button
                        type="button"
                        className="crud-btn crud-btn-delete"
                        onClick={() => removerItem(index)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* TOTALES */}
              <div
                style={{
                  background: isView ? "#f3f4f6" : "#ffffff",
                  borderRadius: 14,
                  padding: 18,
                  border: "1px solid #e5e7eb",
                  height: "fit-content",
                  fontSize: 14,
                  userSelect: isView ? "none" : "auto",
                  pointerEvents: isView ? "none" : "auto",
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <span style={{ color: "#9ca3af" }}>Tipo</span>
                  <strong style={{ float: "right", color: isView ? "#6b7280" : "inherit" }}>
                    {isView ? initialData?.tipo : obtenerTipoPedido()}
                  </strong>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ color: "#9ca3af" }}>Saldo Pendiente</span>
                  <strong style={{ float: "right", color: isView ? "#6b7280" : "inherit" }}>
                    {formatCurrency(isView ? (initialData?.saldoPendiente || 0) : calcularTotal())}
                  </strong>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "2px solid #e5e7eb",
                    fontSize: 16,
                    color: isView ? "#6b7280" : "inherit",
                  }}
                >
                  <span>Total</span>
                  <strong style={{ float: "right", color: isView ? "#6b7280" : "inherit" }}>
                    {formatCurrency(calcularTotal())}
                  </strong>
                </div>
              </div>
            </div>
          </BaseFormSection>
        )}

        {/* ACCIONES */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 36,
          }}
        >
          {isView ? (
            <div style={{ display: "flex", gap: 12 }}>
              <button className="crud-btn crud-btn-secondary" onClick={onCancel}>
                Volver
              </button>
              {onPdf && (
                <button className="crud-btn unified-btn-pdf" onClick={onPdf}>
                  Generar PDF
                </button>
              )}
              {onEdit && (
                <button className="crud-btn crud-btn-primary" onClick={onEdit}>
                  Editar
                </button>
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