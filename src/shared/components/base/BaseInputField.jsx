import { TextField, MenuItem } from "@mui/material";

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
      size="medium"
      margin="none"   // 👈 quitamos el margen automático
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
