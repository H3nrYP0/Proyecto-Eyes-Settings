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
  disabled = false
}) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      type={type}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      select={select}
      disabled={disabled}
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
