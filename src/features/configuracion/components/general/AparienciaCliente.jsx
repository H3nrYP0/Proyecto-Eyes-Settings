import { Box, Typography, TextField, Button, Grid, Avatar, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useConfiguracion } from '../../hooks/useConfiguracion';

// Colores frescos y minimalistas
const PRIMARY_COLOR = "#1a4a4a";
const PRIMARY_DARK = "#0d2e2e";
const SUCCESS_COLOR = "#1f7a6a";
const GRAY_500 = "#4e6e6e";
const GRAY_300 = "#b8d4d4";
const GRAY_100 = "#eaf3f3";

export default function AparienciaCliente({ user, onUserUpdate, canEdit = false }) {
  const navigate = useNavigate();
  
  const {
    formData,
    loading,
    error,
    success,
    editMode,
    showPasswordForm,
    validationErrors,
    passwordData,
    puedeEditar,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handlePasswordSubmit,
    handleCancelEdit,
    setEditMode,
    setShowPasswordForm,
    hasValidChanges
  } = useConfiguracion(user, onUserUpdate);

  const handleVolver = () => navigate(-1);

  // TODO: Implementar carga de foto de perfil en el backend
  // La foto se guardará en el servidor y se almacenará la URL en la base de datos
  // Por ahora se muestra un avatar con la inicial del nombre

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Alertas */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Avatar - solo visual, sin edición (pendiente implementar subida a backend) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: PRIMARY_COLOR,
            fontSize: 40
          }}
        >
          {user?.nombre?.charAt(0)?.toUpperCase() || user?.correo?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
      </Box>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Fila 1: Nombre completo y Correo */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre completo"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              variant="outlined"
              error={!!validationErrors.nombre}
              helperText={validationErrors.nombre}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="correo"
              type="email"
              value={formData.correo || ''}
              disabled
              size="small"
              variant="outlined"
              helperText="No se puede modificar"
            />
          </Grid>
          
          {/* Fila 2: Teléfono y Dirección */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              variant="outlined"
              placeholder="300 123 4567"
              error={!!validationErrors.telefono}
              helperText={validationErrors.telefono}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Botones de acción */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!editMode ? (
            <Button 
              variant="contained" 
              onClick={() => setEditMode(true)} 
              disabled={loading}
              sx={{ 
                bgcolor: PRIMARY_COLOR, 
                '&:hover': { bgcolor: PRIMARY_DARK },
                textTransform: 'none',
                px: 4
              }}
            >
              Editar
            </Button>
          ) : (
            <>
              <Button 
                variant="outlined" 
                onClick={handleCancelEdit} 
                disabled={loading}
                sx={{ 
                  textTransform: 'none',
                  borderColor: GRAY_300,
                  color: GRAY_500,
                  '&:hover': {
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                    backgroundColor: GRAY_100,
                  }
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading || !hasValidChanges()}
                sx={{ 
                  bgcolor: SUCCESS_COLOR, 
                  '&:hover': { bgcolor: PRIMARY_DARK },
                  textTransform: 'none',
                  px: 4
                }}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        </Box>
      </form>

      {/* Cambiar contraseña */}
      {editMode && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ color: PRIMARY_COLOR }}>
            Cambiar contraseña
          </Typography>
          
          {!showPasswordForm ? (
            <Button 
              variant="outlined" 
              onClick={() => setShowPasswordForm(true)}
              sx={{ 
                textTransform: 'none',
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
                '&:hover': {
                  borderColor: PRIMARY_DARK,
                  color: PRIMARY_DARK,
                  backgroundColor: GRAY_100,
                }
              }}
            >
              Cambiar contraseña
            </Button>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Contraseña actual"
                    name="contrasenia_actual"
                    type="password"
                    value={passwordData?.contrasenia_actual || ''}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Nueva contraseña"
                    name="nueva_contrasenia"
                    type="password"
                    value={passwordData?.nueva_contrasenia || ''}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                    helperText="Mínimo 6 caracteres"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Confirmar contraseña"
                    name="confirmar_contrasenia"
                    type="password"
                    value={passwordData?.confirmar_contrasenia || ''}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowPasswordForm(false)}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: GRAY_300,
                    color: GRAY_500,
                    '&:hover': {
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      backgroundColor: GRAY_100,
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handlePasswordSubmit}
                  disabled={loading || !passwordData?.nueva_contrasenia || !passwordData?.contrasenia_actual}
                  sx={{ 
                    bgcolor: PRIMARY_COLOR, 
                    '&:hover': { bgcolor: PRIMARY_DARK },
                    textTransform: 'none',
                    px: 4
                  }}
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}