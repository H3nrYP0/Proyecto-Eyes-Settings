import { useCallback } from "react";
import BaseInputField from "./BaseInputField";
import { FormHelperText, Box } from "@mui/material";

const ALLOWED_PATTERN = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,;:!?¡¿(){}[\]\-_@#$%&*+=|\\/'"]/g;

export default function TextFieldNoEmoji({
  maxLength,
  onChange,
  value,
  error,
  helperText,
  multiline = false,
  rows = 3,
  ...restProps
}) {
  const handleChange = useCallback((e) => {
    let rawValue = e.target.value;
    let cleanedValue = rawValue.replace(ALLOWED_PATTERN, '');
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.slice(0, maxLength);
    }
    onChange?.({
      ...e,
      target: { ...e.target, value: cleanedValue, name: restProps.name }
    });
  }, [maxLength, onChange, restProps.name]);

  return (
    <Box sx={{ width: '100%' }}>
      <BaseInputField
        {...restProps}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        value={value}
        onChange={handleChange}
        error={error}
        inputProps={{ maxLength, ...restProps.inputProps }}
      />
      {helperText && error && (
        <FormHelperText error sx={{ mt: 1 }}>{helperText}</FormHelperText>
      )}
    </Box>
  );
}