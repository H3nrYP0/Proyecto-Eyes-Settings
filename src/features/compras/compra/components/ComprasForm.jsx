import { useState } from "react";
import {
  Box,
  FormHelperText,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useCompraForm } from "../hooks/useCompraForm";
import { createProveedor } from "../services/comprasService";

const cellSt = (hasError) => ({
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
}) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  // ---- Estado modal nuevo proveedor ----
  const [modalProv, setModalProv] = useState(false);
  const [nuevoProv, setNuevoProv] = useState({
    razon_social_o_nombre: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [savingProv, setSavingProv] = useState(false);
  const [errProv, setErrProv] = useState("");

  const {
    formData,
    errors,
    proveedores,
    catalogo,
    loadingData,
    submitting,
    apiError,
    subtotal,
    iva,
    total,
    formatCurrency,
    handleChange,
    handleProductoChange,
    addRow,
    removeRow,
    handleSubmit,
    setFormData,
    recargarProveedores,
  } = useCompraForm({
    mode,
    initialData,
    onSubmitSuccess: onSubmit,
    onError: (e) => console.error(e),
  });

  // ---- Guardar nuevo proveedor ----
  const handleGuardarProv = async () => {
    if (!nuevoProv.razon_social_o_nombre.trim()) {
      setErrProv("El nombre es obligatorio.");
      return;
    }
    setSavingProv(true);
    setErrProv("");
    try {
      const creado = await createProveedor(nuevoProv);
      await recargarProveedores();
      if (creado?.id) {
        setFormData((prev) => ({ ...prev, proveedorId: creado.id }));
      }
      setModalProv(false);
      setNuevoProv({ razon_social_o_nombre: "", telefono: "", email: "", direccion: "" });
    } catch (e) {
      setErrProv(e.response?.data?.message || "Error al crear el proveedor.");
    } finally {
      setSavingProv(false);
    }
  };

  if (loadingData) {
    return (
      <BaseFormLayout title={title}>
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
          Cargando datos...
        </Box>
      </BaseFormLayout>
    );
  }

  // Columnas tabla edición
  const colsEdit = [
    { label: "Producto", align: "left", width: "auto" },
    { label: "Stock actual", align: "center", width: 90 },
    { label: "Cantidad", align: "center", width: 80 },
    { label: "Precio Compra", align: "right", width: 120 },
    { label: "Precio Venta", align: "right", width: 120 },
    { label: "Total", align: "right", width: 100 },
    { label: "", align: "center", width: 34 },
  ];

  // Columnas tabla vista
  const colsView = [
    { label: "Producto", align: "left", width: "auto" },
    { label: "Cantidad", align: "right", width: 80 },
    { label: "Precio Compra", align: "right", width: 120 },
    { label: "Precio Venta", align: "right", width: 120 },
    { label: "Total", align: "right", width: 110 },
  ];

  const cols = isView ? colsView : colsEdit;

  const proveedorOptions = [
    { value: "", label: "-- Selecciona un proveedor --" },
    ...(proveedores || []).map((pv) => ({
      value: pv.id,
      label: pv.razonSocial || pv.razon_social_o_nombre || pv.nombre || "—",
    })),
  ];

  return (
    <>
      <BaseFormLayout title={title}>
        {apiError && (
          <Box
            sx={{
              mb: 2,
              p: "10px 14px",
              borderRadius: 1,
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              fontSize: "0.88rem",
            }}
          >
            {apiError}
          </Box>
        )}

        <BaseFormSection>
          {/* Proveedor + Observaciones */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", width: "100%", flexWrap: "wrap" }}>
            <Box sx={{ flex: "0 0 320px" }}>
              {isView ? (
                <BaseInputField
                  label="Proveedor"
                  value={
                    initialData?.proveedorNombre ||
                    initialData?.proveedor_nombre ||
                    "—"
                  }
                  disabled
                />
              ) : (
                <>
                  <BaseInputField
                    label="Proveedor"
                    name="proveedorId"
                    value={formData.proveedorId}
                    onChange={handleChange}
                    select
                    options={proveedorOptions}
                    error={!!errors.proveedorId}
                    helperText={errors.proveedorId}
                    required
                  />
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setModalProv(true)}
                    sx={{ mt: 0.25, fontSize: "0.78rem", p: "2px 4px", textTransform: "none" }}
                  >
                    + Nuevo proveedor
                  </Button>
                </>
              )}
            </Box>

            <Box sx={{ flex: "0 0 300px" }}>
              <BaseInputField
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                disabled={isView}
                placeholder="Notas adicionales..."
              />
            </Box>
          </Box>

          {/* Fecha y Estado (solo vista) */}
          {!isCreate && (
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Box sx={{ flex: "0 0 180px" }}>
                <BaseInputField
                  label="Fecha"
                  value={
                    initialData?.fecha
                      ? new Date(initialData.fecha).toLocaleDateString("es-ES")
                      : "—"
                  }
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
                      color: initialData?.estado === "Completada" ? "#16a34a" : "#dc2626",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </BaseFormSection>

        {/* Tabla de productos */}
        <Box sx={{ mt: 3 }}>
          <BaseFormSection>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Productos
              </Typography>
              {!isView && (
                <Button variant="contained" size="medium" onClick={addRow} startIcon={<span>+</span>}>
                  Agregar Producto
                </Button>
              )}
            </Box>

            {errors.productos && (
              <FormHelperText error sx={{ mb: 1 }}>
                {errors.productos}
              </FormHelperText>
            )}

            <Box sx={{ overflowX: "auto", width: "100%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    {cols.map(({ label, align, width }) => (
                      <th
                        key={label || "_"}
                        style={{
                          border: "1px solid #d1d5db",
                          padding: "8px 10px",
                          textAlign: align,
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          color: "#374151",
                          width,
                          whiteSpace: "nowrap",
                        }}
                      >
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
                              style={cellSt(!!errors[`prod_${i}`])}
                            >
                              <option value="">-- Selecciona --</option>
                              {catalogo.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.nombre}
                                </option>
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

                      {/* Stock actual (solo edición) */}
                      {!isView && (
                        <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "center" }}>
                          {row.productoId ? (
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                px: 1,
                                py: 0.25,
                                borderRadius: "4px",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                backgroundColor: "#f0f9ff",
                                color: "#0369a1",
                              }}
                            >
                              {row.stockActual}
                            </Box>
                          ) : (
                            <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>—</span>
                          )}
                        </td>
                      )}

                      {/* Cantidad — sin límite de stock */}
                      <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "center" }}>
                        {isView ? (
                          row.cantidad
                        ) : (
                          <>
                            <input
                              type="number"
                              min={1}
                              value={row.cantidad}
                              onChange={(e) => handleProductoChange(i, "cantidad", e.target.value)}
                              disabled={!row.productoId}
                              style={{
                                ...cellSt(!!errors[`qty_${i}`]),
                                textAlign: "center",
                                opacity: row.productoId ? 1 : 0.4,
                              }}
                            />
                            {errors[`qty_${i}`] && (
                              <FormHelperText error sx={{ fontSize: "0.75rem" }}>
                                {errors[`qty_${i}`]}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      </td>

                      {/* Precio Compra */}
                      <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right" }}>
                        {isView ? (
                          formatCurrency(row.precioCompra)
                        ) : (
                          <>
                            <input
                              type="number"
                              min={0}
                              value={row.precioCompra}
                              onChange={(e) => handleProductoChange(i, "precioCompra", e.target.value)}
                              disabled={!row.productoId}
                              style={{
                                ...cellSt(!!errors[`precioC_${i}`]),
                                textAlign: "right",
                                opacity: row.productoId ? 1 : 0.4,
                              }}
                            />
                            {errors[`precioC_${i}`] && (
                              <FormHelperText error sx={{ fontSize: "0.75rem" }}>
                                {errors[`precioC_${i}`]}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      </td>

                      {/* Precio Venta */}
                      <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right" }}>
                        {isView ? (
                          formatCurrency(row.precioVenta)
                        ) : (
                          <>
                            <input
                              type="number"
                              min={0}
                              value={row.precioVenta}
                              onChange={(e) => handleProductoChange(i, "precioVenta", e.target.value)}
                              disabled={!row.productoId}
                              style={{
                                ...cellSt(!!errors[`precioV_${i}`]),
                                textAlign: "right",
                                opacity: row.productoId ? 1 : 0.4,
                              }}
                            />
                            {errors[`precioV_${i}`] && (
                              <FormHelperText error sx={{ fontSize: "0.75rem" }}>
                                {errors[`precioV_${i}`]}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      </td>

                      {/* Total fila */}
                      <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#111827" }}>
                        {formatCurrency(row.total || 0)}
                      </td>

                      {/* Eliminar fila (solo edición) */}
                      {!isView && (
                        <td style={{ border: "1px solid #e5e7eb", padding: "4px 6px", textAlign: "center" }}>
                          <Box
                            component="button"
                            type="button"
                            onClick={() => removeRow(i)}
                            disabled={formData.productos.length === 1}
                            sx={{
                              background: "none",
                              border: "none",
                              cursor: formData.productos.length === 1 ? "not-allowed" : "pointer",
                              color: formData.productos.length === 1 ? "#d1d5db" : "#ef4444",
                              fontSize: "1rem",
                              lineHeight: 1,
                              p: 0,
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
              <Box
                sx={{
                  width: 240,
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 1.5,
                  p: "12px 16px",
                  fontSize: "0.88rem",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8, color: "text.secondary" }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8, color: "text.secondary" }}>
                  <span>IVA (19%)</span>
                  <span>{formatCurrency(iva)}</span>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "2px solid #e5e7eb",
                    pt: 1,
                    mt: 0.5,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "primary.main",
                  }}
                >
                  <span>TOTAL</span>
                  <span>{formatCurrency(total)}</span>
                </Box>
              </Box>
            </Box>
          </BaseFormSection>
        </Box>

        {/* Acciones — sin editar */}
        <BaseFormActions
          onCancel={onCancel}
          onSave={handleSubmit}
          showSave={!isView}
          showEdit={false}
          saveLabel={submitting ? "Guardando…" : isCreate ? "Crear Compra" : "Guardar Cambios"}
          disabled={submitting}
        />
      </BaseFormLayout>

      {/* ===== MODAL NUEVO PROVEEDOR ===== */}
      <Dialog
        open={modalProv}
        onClose={() => !savingProv && setModalProv(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 1 }}>
          Nuevo Proveedor
        </DialogTitle>
        <DialogContent sx={{ pt: "8px !important", display: "flex", flexDirection: "column", gap: 2 }}>
          {errProv && (
            <Box
              sx={{
                p: "8px 12px",
                borderRadius: 1,
                backgroundColor: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#dc2626",
                fontSize: "0.83rem",
              }}
            >
              {errProv}
            </Box>
          )}
          <TextField
            label="Nombre / Razón social *"
            size="small"
            fullWidth
            autoFocus
            value={nuevoProv.razon_social_o_nombre}
            onChange={(e) => setNuevoProv((p) => ({ ...p, razon_social_o_nombre: e.target.value }))}
          />
          <TextField
            label="Teléfono"
            size="small"
            fullWidth
            value={nuevoProv.telefono}
            onChange={(e) => setNuevoProv((p) => ({ ...p, telefono: e.target.value }))}
          />
          <TextField
            label="Email"
            size="small"
            fullWidth
            type="email"
            value={nuevoProv.email}
            onChange={(e) => setNuevoProv((p) => ({ ...p, email: e.target.value }))}
          />
          <TextField
            label="Dirección"
            size="small"
            fullWidth
            value={nuevoProv.direccion}
            onChange={(e) => setNuevoProv((p) => ({ ...p, direccion: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setModalProv(false);
              setErrProv("");
              setNuevoProv({ razon_social_o_nombre: "", telefono: "", email: "", direccion: "" });
            }}
            disabled={savingProv}
          >
            Cancelar
          </Button>
          <Button variant="contained" size="small" onClick={handleGuardarProv} disabled={savingProv}>
            {savingProv ? "Guardando…" : "Guardar Proveedor"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}