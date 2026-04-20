import { useState, useMemo } from "react";
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
  InputAdornment,
} from "@mui/material";
import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useCompraForm } from "../hooks/useCompraForm";
import { createProveedor } from "../services/comprasService";

// ── Estilos celdas editables ──────────────────────────────────────────────────
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

// ── Helper COP ────────────────────────────────────────────────────────────────
function toCOPInput(num) {
  if (!num && num !== 0) return "";
  return Number(num).toLocaleString("es-CO");
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ComprasForm({
  mode = "create",
  title,
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const isView   = mode === "view";
  const isCreate = mode === "create";

  // ══════════════════════════════════════════════════════════════════════════
  // TODOS LOS HOOKS PRIMERO — nunca después de un return condicional
  // ══════════════════════════════════════════════════════════════════════════

  // Panel de proveedores (se abre desde "+ Nuevo proveedor")
  const [panelProv,  setPanelProv]  = useState(false);
  const [searchProv, setSearchProv] = useState("");

  // Proveedores adicionales acumulados
  const [proveedoresExtra, setProveedoresExtra] = useState([]);

  // Modal crear proveedor nuevo
  const [modalCrearProv, setModalCrearProv] = useState(false);
  const [nuevoProv, setNuevoProv] = useState({
    razon_social_o_nombre: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [savingProv, setSavingProv] = useState(false);
  const [errProv,    setErrProv]    = useState("");

  // Inputs de precio en formato COP
  const [copInputs, setCopInputs] = useState({});

  // Hook principal del formulario
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

  // useMemo — ANTES del return condicional
  const proveedoresFiltradosPanel = useMemo(() => {
    const term = searchProv.toLowerCase().trim();
    const yaUsados = new Set([
      String(formData.proveedorId),
      ...proveedoresExtra.map((p) => String(p.id)),
    ]);
    return (proveedores || [])
      .filter((p) => !yaUsados.has(String(p.id)))
      .filter((p) => {
        if (!term) return true;
        return (p.razonSocial || p.razon_social_o_nombre || "").toLowerCase().includes(term);
      })
      .sort((a, b) =>
        (a.razonSocial || a.razon_social_o_nombre || "").localeCompare(
          b.razonSocial || b.razon_social_o_nombre || ""
        )
      );
  }, [proveedores, formData.proveedorId, proveedoresExtra, searchProv]);

  const proveedorSeleccionado = useMemo(
    () => (proveedores || []).find((p) => String(p.id) === String(formData.proveedorId)),
    [proveedores, formData.proveedorId]
  );

  const catalogoOrdenado = useMemo(
    () => [...(catalogo || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [catalogo]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // Return condicional — SOLO después de todos los hooks
  // ══════════════════════════════════════════════════════════════════════════
  if (loadingData) {
    return (
      <BaseFormLayout title={title}>
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
          Cargando datos...
        </Box>
      </BaseFormLayout>
    );
  }

  // ── Funciones normales (no hooks) ─────────────────────────────────────────

  const getCOPValue = (index, field, fallback) => {
    const key = `${index}_${field}`;
    if (copInputs[key] !== undefined) return copInputs[key];
    return fallback > 0 ? toCOPInput(fallback) : "";
  };

  const handleCOPChange = (index, field, rawValue) => {
    const onlyDigits = rawValue.replace(/[^0-9]/g, "");
    const num = parseInt(onlyDigits || "0", 10);
    setCopInputs((prev) => ({ ...prev, [`${index}_${field}`]: num > 0 ? toCOPInput(num) : onlyDigits }));
    handleProductoChange(index, field, num);
  };

  const handleCOPBlur = (index, field, currentNum) => {
    setCopInputs((prev) => ({
      ...prev,
      [`${index}_${field}`]: currentNum > 0 ? toCOPInput(currentNum) : "",
    }));
  };

  const getProductosDisponibles = (rowIndex) => {
    const ocupados = new Set(
      formData.productos
        .map((p, i) => (i !== rowIndex && p.productoId ? String(p.productoId) : null))
        .filter(Boolean)
    );
    return catalogoOrdenado.filter((p) => !ocupados.has(String(p.id)));
  };

  const handleGuardarProv = async () => {
    if (!nuevoProv.razon_social_o_nombre.trim()) {
      setErrProv("El nombre es obligatorio.");
      return;
    }
    if (!nuevoProv.documento.trim()) {
      setErrProv("El documento (NIT/Cédula) es obligatorio.");
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
      setModalCrearProv(false);
      setNuevoProv({ razon_social_o_nombre: "", documento: "", telefono: "", email: "", direccion: "" });
    } catch (e) {
      setErrProv(e.response?.data?.message || e.response?.data?.error || "Error al crear el proveedor.");
    } finally {
      setSavingProv(false);
    }
  };

  // Columnas tabla productos
  const colsEdit = [
    { label: "Producto",      align: "left",   width: "auto" },
    { label: "Stock actual",  align: "center", width: 90    },
    { label: "Cantidad",      align: "center", width: 90    },
    { label: "Precio Compra", align: "right",  width: 140   },
    { label: "Precio Venta",  align: "right",  width: 140   },
    { label: "Total",         align: "right",  width: 120   },
    { label: "",              align: "center", width: 34    },
  ];
  const colsView = [
    { label: "Producto",      align: "left",  width: "auto" },
    { label: "Cantidad",      align: "right", width: 80    },
    { label: "Precio Compra", align: "right", width: 120   },
    { label: "Precio Venta",  align: "right", width: 120   },
    { label: "Total",         align: "right", width: 110   },
  ];
  const cols = isView ? colsView : colsEdit;

  // Options select proveedor original
  const proveedorOptions = [
    { value: "", label: "-- Selecciona un proveedor --" },
    ...(proveedores || []).map((pv) => ({
      value: pv.id,
      label: pv.razonSocial || pv.razon_social_o_nombre || pv.nombre || "—",
    })),
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* Quitar flechas spinner */}
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <BaseFormLayout title={title}>
        {apiError && (
          <Box sx={{ mb: 2, p: "10px 14px", borderRadius: 1, backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.88rem" }}>
            {apiError}
          </Box>
        )}

        <BaseFormSection>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", width: "100%", flexWrap: "wrap" }}>

            {/* ── PROVEEDOR — select original intacto ── */}
            <Box sx={{ flex: "0 0 320px" }}>
              {isView ? (
                <BaseInputField
                  label="Proveedor"
                  value={initialData?.proveedorNombre || initialData?.proveedor_nombre || "—"}
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
                  {/* "+ Nuevo proveedor" → abre el PANEL con lista de todos los proveedores */}
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => { setSearchProv(""); setPanelProv(true); }}
                    sx={{ mt: 0.25, fontSize: "0.78rem", p: "2px 4px", textTransform: "none" }}
                  >
                    + Nuevo proveedor
                  </Button>

                  {/* Proveedores adicionales — chips minimalistas */}
                  {proveedoresExtra.length > 0 && (
                    <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {proveedoresExtra.map((pv) => {
                        const nombre = pv.razonSocial || pv.razon_social_o_nombre || "—";
                        return (
                          <Box key={pv.id} sx={{
                            display: "flex", alignItems: "center", gap: 1,
                            p: "5px 10px", borderRadius: "6px",
                            backgroundColor: "#f9f9f9", border: "1px solid #e0e0e0",
                          }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                              {nombre[0].toUpperCase()}
                            </Box>
                            <Box sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#333", flex: 1 }}>
                              {nombre}
                            </Box>
                            <Box
                              component="button" type="button"
                              onClick={() => setProveedoresExtra((prev) => prev.filter((x) => x.id !== pv.id))}
                              sx={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: "0.85rem", p: 0, lineHeight: 1, "&:hover": { color: "#555" } }}
                              title="Quitar"
                            >✕</Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </>
              )}
            </Box>

            {/* ── OBSERVACIONES ── */}
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

          {/* Fecha y Estado — solo vista/edición */}
          {!isCreate && (
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Box sx={{ flex: "0 0 180px" }}>
                <BaseInputField
                  label="Fecha"
                  value={initialData?.fecha ? new Date(initialData.fecha).toLocaleDateString("es-ES") : "—"}
                  disabled
                />
              </Box>
              <Box sx={{ flex: "0 0 180px" }}>
                <BaseInputField
                  label="Estado"
                  value={initialData?.estado === "Completada" ? "Completada" : "Sin estado"}
                  disabled
                  InputProps={{
                    sx: {
                      color:      initialData?.estado === "Completada" ? "#16a34a" : "#9ca3af",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </BaseFormSection>

        {/* ── TABLA DE PRODUCTOS ── */}
        <Box sx={{ mt: 3 }}>
          <BaseFormSection>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>Productos</Typography>
              {!isView && (
                <Button variant="contained" size="medium" onClick={addRow} startIcon={<span>+</span>}>
                  Agregar Producto
                </Button>
              )}
            </Box>

            {errors.productos && (
              <FormHelperText error sx={{ mb: 1 }}>{errors.productos}</FormHelperText>
            )}

            <Box sx={{ overflowX: "auto", width: "100%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    {cols.map(({ label, align, width }) => (
                      <th key={label || "_"} style={{
                        border: "1px solid #d1d5db", padding: "8px 10px",
                        textAlign: align, fontWeight: 600, fontSize: "0.82rem",
                        color: "#374151", width, whiteSpace: "nowrap",
                      }}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formData.productos.map((row, i) => {
                    const disponibles = getProductosDisponibles(i);
                    return (
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
                                {row.productoId && !disponibles.find((p) => String(p.id) === String(row.productoId)) && (
                                  <option value={row.productoId}>{row.nombre}</option>
                                )}
                                {disponibles.map((p) => (
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

                        {/* Stock actual */}
                        {!isView && (
                          <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "center" }}>
                            {row.productoId ? (
                              <Box component="span" sx={{
                                display: "inline-block", px: 1, py: 0.25, borderRadius: "4px",
                                fontSize: "0.78rem", fontWeight: 600, backgroundColor: "#f0f9ff", color: "#0369a1",
                              }}>
                                {row.stockActual}
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
                                inputMode="numeric"
                                min={1}
                                value={row.cantidad}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, "");
                                  handleProductoChange(i, "cantidad", val || "1");
                                }}
                                disabled={!row.productoId}
                                style={{ ...cellSt(!!errors[`qty_${i}`]), textAlign: "center", opacity: row.productoId ? 1 : 0.4 }}
                              />
                              {errors[`qty_${i}`] && (
                                <FormHelperText error sx={{ fontSize: "0.75rem" }}>{errors[`qty_${i}`]}</FormHelperText>
                              )}
                            </>
                          )}
                        </td>

                        {/* Precio Compra — COP */}
                        <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right" }}>
                          {isView ? formatCurrency(row.precioCompra) : (
                            <>
                              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <span style={{ position: "absolute", left: 8, fontSize: "0.83rem", color: row.productoId ? "#374151" : "#9ca3af", pointerEvents: "none" }}>$</span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={getCOPValue(i, "precioCompra", row.precioCompra)}
                                  onChange={(e) => handleCOPChange(i, "precioCompra", e.target.value)}
                                  onBlur={() => handleCOPBlur(i, "precioCompra", row.precioCompra)}
                                  disabled={!row.productoId}
                                  placeholder="0"
                                  style={{ ...cellSt(!!errors[`precioC_${i}`]), textAlign: "right", paddingLeft: 18, opacity: row.productoId ? 1 : 0.4 }}
                                />
                              </div>
                              {errors[`precioC_${i}`] && (
                                <FormHelperText error sx={{ fontSize: "0.75rem" }}>{errors[`precioC_${i}`]}</FormHelperText>
                              )}
                            </>
                          )}
                        </td>

                        {/* Precio Venta — COP */}
                        <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right" }}>
                          {isView ? formatCurrency(row.precioVenta) : (
                            <>
                              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <span style={{ position: "absolute", left: 8, fontSize: "0.83rem", color: row.productoId ? "#374151" : "#9ca3af", pointerEvents: "none" }}>$</span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={getCOPValue(i, "precioVenta", row.precioVenta)}
                                  onChange={(e) => handleCOPChange(i, "precioVenta", e.target.value)}
                                  onBlur={() => handleCOPBlur(i, "precioVenta", row.precioVenta)}
                                  disabled={!row.productoId}
                                  placeholder="0"
                                  style={{ ...cellSt(!!errors[`precioV_${i}`]), textAlign: "right", paddingLeft: 18, opacity: row.productoId ? 1 : 0.4 }}
                                />
                              </div>
                              {errors[`precioV_${i}`] && (
                                <FormHelperText error sx={{ fontSize: "0.75rem" }}>{errors[`precioV_${i}`]}</FormHelperText>
                              )}
                            </>
                          )}
                        </td>

                        {/* Total fila */}
                        <td style={{ border: "1px solid #e5e7eb", padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#111827" }}>
                          {formatCurrency(row.total || 0)}
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
                                color: formData.productos.length === 1 ? "#d1d5db" : "#ef4444",
                                fontSize: "1rem", lineHeight: 1, p: 0,
                                "&:hover:not(:disabled)": { color: "#b91c1c" },
                              }}
                              title="Eliminar fila"
                            >✕</Box>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>

            {/* Totales */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
              <Box sx={{ width: 260, backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 1.5, p: "12px 16px", fontSize: "0.88rem" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8, color: "text.secondary" }}>
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8, color: "text.secondary" }}>
                  <span>IVA (19%)</span><span>{formatCurrency(iva)}</span>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #e5e7eb", pt: 1, mt: 0.5, fontWeight: 700, fontSize: "0.95rem", color: "primary.main" }}>
                  <span>TOTAL</span><span>{formatCurrency(total)}</span>
                </Box>
              </Box>
            </Box>
          </BaseFormSection>
        </Box>

        {/* Acciones */}
        <BaseFormActions
          onCancel={onCancel}
          onSave={handleSubmit}
          showSave={!isView}
          showEdit={false}
          saveLabel={submitting ? "Guardando…" : isCreate ? "Crear Compra" : "Guardar Cambios"}
          disabled={submitting}
        />
      </BaseFormLayout>

      {/* ══════════════════════════════════════════════════════════════
          PANEL "+ Nuevo proveedor"
          Muestra la lista de todos los proveedores con buscador.
          NO tiene botón de crear — solo seleccionar de la lista.
      ══════════════════════════════════════════════════════════════ */}
      <Dialog
        open={panelProv}
        onClose={() => { setPanelProv(false); setSearchProv(""); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 1 }}>
          Proveedores
        </DialogTitle>

        <DialogContent sx={{ pt: "4px !important" }}>
          {/* Buscador */}
          <TextField
            autoFocus size="small" fullWidth
            placeholder="Buscar proveedor..."
            value={searchProv}
            onChange={(e) => setSearchProv(e.target.value)}
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>⌕</span>
                </InputAdornment>
              ),
            }}
          />

          {/* Proveedor seleccionado actualmente */}
          {proveedorSeleccionado && (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Seleccionado actualmente
              </Typography>
              <Box sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                p: "10px 14px", borderRadius: "8px",
                backgroundColor: "#eef2ff", border: "2px solid #6366f1",
              }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                  {(proveedorSeleccionado.razonSocial || proveedorSeleccionado.razon_social_o_nombre || "?")[0].toUpperCase()}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#3730a3", flex: 1 }}>
                  {proveedorSeleccionado.razonSocial || proveedorSeleccionado.razon_social_o_nombre}
                </Typography>
                <Button
                  size="small" variant="text"
                  onClick={() => setFormData((prev) => ({ ...prev, proveedorId: "" }))}
                  sx={{ fontSize: "0.72rem", color: "#6366f1", textTransform: "none", minWidth: 0, p: "2px 6px" }}
                >
                  Quitar
                </Button>
              </Box>
            </Box>
          )}

          {/* Contador */}
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", mb: 0.75, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {proveedoresFiltradosPanel.length} disponible{proveedoresFiltradosPanel.length !== 1 ? "s" : ""}
          </Typography>

          {/* Lista scrolleable */}
          <Box sx={{ maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0.75 }}>
            {proveedoresFiltradosPanel.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4, color: "#9ca3af", fontSize: "0.85rem" }}>
                {searchProv ? "No hay resultados para la búsqueda" : "No hay más proveedores disponibles"}
              </Box>
            ) : (
              proveedoresFiltradosPanel.map((pv) => {
                const nombre = pv.razonSocial || pv.razon_social_o_nombre || "—";
                return (
                  <Box
                    key={pv.id}
                    onClick={() => {
                      setProveedoresExtra((prev) => {
                        if (prev.find((x) => x.id === pv.id)) return prev;
                        return [...prev, pv];
                      });
                      setPanelProv(false);
                      setSearchProv("");
                    }}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5,
                      p: "10px 14px", borderRadius: "8px",
                      border: "1px solid #e5e7eb", cursor: "pointer", backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5", borderColor: "#d1d5db" },
                      transition: "all 0.12s",
                    }}
                  >
                    <Box sx={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                      {nombre[0].toUpperCase()}
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#111827", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {nombre}
                    </Typography>
                    <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Seleccionar →</span>
                  </Box>
                );
              })
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" size="small" onClick={() => { setPanelProv(false); setSearchProv(""); }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL — CREAR NUEVO PROVEEDOR
          (accesible solo desde el botón "+ Nuevo proveedor" del form,
           no desde el panel)
      ══════════════════════════════════════════════════════════════ */}
      <Dialog
        open={modalCrearProv}
        onClose={() => !savingProv && setModalCrearProv(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 1 }}>
          Crear Nuevo Proveedor
        </DialogTitle>
        <DialogContent sx={{ pt: "8px !important", display: "flex", flexDirection: "column", gap: 2 }}>
          {errProv && (
            <Box sx={{ p: "8px 12px", borderRadius: 1, backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.83rem" }}>
              {errProv}
            </Box>
          )}
          <TextField label="Nombre / Razón social *" size="small" fullWidth autoFocus
            value={nuevoProv.razon_social_o_nombre}
            onChange={(e) => setNuevoProv((p) => ({ ...p, razon_social_o_nombre: e.target.value }))}
          />
          <TextField label="Documento (NIT / Cédula) *" size="small" fullWidth
            value={nuevoProv.documento}
            onChange={(e) => setNuevoProv((p) => ({ ...p, documento: e.target.value }))}
          />
          <TextField label="Teléfono" size="small" fullWidth
            value={nuevoProv.telefono}
            onChange={(e) => setNuevoProv((p) => ({ ...p, telefono: e.target.value }))}
          />
          <TextField label="Email" size="small" fullWidth type="email"
            value={nuevoProv.email}
            onChange={(e) => setNuevoProv((p) => ({ ...p, email: e.target.value }))}
          />
          <TextField label="Dirección" size="small" fullWidth
            value={nuevoProv.direccion}
            onChange={(e) => setNuevoProv((p) => ({ ...p, direccion: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined" size="small" disabled={savingProv}
            onClick={() => {
              setModalCrearProv(false);
              setErrProv("");
              setNuevoProv({ razon_social_o_nombre: "", documento: "", telefono: "", email: "", direccion: "" });
            }}
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