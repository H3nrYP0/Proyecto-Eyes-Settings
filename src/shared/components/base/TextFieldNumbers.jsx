// src/shared/components/base/TextFieldNumbers.jsx
import { useCallback } from "react";
import BaseInputField from "./BaseInputField";
import { FormHelperText, Box } from "@mui/material";

const FILTER_PATTERN = /[^0-9]/g;

export default function TextFieldNumbers({
  maxLength,
  onChange,
  value,
  error,
  helperText,
  ...restProps
}) {
  const handleChange = useCallback((e) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(FILTER_PATTERN, '');
    if (maxLength && rawValue.length > maxLength) {
      rawValue = rawValue.slice(0, maxLength);
    }
    onChange?.({
      ...e,
      target: { ...e.target, value: rawValue, name: restProps.name }
    });
  }, [maxLength, onChange, restProps.name]);

  return (
    <Box sx={{ width: '100%' }}>
      <BaseInputField
        {...restProps}
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