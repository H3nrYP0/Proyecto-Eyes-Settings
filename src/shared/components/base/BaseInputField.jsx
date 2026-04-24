import { TextField, MenuItem } from "@mui/material";

/**
 * BaseInputField - Campo de entrada estándar
 * 
 * Sirve para crear todos los tipos de campos de formulario:
 * - Texto, email, password, date, number
 * - Select (desplegables)
 * - Textarea (multilínea)
 * 
 * Props:
 * @param {string} label - Etiqueta del campo
 * @param {string} name - Nombre del campo (para formularios)
 * @param {any} value - Valor actual
 * @param {function} onChange - Función al cambiar valor
 * @param {string} type - Tipo de input (text, email, password, date)
 * @param {boolean} multiline - Si es textarea
 * @param {number} rows - Filas para textarea
 * @param {boolean} select - Si es desplegable
 * @param {array} options - Opciones para select [{value, label}]
 * @param {boolean} disabled - Campo deshabilitado
 * @param {boolean} error - Si tiene error
 * @param {string} helperText - Texto de ayuda/error
 * @param {boolean} required - Campo requerido
 */
export default function BaseInputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 3,
  select = false,
  options = [],
  disabled = false,
  error = false,
  helperText = "",
  required = false
}) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      margin="none"
      label={label}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      type={type}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      select={select}
      disabled={disabled}
      error={error}
      helperText={helperText}
      required={required}
      InputLabelProps={
        type === "date"
          ? { shrink: true }
          : undefined
      }
    >
      {select &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
}