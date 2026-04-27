import { FormHelperText, MenuItem, TextField, Box } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { TextFieldLetters, TextFieldNoEmoji } from "@shared/index";
export default function CategoriaForm({
  mode = "create",
  onCancel,
  id,
  formData,
  errors,
  nombreExists,
  submitting,
  handleChange,
  handleSubmit,
}) {
  const isView = mode === "view";

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const result = await handleSubmit();
    if (result?.success && onCancel) {
      onCancel();
    }
  };

  return (
    <form id={id} onSubmit={onSubmitForm}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <TextFieldLetters
            label="Nombre de la Categoría"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView || submitting}
            placeholder="Ej: Lentes de Sol, Lentes Recetados, etc."
            inputProps={{ maxLength: 50 }}
            fullWidth
            required
            error={!!errors.nombre || nombreExists}
          />
          {errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.nombre}
            </FormHelperText>
          )}
          {nombreExists && !errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>
              Ya existe una categoría con este nombre
            </FormHelperText>
          )}
        </Box>

        <Box>
          <TextFieldNoEmoji
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView || submitting}
            multiline
            rows={4}
            placeholder="Descripción de la categoría (opcional)..."
            variant="outlined"
            size="medium"
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            inputProps={{ maxLength: 500 }}
          />
        </Box>

        {mode !== "create" && (
          <Box>
            <TextField
              select
              fullWidth
              label="Estado"
              name="estado"
              value={formData.estado ? "true" : "false"}
              onChange={handleChange}
              disabled={isView || submitting}
              size="medium"
              variant="outlined"
            >
              <MenuItem value="true">Activa</MenuItem>
              <MenuItem value="false">Inactiva</MenuItem>
            </TextField>
          </Box>
        )}
      </Box>
    </form>
  );
}