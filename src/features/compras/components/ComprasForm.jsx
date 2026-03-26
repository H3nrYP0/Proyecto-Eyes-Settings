import { useState, useEffect } from "react";
import { Box, FormHelperText } from "@mui/material";

import BaseFormLayout  from "../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../shared/components/base/BaseFormSection";
import BaseFormField   from "../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../shared/components/base/BaseFormActions";
import BaseInputField  from "../../../shared/components/base/BaseInputField";

import { ProveedoresData } from "../../../lib/data/proveedoresData";
import { ProductoData }    from "../../../lib/data/productosData";
import { ComprasData }     from "../../../lib/data/comprasData";

// ─────────────────────────────────────────────────────────────
//  ComprasForm  —  create | edit | view
// ─────────────────────────────────────────────────────────────

const EMPTY_ROW = {
  productoId:     "",
  nombre:         "",
  stock:          0,
  cantidad:       1,
  precioUnitario: 0,
  total:          0,
};

const cellInput = (hasError) => ({
  width: "100%",
  padding: "5px 8px",
  border: `1px solid ${hasError ? "#ef4444" : "#d1d5db"}`,
  borderRadius: 4,
  fontSize: "0.83rem",
  outline: "none",
  backgroundColor: "#fff",
  boxSizing: "border-box",
});

