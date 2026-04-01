import { FormHelperText, MenuItem, TextField, Box } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useMarcaForm } from "../hooks/useMarcaForm";

export default function MarcaForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  id
}) {
  const {
    formData,
    errors,
    nombreExists,
    isView,
    handleChange,
    handleSubmit,
    handleCancel
  } = useMarcaForm({ mode, initialData, onSubmit, onCancel });

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <BaseInputField
            label="Nombre de la Marca"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            placeholder="Ej: Ray-Ban, Oakley, etc."
            inputProps={{ maxLength: 23 }}
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
              Ya existe una marca con este nombre
            </FormHelperText>
          )}
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
              disabled={isView}
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