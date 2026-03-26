import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import BaseFormLayout from "../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../shared/components/base/BaseFormActions";
import CrudNotification from "../../../shared/styles/components/notifications/CrudNotification";

import { createCompra } from "../../../lib/data/comprasData";
import { getAllProductos } from "../../../lib/data/productosData";
import { ProveedoresData } from "../../../lib/data/proveedoresData"; // ← corregido

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

export default function ComprasForm({
  mode = "create",
  title = "Crear Compra",
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
  const [proveedores, setProveedores] = useState([]);

  const [formData, setFormData] = useState({
    proveedorId: "",
    proveedorNombre: "",
    fecha: new Date().toISOString().split("T")[0],
    productos: [],
  });

  const [productoActual, setProductoActual] = useState({
    productoId: "",
    nombre: "",
    cantidad: 1,
    precioUnitario: 0,
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!isView) {
      // Productos (síncrono, sin cambios)
      setProductos(getAllProductos().filter((p) => p.estado === "activo"));

      // Proveedores — ahora es async
      ProveedoresData.getAllProveedores()
        .then((data) => {
          // Filtramos solo los activos (estado booleano true)
          setProveedores(data.filter((p) => p.estado === true));
        })
        .catch((err) => console.error("Error al cargar proveedores:", err));
    }

    if (initialData) {
      setFormData({
        proveedorId:     initialData.proveedorId     || "",
        proveedorNombre: initialData.proveedorNombre || "",
        fecha:           initialData.fecha           || new Date().toISOString().split("T")[0],
        productos:       initialData.productos       || [],
      });
    }
  }, [initialData]);

  const formatCurrency = (v) => `$${v.toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("es-ES");

  const calcularTotales = () => {
    if (isView && initialData) {
      return {
        subtotal: initialData.subtotal || 0,
        iva:      initialData.iva      || 0,
        total:    initialData.total    || 0,
      };
    }
    const subtotal = formData.productos.reduce((s, p) => s + p.total, 0);
    const iva = subtotal * 0.19;
    return { subtotal, iva, total: subtotal + iva };
  };

  const agregarProducto = () => {
    if (!productoActual.productoId || productoActual.cantidad <= 0) return;

    setFormData((prev) => ({
      ...prev,
      productos: [
        ...prev.productos,
        {
          itemId:        Date.now(),
          productoId:    productoActual.productoId,
          nombre:        productoActual.nombre,
          cantidad:      Number(productoActual.cantidad),
          precioUnitario: Number(productoActual.precioUnitario),
          total:         Number(productoActual.cantidad) * Number(productoActual.precioUnitario),
        },
      ],
    }));

    setProductoActual({ productoId: "", nombre: "", cantidad: 1, precioUnitario: 0 });
  };

  const eliminarProducto = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.itemId !== itemId),
    }));
  };

  const guardarCompra = () => {
    if (!formData.proveedorId || formData.productos.length === 0) {
      setNotification({
        isVisible: true,
        message: "Selecciona proveedor y agrega al menos un producto",
        type: "error",
      });
      return;
    }

    const { subtotal, iva, total } = calcularTotales();
    const payload = { ...formData, subtotal, iva, total, estado: "Completada" };

    if (isEdit && onSubmit) {
      onSubmit(payload);
    } else {
      createCompra(payload);
      navigate("/admin/compras");
    }
  };

  const { subtotal, iva, total } = calcularTotales();

  return (
    <>
      <BaseFormLayout title={title}>

        {/* INFORMACIÓN BÁSICA */}
        <BaseFormSection title="Información de la Compra">
          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Proveedor"
                value={formData.proveedorNombre}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={formData.proveedorId}
                  onChange={(e) => {
                    const p = proveedores.find((x) => x.id == e.target.value);
                    setFormData({
                      ...formData,
                      proveedorId:     p.id,
                      proveedorNombre: p.razonSocial, // ← campo correcto del _toUI
                    });
                  }}
                >
                  {proveedores.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.razonSocial} {/* ← campo correcto del _toUI */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          <BaseFormField>
            <TextField
              fullWidth
              type={isView ? "text" : "date"}
              label="Fecha"
              value={isView ? formatDate(formData.fecha) : formData.fecha}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: isView,
                style: isView ? viewFieldStyle : {},
              }}
              onChange={
                !isView
                  ? (e) => setFormData({ ...formData, fecha: e.target.value })
                  : undefined
              }
            />
          </BaseFormField>

          {isView && (
            <BaseFormField>
              <TextField
                fullWidth
                label="Estado"
                value={initialData?.estado || ""}
                InputProps={{
                  readOnly: true,
                  style: {
                    backgroundColor: "#f3f4f6",
                    color: initialData?.estado === "Completada" ? "#10b981" : "#ef4444",
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </BaseFormField>
          )}
        </BaseFormSection>

        {/* SELECTOR DE PRODUCTO — solo en create y edit */}
        {!isView && (
          <BaseFormSection title="Agregar Producto">
            <BaseFormField>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={productoActual.productoId}
                  onChange={(e) => {
                    const p = productos.find((x) => x.id == e.target.value);
                    setProductoActual({
                      productoId:     p.id,
                      nombre:         p.nombre,
                      cantidad:       1,
                      precioUnitario: p.precioCompra,
                    });
                  }}
                >
                  {productos.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </BaseFormField>

            <BaseFormField>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={productoActual.cantidad}
                onChange={(e) =>
                  setProductoActual({ ...productoActual, cantidad: e.target.value })
                }
              />
            </BaseFormField>

            <BaseFormField>
              <TextField
                fullWidth
                label="Precio Unitario"
                value={productoActual.precioUnitario}
                disabled
              />
            </BaseFormField>
          </BaseFormSection>
        )}

        {/* TABLA DE PRODUCTOS + TOTALES */}
        {formData.productos.length > 0 && (
          <BaseFormSection title={isView ? "Productos de la Compra" : "Resumen de la Compra"}>
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
                      ? "4fr 1fr 1.5fr 1.5fr"
                      : "4fr 1fr 1.5fr 1.5fr 40px",
                    fontWeight: 600,
                    paddingBottom: 12,
                    borderBottom: "2px solid #e5e7eb",
                    textAlign: "center",
                    color: isView ? "#9ca3af" : "inherit",
                    userSelect: isView ? "none" : "auto",
                  }}
                >
                  <div style={{ textAlign: "left" }}>Producto</div>
                  <div>Cantidad</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Total</div>
                  {!isView && <div />}
                </div>

                {formData.productos.map((p, index) => (
                  <div
                    key={p.itemId || p.id || index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isView
                        ? "4fr 1fr 1.5fr 1.5fr"
                        : "4fr 1fr 1.5fr 1.5fr 40px",
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
                    <div style={{ textAlign: "left" }}>{p.nombre}</div>
                    <div>{p.cantidad}</div>
                    <div style={{ textAlign: "right" }}>
                      {formatCurrency(p.precioUnitario)}
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 600, color: isView ? "#6b7280" : "inherit" }}>
                      {formatCurrency(p.total)}
                    </div>
                    {!isView && (
                      <button
                        className="crud-btn crud-btn-delete"
                        onClick={() => eliminarProducto(p.itemId || p.id)}
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
                  <span style={{ color: "#9ca3af" }}>Subtotal</span>
                  <strong style={{ float: "right", color: isView ? "#6b7280" : "inherit" }}>
                    {formatCurrency(subtotal)}
                  </strong>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ color: "#9ca3af" }}>IVA (19%)</span>
                  <strong style={{ float: "right", color: isView ? "#6b7280" : "inherit" }}>
                    {formatCurrency(iva)}
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
                    {formatCurrency(total)}
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
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 36,
          }}
        >
          {!isView ? (
            <button className="crud-btn crud-btn-primary" onClick={agregarProducto}>
              Agregar Producto
            </button>
          ) : (
            <div />
          )}

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
              onCancel={onCancel ?? (() => navigate("/admin/compras"))}
              onSave={guardarCompra}
              saveLabel={isEdit ? "Actualizar Compra" : "Guardar Compra"}
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