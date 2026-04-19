import { Box, Typography, TextField, Button, Grid, Avatar, Alert, CircularProgress, Divider } from '@mui/material';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';

// Colores del panel admin
const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";
const ACCENT_COLOR = "#3b82f6";
const SUCCESS_COLOR = "#22c55e";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

export default function Apariencia({ user, onUserUpdate, canEdit = false }) {
  const {
    formData,
    fotoPerfil,
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
    handleFotoUpload,
    hasValidChanges
  } = useConfiguracion(user, onUserUpdate);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Información Personal
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <UploadAvatar 
              user={user} 
              fotoPerfil={fotoPerfil} 
              onUpload={handleFotoUpload}
              puedeEditar={puedeEditar && editMode}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre Completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              required={editMode}
              size="small"
              error={!!validationErrors.nombre}
              helperText={validationErrors.nombre}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: ACCENT_COLOR },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: ACCENT_COLOR },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={formData.correo}
              disabled
              size="small"
              helperText="El correo no se puede modificar"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              placeholder="Ej: 3001234567"
              error={!!validationErrors.telefono}
              helperText={validationErrors.telefono}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: ACCENT_COLOR },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: ACCENT_COLOR },
              }}
            />
          </Grid>
        </Grid>
        
        {puedeEditar && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {!editMode ? (
              <Button 
                variant="contained" 
                onClick={() => setEditMode(true)} 
                disabled={loading}
                sx={{
                  backgroundColor: BRAND_COLOR,
                  '&:hover': { backgroundColor: BRAND_HOVER },
                  textTransform: 'none',
                  boxShadow: 'none'
                }}
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  onClick={handleCancelEdit} 
                  disabled={loading}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: BORDER_COLOR,
                    color: TEXT_SECONDARY,
                    '&:hover': {
                      borderColor: BRAND_HOVER,
                      color: BRAND_HOVER,
                      backgroundColor: `${BRAND_COLOR}12`,
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
                    backgroundColor: SUCCESS_COLOR,
                    '&:hover': { backgroundColor: '#16a34a' },
                    textTransform: 'none',
                    boxShadow: 'none'
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            )}
          </Box>
        )}
      </form>
      
      {/* Cambiar Contraseña */}
      {puedeEditar && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Cambiar Contraseña
          </Typography>
          
          {!showPasswordForm ? (
            <Button 
              variant="contained" 
              onClick={() => setShowPasswordForm(true)}
              sx={{
                backgroundColor: BRAND_COLOR,
                '&:hover': { backgroundColor: BRAND_HOVER },
                textTransform: 'none',
                boxShadow: 'none'
              }}
            >
              Cambiar Contraseña
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Contraseña Actual"
                    name="contrasenia_actual"
                    type="password"
                    value={passwordData.contrasenia_actual}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    name="nueva_contrasenia"
                    type="password"
                    value={passwordData.nueva_contrasenia}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                    helperText="Mínimo 6 caracteres"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    name="confirmar_contrasenia"
                    type="password"
                    value={passwordData.confirmar_contrasenia}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: '' });
                    setError('');
                  }}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: BORDER_COLOR,
                    color: TEXT_SECONDARY,
                    '&:hover': {
                      borderColor: BRAND_HOVER,
                      color: BRAND_HOVER,
                      backgroundColor: `${BRAND_COLOR}12`,
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !passwordData.nueva_contrasenia || !passwordData.contrasenia_actual}
                  sx={{
                    backgroundColor: BRAND_COLOR,
                    '&:hover': { backgroundColor: BRAND_HOVER },
                    textTransform: 'none',
                    boxShadow: 'none'
                  }}
                >
                  {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </Box>
            </form>
          )}
        </>
      )}
    </Box>
  );
}