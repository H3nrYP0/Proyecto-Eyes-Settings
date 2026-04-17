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
  Grid,
} from "@mui/material";

const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";

/**
 * Calcula el tamaño de columna md según el total de campos.
 * Máximo 4 columnas.
 *   1 campo  → md=12
 *   2 campos → md=6
 *   3 campos → md=4
 *   4+ campos → md=3
 */
function getColSize(totalFields) {
  const cols = Math.min(Math.max(totalFields, 1), 4);
  return Math.floor(12 / cols);
}

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
          <FormControl key={name} fullWidth error={Boolean(errors[name])}>
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

  const colSize = getColSize(fields.length);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          {description && (
            <Typography color="text.secondary">{description}</Typography>
          )}
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={12} sm={12} md={colSize} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{
                  color: BRAND_COLOR,
                  borderColor: BRAND_COLOR,
                  "&:hover": {
                    borderColor: BRAND_HOVER,
                    color: BRAND_HOVER,
                    backgroundColor: `${BRAND_COLOR}12`,
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER },
                }}
              >
                {esEdicion ? "Actualizar" : "Crear"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}