import {
  Box, Typography, Grid, Checkbox,
  FormControlLabel, FormHelperText, Chip, Button, Paper,
} from '@mui/material';

import { areAllSelected, togglePermiso, toggleSelectAll } from '@seguridad';

export default function PermisosSelector({
  permisosDisponibles = [],
  value = [],
  onChange,
  error,
  disabled = false,
}) {
  const allSelected = areAllSelected(value, permisosDisponibles);

  const handlePermisoChange = (permisoId) => {
    if (disabled) return;
    onChange(togglePermiso(value, permisoId));
  };

  const handleToggleAll = () => {
    if (disabled) return;
    onChange(toggleSelectAll(value, permisosDisponibles));
  };

  return (
    <Box>
      {/* Encabezado con contador y botón */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Permisos
          </Typography>
          <Chip
            label={`${value.length} de ${permisosDisponibles.length}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {!disabled && (
          <Button variant="outlined" size="small" onClick={handleToggleAll}>
            {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </Button>
        )}
      </Box>

      {/* Lista con scroll */}
      <Paper
        variant="outlined"
        sx={{
          p: 0.5,
          maxHeight: 280,
          overflowY: 'auto',
          borderColor: error ? 'error.main' : 'divider',
        }}
      >
        <Grid container spacing={2}>
          {permisosDisponibles.map((permiso) => (
            <Grid item xs={12} sm={6} md={4} key={permiso.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value.includes(permiso.id)}
                    onChange={() => handlePermisoChange(permiso.id)}
                    size="small"
                    disabled={disabled}
                  />
                }
                label={<Typography variant="body2">{permiso.nombre}</Typography>}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {error && (
        <FormHelperText error sx={{ mt: 1 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}
