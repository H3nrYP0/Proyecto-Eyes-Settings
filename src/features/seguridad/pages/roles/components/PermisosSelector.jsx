import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Chip,
  Button
} from "@mui/material";

export default function PermisosSelector({
  permisosDisponibles = [],
  value = [],
  onChange,
  error
}) {

  const [todosSeleccionados, setTodosSeleccionados] = useState(false);

  useEffect(() => {
    setTodosSeleccionados(
      value.length === permisosDisponibles.length &&
      permisosDisponibles.length > 0
    );
  }, [value, permisosDisponibles]);

  const handlePermisoChange = (permisoId) => {
    const existe = value.includes(permisoId);

    const nuevosPermisos = existe
      ? value.filter((id) => id !== permisoId)
      : [...value, permisoId];

    onChange(nuevosPermisos);
  };

  const toggleSeleccionarTodos = () => {
    if (todosSeleccionados) {
      onChange([]);
    } else {
      const todosIds = permisosDisponibles.map((p) => p.id);
      onChange(todosIds);
    }
  };

  return (
    <Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Permisos
          </Typography>

          <Chip
            label={`${value.length} de ${permisosDisponibles.length}`}
            size="small"
          />
        </Box>

        <Button
          variant="text"
          size="small"
          onClick={toggleSeleccionarTodos}
        >
          {todosSeleccionados ? "Deseleccionar todos" : "Seleccionar todos"}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {permisosDisponibles.map((permiso) => (
          <Grid item xs={12} sm={6} md={4} key={permiso.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.includes(permiso.id)}
                  onChange={() => handlePermisoChange(permiso.id)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {permiso.nombre}
                </Typography>
              }
            />
          </Grid>
        ))}
      </Grid>

      {error && (
        <FormHelperText error sx={{ mt: 1 }}>
          {error}
        </FormHelperText>
      )}

    </Box>
  );
}
