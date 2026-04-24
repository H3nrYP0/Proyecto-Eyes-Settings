import { FormHelperText, MenuItem, TextField, Box } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useMarcaForm } from "../hooks/useMarcaForm";
import { TextFieldAlphanumeric, TextFieldLetters } from "@shared/index";

export default function MarcaForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  id,
  buttonRef
}) {
  const {
    formData,
    errors,
    nombreExists,
    isView,
    submitting,
    handleChange,
    handleSubmit,
    handleCancel
  } = useMarcaForm({ mode, initialData, onSubmit, onCancel });

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <TextFieldAlphanumeric
            label="Nombre de la Marca"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            placeholder="Ej: Ray-Ban, Oakley, etc."
            inputProps={{ maxLength: 50 }}
            fullWidth
            required
            error={!!errors.nombre || nombreExists}
            helperText={errors.nombre}
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
      
      <button 
        type="submit" 
        ref={buttonRef} 
        style={{ display: 'none' }}
        disabled={submitting}
      />
    </form>
  );
}