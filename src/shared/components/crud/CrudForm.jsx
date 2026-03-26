import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

export default function CrudForm({
  title,
  description,
  initialData,
  onSubmit,
  onCancel,
  validationRules,
  fields,
  esEdicion = false,
}) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (validationRules) {
      Object.keys(validationRules).forEach((field) => {
        const rule = validationRules[field];
        const value = formData[field];

        if (rule.required && !value) {
          nuevosErrores[field] = rule.required;
        } else if (
          rule.minLength &&
          value &&
          value.length < rule.minLength.value
        ) {
          nuevosErrores[field] = rule.minLength.message;
        } else if (rule.custom && rule.custom(value, formData)) {
          nuevosErrores[field] = rule.custom(value, formData);
        }
      });
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    onSubmit(formData);
  };

  const renderField = (field) => {
    const { type, label, placeholder, options, required, name } = field;

    switch (type) {
      case "text":
      case "number":
      case "email":
        return (
          <TextField
            key={name}
            label={label}
            type={type}
            required={required}
            value={formData[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            error={Boolean(errors[name])}
            helperText={errors[name]}
            fullWidth
          />
        );

      case "textarea":
        return (
          <TextField
            key={name}
            label={label}
            multiline
            rows={field.rows || 3}
            value={formData[name] || ""}
            onChange={(e) => handleInputChange(name, e.target.value)}
            error={Boolean(errors[name])}
            helperText={errors[name]}
            fullWidth
          />
        );

      case "select":
        return (
          <FormControl
            key={name}
            fullWidth
            error={Boolean(errors[name])}
          >
            <InputLabel>{label}</InputLabel>
            <Select
              value={formData[name] || ""}
              label={label}
              onChange={(e) => handleInputChange(name, e.target.value)}
            >
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errors[name] && (
              <FormHelperText>{errors[name]}</FormHelperText>
            )}
          </FormControl>
        );

      case "radio":
        return (
          <FormControl key={name}>
            <Typography variant="subtitle2">{label}</Typography>
            <RadioGroup
              row
              value={formData[name]}
              onChange={(e) =>
                handleInputChange(name, e.target.value === "true")
              }
            >
              {options.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          {description && (
            <Typography color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {fields.map(renderField)}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                {esEdicion ? "Actualizar" : "Crear"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
