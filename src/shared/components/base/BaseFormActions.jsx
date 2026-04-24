import { Box, Button } from "@mui/material";

// Azul del sidebar
const BRAND_COLOR = "#1a2540";
// Azul del header (hover)
const BRAND_HOVER = "#2d3a6b";

/**
 * BaseFormActions - Componente de acciones del formulario
 * 
 * Sirve para mostrar los botones de acción al final del formulario:
 * - Cancelar: cierra/limpia el formulario
 * - Editar: habilita la edición (modo vista)
 * - Guardar: envía los datos (modo creación/edición)
 * 
 * Props:
 * @param {function} onCancel - Función al cancelar
 * @param {function} onSave - Función al guardar
 * @param {function} onEdit - Función al editar
 * @param {string} cancelLabel - Texto del botón cancelar
 * @param {string} saveLabel - Texto del botón guardar
 * @param {string} editLabel - Texto del botón editar
 * @param {boolean} showSave - Muestra botón guardar
 * @param {boolean} showEdit - Muestra botón editar
 */
export default function BaseFormActions({
  onCancel,
  onSave,
  onEdit,
  cancelLabel = "Cancelar",
  saveLabel = "Guardar",
  editLabel = "Editar",
  showSave = false,
  showEdit = false,
  isSubmitting = false  // Deshabilita botón durante envío
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        mt: 4
      }}
    >
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isSubmitting}
        sx={{
          color: BRAND_COLOR,
          borderColor: BRAND_COLOR,
          "&:hover": {
            borderColor: BRAND_HOVER,
            color: BRAND_HOVER,
            backgroundColor: `${BRAND_COLOR}12`,
          },
        }}
      >
        {cancelLabel}
      </Button>

      {showEdit && (
        <Button
          variant="contained"
          onClick={onEdit}
          disabled={isSubmitting}
          sx={{
            backgroundColor: BRAND_COLOR,
            "&:hover": { backgroundColor: BRAND_HOVER },
          }}
        >
          {editLabel}
        </Button>
      )}

      {showSave && (
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isSubmitting}
          sx={{
            backgroundColor: BRAND_COLOR,
            "&:hover": { backgroundColor: BRAND_HOVER },
          }}
        >
          {isSubmitting ? "Guardando..." : saveLabel}
        </Button>
      )}
    </Box>
  );
}