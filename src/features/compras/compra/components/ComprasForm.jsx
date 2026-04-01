import { Box, FormHelperText, Button, Typography } from "@mui/material";
import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useCompraForm } from "../hooks/useCompraForm";

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
}) {
  const isView = mode === "view";
  const isCreate = mode === "create";

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
  } = useCompraForm({
    mode,
    initialData,
    onSubmitSuccess: onSubmit,
    onError: (error) => console.error(error),
  });

  if (loadingData) {
    return (
      <BaseFormLayout title={title}>
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
          Cargando datos...
        </Box>
      </BaseFormLayout>
    );
  }

  const colsEdit = [
    { label: "Producto", align: "left", width: "auto" },
    { label: "Stock disp.", align: "center", width: 88 },
    { label: "Cantidad", align: "center", width: 88 },
    { label: "Precio Unit.", align: "right", width: 116 },
    { label: "Total", align: "right", width: 106 },
    { label: "", align: "center", width: 34 },
  ];
  
  const colsView = [
    { label: "Producto", align: "left", width: "auto" },
    { label: "Cantidad", align: "right", width: 90 },
    { label: "Precio Unit.", align: "right", width: 130 },
    { label: "Total", align: "right", width: 120 },
  ];
  
  const cols = isView ? colsView : colsEdit;

  // Opciones para el select de proveedores
  const proveedorOptions = [
    { value: "", label: "-- Selecciona un proveedor --" },
    ...(proveedores || []).map((pv) => ({
      value: pv.id,
      label: pv.razonSocial,
    })),
  ];

  return (
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
        {/* Fila 1: Proveedor + Observaciones */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", width: "100%" }}>
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
                options={proveedorOptions}
                error={!!errors.proveedorId}
                helperText={errors.proveedorId}
                required
              />
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

        {/* Fila 2: Fecha y Estado (solo en edición/visualización) */}
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
                    color:
                      initialData?.estado === "Completada" ? "#16a34a" : "#dc2626",
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </BaseFormSection>

      {/* Sección de Productos */}
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
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600 }}
              >
                Productos
              </Typography>

              {!isView && (
                <Button
                  variant="contained"
                  size="medium"
                  onClick={addRow}
                  startIcon={<span>+</span>}
                  className="btn-add-product"
                >
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
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f3f4f6" }}>
                  {cols.map(({ label, align, width }) => (
                    <th
                      key={label}
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
                  <tr
                    key={i}
                    style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}
                  >
                    {/* Producto */}
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "6px 10px",
                      }}
                    >
                      {isView ? (
                        <span style={{ fontWeight: 500 }}>{row.nombre}</span>
                      ) : (
                        <>
                          <select
                            value={row.productoId}
                            onChange={(e) =>
                              handleProductoChange(i, "productoId", e.target.value)
                            }
                            style={cellInput(!!errors[`prod_${i}`])}
                          >
                            <option value="">-- Selecciona producto --</option>
                            {catalogo.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nombre}
                              </option>
                            ))}
                          </select>
                          {errors[`prod_${i}`] && (
                            <FormHelperText
                              error
                              sx={{ mt: 0.3, fontSize: "0.75rem" }}
                            >
                              {errors[`prod_${i}`]}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    </td>

                    {/* Stock disponible (solo edición) */}
                    {!isView && (
                      <td
                        style={{
                          border: "1px solid #e5e7eb",
                          padding: "6px 10px",
                          textAlign: "center",
                        }}
                      >
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
                              backgroundColor:
                                row.stock > 0 ? "#dcfce7" : "#fee2e2",
                              color: row.stock > 0 ? "#16a34a" : "#dc2626",
                            }}
                          >
                            {row.stock}
                          </Box>
                        ) : (
                          <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
                            —
                          </span>
                        )}
                      </td>
                    )}

                    {/* Cantidad */}
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      {isView ? (
                        row.cantidad
                      ) : (
                        <>
                          <input
                            type="number"
                            min={1}
                            max={row.stock || undefined}
                            value={row.cantidad}
                            onChange={(e) =>
                              handleProductoChange(i, "cantidad", e.target.value)
                            }
                            disabled={!row.productoId}
                            style={{
                              ...cellInput(!!errors[`qty_${i}`]),
                              textAlign: "center",
                              opacity: row.productoId ? 1 : 0.4,
                            }}
                          />
                          {row.productoId && row.stock > 0 && (
                            <Box
                              component="span"
                              sx={{
                                display: "block",
                                fontSize: "0.68rem",
                                color: "#9ca3af",
                                mt: 0.2,
                              }}
                            >
                              máx. {row.stock}
                            </Box>
                          )}
                          {errors[`qty_${i}`] && (
                            <FormHelperText error sx={{ fontSize: "0.75rem" }}>
                              {errors[`qty_${i}`]}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    </td>

                    {/* Precio Unitario */}
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "6px 10px",
                        textAlign: "right",
                      }}
                    >
                      {isView ? (
                        formatCurrency(row.precioUnitario)
                      ) : (
                        <>
                          <input
                            type="number"
                            min={0}
                            value={row.precioUnitario}
                            onChange={(e) =>
                              handleProductoChange(
                                i,
                                "precioUnitario",
                                e.target.value
                              )
                            }
                            disabled={!row.productoId}
                            style={{
                              ...cellInput(!!errors[`precio_${i}`]),
                              textAlign: "right",
                              opacity: row.productoId ? 1 : 0.4,
                            }}
                          />
                          {errors[`precio_${i}`] && (
                            <FormHelperText error sx={{ fontSize: "0.75rem" }}>
                              {errors[`precio_${i}`]}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    </td>

                    {/* Total fila */}
                    <td
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "6px 10px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {formatCurrency(row.total || 0)}
                    </td>

                    {/* Eliminar (solo edición) */}
                    {!isView && (
                      <td
                        style={{
                          border: "1px solid #e5e7eb",
                          padding: "4px 6px",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          component="button"
                          type="button"
                          onClick={() => removeRow(i)}
                          disabled={formData.productos.length === 1}
                          sx={{
                            background: "none",
                            border: "none",
                            cursor:
                              formData.productos.length === 1
                                ? "not-allowed"
                                : "pointer",
                            color:
                              formData.productos.length === 1
                                ? "#d1d5db"
                                : "#ef4444",
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.8,
                  color: "text.secondary",
                }}
              >
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.8,
                  color: "text.secondary",
                }}
              >
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

      {/* Acciones */}
      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        saveLabel={submitting ? "Guardando…" : isCreate ? "Crear Compra" : "Guardar Cambios"}
        disabled={submitting}
      />
    </BaseFormLayout>
  );
}