import { Box, Button } from "@mui/material";

// Azul del sidebar
const BRAND_COLOR = "#1a2540";
// Azul del header (hover)
const BRAND_HOVER = "#2d3a6b";

export default function BaseFormActions({
  onCancel,
  onSave,
  onEdit,
  cancelLabel = "Cancelar",
  saveLabel = "Guardar",
  editLabel = "Editar",
  showSave = false,
  showEdit = false
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
          sx={{
            backgroundColor: BRAND_COLOR,
            "&:hover": { backgroundColor: BRAND_HOVER },
          }}
        >
          {saveLabel}
        </Button>
      )}
    </Box>
  );
}