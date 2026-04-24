// src/shared/components/base/TextFieldLetters.jsx
import { useState, useCallback } from "react";
import BaseInputField from "./BaseInputField";
import { FormHelperText, Box } from "@mui/material";

// Permitir: letras (con acentos, ñ), espacios, guiones normal y medio/largo (se convertirán)
// También incluimos el guión medio y largo para normalizarlos después
const FILTER_PATTERN = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-–—]/g;

const normalizeValue = (value) => {
  if (!value) return '';
  let normalized = value
    // Convertir guiones medios y largos a guión normal
    .replace(/[–—]/g, '-')
    // Múltiples espacios → uno
    .replace(/\s{2,}/g, ' ')
    // Múltiples guiones consecutivos → uno
    .replace(/-{2,}/g, '-')
    // (Opcional) Eliminar espacios alrededor de guiones: "Ray - Ban" → "Ray-Ban"
    .replace(/\s*-\s*/g, '-');
  return normalized;
};

export default function TextFieldLetters({
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
    if (!trimmed) return 'El campo no puede estar vacío';
    
    // Debe contener al menos una letra
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(trimmed)) {
      return 'Debe contener al menos una letra';
    }
    
    // No permitir solo guiones y espacios (esto ya cubre casos como "---" o " - ")
    if (/^[- ]+$/.test(trimmed)) {
      return 'Solo guiones o espacios no es válido';
    }
    
    return '';
  }, []);

  const handleChange = useCallback((e) => {
    let rawValue = e.target.value;
    // Eliminar caracteres no permitidos (emojis, números, etc.)
    rawValue = rawValue.replace(FILTER_PATTERN, '');
    // Normalizar (espacios, guiones, etc.)
    let normalizedValue = normalizeValue(rawValue);
    
    // Limitar longitud
    if (maxLength && normalizedValue.length > maxLength) {
      normalizedValue = normalizedValue.slice(0, maxLength);
    }
    
    // Validar formato
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