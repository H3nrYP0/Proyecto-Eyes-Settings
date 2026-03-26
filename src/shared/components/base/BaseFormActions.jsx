import { Box, Button } from "@mui/material";

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
      >
        {cancelLabel}
      </Button>

      {showEdit && (
        <Button
          variant="contained"
          onClick={onEdit}
        >
          {editLabel}
        </Button>
      )}

      {showSave && (
        <Button
          variant="contained"
          onClick={onSave}
        >
          {saveLabel}
        </Button>
      )}
    </Box>
  );
}
