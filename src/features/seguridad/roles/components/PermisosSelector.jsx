import {
  Box, Typography, Chip, Button, FormHelperText
} from '@mui/material';

import { areAllSelected, togglePermiso, toggleSelectAll } from '@seguridad';

// Colores muy claros
const BRAND_LIGHT = "#eef2f8";
const BRAND_SELECTED = "#e8f5fe";
const BRAND_BORDER = "#e3e2f0";
const TEXT_PRIMARY = "#1a2c3e";

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

  const isSelected = (permisoId) => value.includes(permisoId);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Permisos
          </Typography>
          <Chip
            label={`${value.length} de ${permisosDisponibles.length}`}
            size="small"
            sx={{
              bgcolor: BRAND_LIGHT,
              color: TEXT_PRIMARY,
              border: `1px solid ${BRAND_BORDER}`,
              fontWeight: 500,
            }}
          />
        </Box>

        {!disabled && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleAll}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              borderColor: BRAND_BORDER,
              color: TEXT_PRIMARY,
              bgcolor: 'transparent',
              '&:hover': {
                borderColor: '#9aaebf',
                bgcolor: BRAND_LIGHT,
              },
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
            }}
          >
            {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          maxHeight: 320,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',      // Móvil: 1 columna
            sm: 'repeat(2, 1fr)',      // Tablet: 2 columnas
            md: 'repeat(3, 1fr)',      // Desktop: 3 columnas (máximo)
          },
          gap: 0.5,
          width: '100%',
          mt: 0.5,
        }}
      >
        {permisosDisponibles.map((permiso) => (
          <Button
            key={permiso.id}
            size="small"
            variant="text"
            onClick={() => handlePermisoChange(permiso.id)}
            disabled={disabled}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: isSelected(permiso.id) ? 600 : 400,
              fontSize: '0.8125rem',
              py: 0.75,
              px: 1.5,
              borderRadius: 1.5,
              backgroundColor: isSelected(permiso.id) ? BRAND_SELECTED : 'transparent',
              color: TEXT_PRIMARY,
              border: 'none',
              '&:hover': {
                backgroundColor: BRAND_LIGHT,
              },
              width: '100%',
              minWidth: 0,
              textAlign: 'left',
            }}
          >
            {permiso.nombre}
          </Button>
        ))}
      </Box>

      {error && (
        <FormHelperText error sx={{ mt: 1.5, fontSize: '0.75rem' }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}