import { Box, Typography, TextField, Button, Grid, Avatar, Alert, CircularProgress, Divider } from '@mui/material';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';

// Colores teal del tema Visual Outlet
const PRIMARY_COLOR = "#1a4a4a";
const PRIMARY_LIGHT = "#3d8080";
const PRIMARY_DARK = "#0d2e2e";
const ACCENT_COLOR = "#c9a050";
const SUCCESS_COLOR = "#1f7a6a";
const ERROR_COLOR = "#c94040";
const GRAY_500 = "#4e6e6e";
const GRAY_300 = "#b8d4d4";
const GRAY_100 = "#eaf3f3";

export default function AparienciaCliente({ user, onUserUpdate, canEdit = false }) {
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
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 2,
          color: PRIMARY_COLOR,
          fontWeight: 600
        }}
      >
        Mi Perfil
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}
      
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
              label="Nombre"
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
                  '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                },
              }}
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
                  '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
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
                  backgroundColor: PRIMARY_COLOR,
                  '&:hover': { backgroundColor: PRIMARY_DARK },
                  textTransform: 'none',
                  boxShadow: 'none',
                  borderRadius: 2
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
                    borderColor: GRAY_300,
                    color: GRAY_500,
                    '&:hover': {
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      backgroundColor: GRAY_100,
                    },
                    borderRadius: 2
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
                    '&:hover': { backgroundColor: PRIMARY_DARK },
                    textTransform: 'none',
                    boxShadow: 'none',
                    borderRadius: 2
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            )}
          </Box>
        )}
      </form>
      
      {puedeEditar && (
        <>
          <Divider sx={{ my: 3, borderColor: GRAY_300 }} />
          
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ color: PRIMARY_COLOR, fontWeight: 600 }}
          >
            Cambiar Contraseña
          </Typography>
          
          {!showPasswordForm ? (
            <Button 
              variant="contained" 
              onClick={() => setShowPasswordForm(true)}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                '&:hover': { backgroundColor: PRIMARY_DARK },
                textTransform: 'none',
                boxShadow: 'none',
                borderRadius: 2
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
                    }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
                    }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY_COLOR },
                    }}
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
                    borderColor: GRAY_300,
                    color: GRAY_500,
                    '&:hover': {
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      backgroundColor: GRAY_100,
                    },
                    borderRadius: 2
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !passwordData.nueva_contrasenia || !passwordData.contrasenia_actual}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    '&:hover': { backgroundColor: PRIMARY_DARK },
                    textTransform: 'none',
                    boxShadow: 'none',
                    borderRadius: 2
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