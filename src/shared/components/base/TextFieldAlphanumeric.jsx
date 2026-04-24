// src/shared/components/base/TextFieldAlphanumeric.jsx
import { useState, useCallback } from "react";
import BaseInputField from "./BaseInputField";
import { FormHelperText, Box } from "@mui/material";

const FILTER_PATTERN = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.]/g;

const normalizeValue = (value) => {
  if (!value) return '';
  let normalized = value
    .replace(/\s{2,}/g, ' ')
    .replace(/-{2,}/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/\.-|\.-\./g, '.');
  return normalized;
};

export default function TextFieldAlphanumeric({
  maxLength,
  onChange,
  value,
  error,
  helperText,
  ...restProps
}) {
  const [internalError, setInternalError] = useState('');

  const validateFormat = useCallback((rawValue) => {
    const trimmed = rawValue?.trim() || '';
    if (!trimmed) return '';
    // No permitir solo caracteres repetidos sin contenido
    const uniqueChars = new Set(trimmed.split(''));
    if (uniqueChars.size === 1 && ['-', '.', ' '].includes(trimmed[0])) {
      return "Valor inválido";
    }
    return '';
  }, []);

  const handleChange = useCallback((e) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(FILTER_PATTERN, '');
    let normalizedValue = normalizeValue(rawValue);
    if (maxLength && normalizedValue.length > maxLength) {
      normalizedValue = normalizedValue.slice(0, maxLength);
    }
    const formatError = validateFormat(normalizedValue);
    setInternalError(formatError);
    onChange?.({
      ...e,
      target: { ...e.target, value: normalizedValue, name: restProps.name }
    });
  }, [maxLength, validateFormat, onChange, restProps.name]);

  const displayError = error || !!internalError;
  const displayHelperText = internalError || helperText;

  return (
    <Box sx={{ width: '100%' }}>
      <BaseInputField
        {...restProps}
        value={value}
        onChange={handleChange}
        error={displayError}
        inputProps={{ maxLength, ...restProps.inputProps }}
      />
      {displayHelperText && displayError && (
        <FormHelperText error sx={{ mt: 1 }}>{displayHelperText}</FormHelperText>
      )}
    </Box>
  );
}