export default function ComprasForm({
  mode = "create",
  title,
  initialData = null,
  onSubmit,
  onCancel,
  onEdit,
  onPdf,
}) {
  const isView   = mode === "view";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    proveedorId:   "",
    observaciones: "",
    productos:     [{ ...EMPTY_ROW }],
  });
  const [errors,   setErrors]   = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [catalogo,    setCatalogo]    = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Cargar datos remotos ─────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        setLoadingData(true);
        const [provRes, prodRes] = await Promise.all([
          ProveedoresData.getProveedoresActivos(),
          ProductoData.getAllProductos(),
        ]);
        setProveedores(provRes);
        setCatalogo(
          prodRes.map((p) => ({
            id:     p.id,
            nombre: p.nombre,
            precio: Number(p.precio_compra ?? p.precioCompra ?? 0),
            stock:  Number(p.stock ?? p.stockActual ?? 0),
          }))
        );
      } catch (e) {
        console.error("Error cargando datos:", e);
        setApiError("No se pudieron cargar proveedores o productos.");
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, []);

  // ── Poblar en edit/view ──────────────────────────────────
  useEffect(() => {
    if (!initialData) return;
    setFormData({
      proveedorId:   initialData.proveedorId   ?? "",
      observaciones: initialData.observaciones ?? "",
      productos: initialData.productos?.length
        ? initialData.productos.map((p) => ({
            id:             p.id,
            productoId:     p.productoId ?? "",
            nombre:         p.nombre     ?? "",
            stock:          p.stock      ?? 0,
            cantidad:       p.cantidad,
            precioUnitario: p.precioUnitario,
            total:          p.total,
          }))
        : [{ ...EMPTY_ROW }],
    });
  }, [initialData]);

  // ── Cálculos ─────────────────────────────────────────────
  const subtotal = formData.productos.reduce((s, p) => s + (p.total || 0), 0);
  const iva      = Math.round(subtotal * 0.19);
  const total    = subtotal + iva;
  const fmt      = (n) => `$${Number(n).toLocaleString("es-CO")}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProductoChange = (index, field, value) => {
    setFormData((prev) => {
      const productos = [...prev.productos];
      const row       = { ...productos[index] };

      if (field === "productoId") {
        const found        = catalogo.find((p) => p.id === Number(value));
        row.productoId     = value;
        row.nombre         = found?.nombre ?? "";
        row.stock          = found?.stock  ?? 0;
        row.precioUnitario = found?.precio ?? 0;
        row.cantidad       = Math.min(row.cantidad, found?.stock ?? row.cantidad) || 1;
        row.total          = row.cantidad * row.precioUnitario;
        setErrors((e) => ({ ...e, [`prod_${index}`]: "" }));
      } else if (field === "cantidad") {
        const max    = row.stock || Infinity;
        const qty    = Math.max(1, Math.min(Number(value) || 1, max));
        row.cantidad = qty;
        row.total    = qty * row.precioUnitario;
        setErrors((e) => ({ ...e, [`qty_${index}`]: "" }));
      } else if (field === "precioUnitario") {
        const precio       = Math.max(0, Number(value) || 0);
        row.precioUnitario = precio;
        row.total          = row.cantidad * precio;
        setErrors((e) => ({ ...e, [`precio_${index}`]: "" }));
      }

      productos[index] = row;
      return { ...prev, productos };
    });
  };

  const addRow    = () =>
    setFormData((prev) => ({ ...prev, productos: [...prev.productos, { ...EMPTY_ROW }] }));
  const removeRow = (i) =>
    setFormData((prev) => ({ ...prev, productos: prev.productos.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    if (!formData.proveedorId) e.proveedorId = "Selecciona un proveedor.";
    if (!formData.productos.length) {
      e.productos = "Agrega al menos un producto.";
    } else {
      formData.productos.forEach((p, i) => {
        if (!p.productoId)                              e[`prod_${i}`]   = "Selecciona el producto.";
        if (!p.cantidad       || p.cantidad       < 1)  e[`qty_${i}`]    = "Mínimo 1.";
        if (!p.precioUnitario || p.precioUnitario <= 0) e[`precio_${i}`] = "Precio requerido.";
      });
    }
    return e;
  };

  const handleSubmit = async () => {
    setApiError("");
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    const payload = {
      proveedorId:   Number(formData.proveedorId),
      observaciones: formData.observaciones,
      productos: formData.productos.map((p) => ({
        id:             p.id,
        productoId:     Number(p.productoId),
        cantidad:       Number(p.cantidad),
        precioUnitario: Number(p.precioUnitario),
      })),
    };
    try {
      setSaving(true);
      if (onSubmit)       await onSubmit(payload);
      else if (isCreate)  { await ComprasData.createCompra(payload); onCancel?.(); }
      else                { await ComprasData.updateCompra(initialData.id, payload); onCancel?.(); }
    } catch (err) {
      console.error(err);
      setApiError("Ocurrió un error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <BaseFormLayout title={title}>
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>Cargando datos…</Box>
      </BaseFormLayout>
    );
  }

  const colsEdit = [
    { label: "Producto",     align: "left",   width: "auto" },
    { label: "Stock disp.",  align: "center", width: 88  },
    { label: "Cantidad",     align: "center", width: 88  },
    { label: "Precio Unit.", align: "right",  width: 116 },
    { label: "Total",        align: "right",  width: 106 },
    { label: "",             align: "center", width: 34  },
  ];
  const colsView = [
    { label: "Producto",     align: "left",  width: "auto" },
    { label: "Cantidad",     align: "right", width: 90  },
    { label: "Precio Unit.", align: "right", width: 130 },
    { label: "Total",        align: "right", width: 120 },
  ];
  const cols = isView ? colsView : colsEdit;

  // ── RENDER ───────────────────────────────────────────────
  return (
    <BaseFormLayout title={title}>

      {/* Error API */}
      {apiError && (
        <Box sx={{ mb: 2, p: "10px 14px", borderRadius: 1, backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.88rem" }}>
          {apiError}
        </Box>
      )}

      {/* ── SECCIÓN 1: Información ── */}
      <BaseFormSection title="Información de la Compra">

        {/* Fila: Proveedor + Observaciones en la misma línea, misma altura */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

          {/* Proveedor */}
          <Box sx={{ flex: "0 0 320px" }}>
            {isView ? (
              <BaseInputField
                label="Proveedor"
                value={initialData?.proveedorNombre ?? "—"}
                disabled
              />
            ) : (
              <BaseInputField
                label="Proveedor"
                name="proveedorId"
                value={formData.proveedorId}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                error={!!errors.proveedorId}
                helperText={errors.proveedorId}
              >
                <option value="">-- Selecciona un proveedor --</option>
                {proveedores.map((pv) => (
                  <option key={pv.id} value={pv.id}>{pv.razonSocial}</option>
                ))}
              </BaseInputField>
            )}
          </Box>

          {/* Observaciones — misma altura que el select, sin multiline */}
          <Box sx={{ flex: "0 0 300px" }}>
            <BaseInputField
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              disabled={isView}
              placeholder="Notas adicionales…"
              inputProps={{ style: { fontSize: "0.85rem" } }}
            />
          </Box>

        </Box>

        {/* Fecha + Estado — solo edit/view, debajo en fila separada */}
        {!isCreate && (
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Box sx={{ flex: "0 0 180px" }}>
              <BaseInputField
                label="Fecha"
                value={initialData?.fecha
                  ? new Date(initialData.fecha).toLocaleDateString("es-ES")
                  : "—"}
                disabled
              />
            </Box>
            <Box sx={{ flex: "0 0 180px" }}>
              <BaseInputField
                label="Estado"
                value={initialData?.estado ?? "—"}
                disabled
                InputProps={{
                  sx: {
                    color:      initialData?.estado === "Completada" ? "#16a34a" : "#dc2626",
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </Box>
        )}

      </BaseFormSection>

      {/* ── Separación entre secciones ── */}
      <Box sx={{ mt: 1 }} />

      {/* ── SECCIÓN 2: Productos — con margen lateral para uniformidad ── */}
      <Box sx={{ px: 1 }}>
        <BaseFormSection
          title="Productos"
          headerAction={
            !isView && (
              <Box
                component="button"
                type="button"
                onClick={addRow}
                sx={{
                  background: "none",
                  border: "1px solid",
                  borderColor: "primary.main",
                  color: "primary.main",
                  borderRadius: "6px",
                  px: 1.5, py: 0.4,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontFamily: "inherit",
                  "&:hover": { backgroundColor: "rgba(37,99,235,0.05)" },
                }}
              >
                + Agregar
              </Box>
            )
          }
        >
          {errors.productos && (
            <FormHelperText error sx={{ mb: 1 }}>{errors.productos}</FormHelperText>
          )}

          {/* Tabla */}
          <Box sx={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  {cols.map(({ label, align, width }) => (
                    <th key={label} style={{
                      border: "1px solid #d1d5db",
                      padding: "8px 10px",
                      textAlign: align,
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: "#374151",
                      width,
                      whiteSpace: "nowrap",
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.productos.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>

                    {/* Producto */}
                    <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px" }}>
                      {isView ? (
                        <span style={{ fontWeight: 500 }}>{row.nombre}</span>
                      ) : (
                        <>
                          <select
                            value={row.productoId}
                            onChange={(e) => handleProductoChange(i, "productoId", e.target.value)}
                            style={cellInput(!!errors[`prod_${i}`])}
                          >
                            <option value="">-- Selecciona producto --</option>
                            {catalogo.map((p) => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                          {errors[`prod_${i}`] && (
                            <FormHelperText error sx={{ mt: 0.3, fontSize: "0.75rem" }}>
                              {errors[`prod_${i}`]}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    </td>

                    {/* Stock disp. — solo edición */}
                    {!isView && (
                      <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "center" }}>
                        {row.productoId ? (
                          <Box component="span" sx={{
                            display: "inline-block",
                            px: 1, py: 0.25,
                            borderRadius: "4px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            backgroundColor: row.stock > 0 ? "#dcfce7" : "#fee2e2",
                            color:           row.stock > 0 ? "#16a34a" : "#dc2626",
                          }}>
                            {row.stock}
                          </Box>
                        ) : (
                          <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>—</span>
                        )}
                      </td>
                    )}

                    {/* Cantidad */}
                    <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "center" }}>
                      {isView ? row.cantidad : (
                        <>
                          <input
                            type="number"
                            min={1}
                            max={row.stock || undefined}
                            value={row.cantidad}
                            onChange={(e) => handleProductoChange(i, "cantidad", e.target.value)}
                            disabled={!row.productoId}
                            style={{
                              ...cellInput(!!errors[`qty_${i}`]),
                              textAlign: "center",
                              opacity: row.productoId ? 1 : 0.4,
                            }}
                          />
                          {row.productoId && row.stock > 0 && (
                            <Box component="span" sx={{ display: "block", fontSize: "0.68rem", color: "#9ca3af", mt: 0.2 }}>
                              máx. {row.stock}
                            </Box>
                          )}
                          {errors[`qty_${i}`] && (
                            <FormHelperText error sx={{ fontSize: "0.75rem" }}>{errors[`qty_${i}`]}</FormHelperText>
                          )}
                        </>
                      )}
                    </td>

                    {/* Precio unit. — auto-relleno, editable */}
                    <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right" }}>
                      {isView ? fmt(row.precioUnitario) : (
                        <>
                          <input
                            type="number"
                            min={0}
                            value={row.precioUnitario}
                            onChange={(e) => handleProductoChange(i, "precioUnitario", e.target.value)}
                            disabled={!row.productoId}
                            style={{
                              ...cellInput(!!errors[`precio_${i}`]),
                              textAlign: "right",
                              opacity: row.productoId ? 1 : 0.4,
                            }}
                          />
                          {errors[`precio_${i}`] && (
                            <FormHelperText error sx={{ fontSize: "0.75rem" }}>{errors[`precio_${i}`]}</FormHelperText>
                          )}
                        </>
                      )}
                    </td>

                    {/* Total fila */}
                    <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#111827" }}>
                      {fmt(row.total || 0)}
                    </td>

                    {/* Eliminar */}
                    {!isView && (
                      <td style={{ border: "1px solid #e5e7eb", padding: "4px 6px", textAlign: "center" }}>
                        <Box
                          component="button"
                          type="button"
                          onClick={() => removeRow(i)}
                          disabled={formData.productos.length === 1}
                          sx={{
                            background: "none", border: "none",
                            cursor: formData.productos.length === 1 ? "not-allowed" : "pointer",
                            color:  formData.productos.length === 1 ? "#d1d5db" : "#ef4444",
                            fontSize: "1rem", lineHeight: 1, p: 0,
                            "&:hover:not(:disabled)": { color: "#b91c1c" },
                          }}
                          title="Eliminar fila"
                        >
                          ✕
                        </Box>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* Totales */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
            <Box sx={{ width: 240, backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 1.5, p: "12px 16px", fontSize: "0.88rem" }}>
              {[
                { label: "Subtotal",  value: subtotal },
                { label: "IVA (19%)", value: iva      },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.8, color: "text.secondary" }}>
                  <span>{label}</span><span>{fmt(value)}</span>
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #e5e7eb", pt: 1, mt: 0.5, fontWeight: 700, fontSize: "0.95rem", color: "primary.main" }}>
                <span>TOTAL</span><span>{fmt(total)}</span>
              </Box>
            </Box>
          </Box>

        </BaseFormSection>
      </Box>

      {/* Acciones */}
      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        saveLabel={saving ? "Guardando…" : isCreate ? "Crear Compra" : "Guardar Cambios"}
        disabled={saving}
      />

    </BaseFormLayout>
  );
}