// features/configuracion/componentes/general/Apariencia.jsx
import { Box, Typography, TextField, Button, Grid, Avatar, Alert, CircularProgress, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';  // ← Importar useTheme
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';

export default function Apariencia({ user, onUserUpdate, canEdit = false }) {
  const theme = useTheme(); 
  
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
    esCliente,
    esAdmin,
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

  const campos = {
    cliente: ['nombre', 'email', 'telefono'],
    admin: ['nombre', 'email', 'telefono', 'fechaNacimiento', 'tipoDocumento', 'numeroDocumento'],
    empleado: ['nombre', 'email', 'telefono', 'fechaNacimiento']
  };

  const camposActivos = esCliente ? campos.cliente : esAdmin ? campos.admin : campos.empleado;

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 2,
          color: theme.palette.text.primary,  // Color del texto del tema
          fontWeight: 600
        }}
      >
        Información Personal
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
          {/* Avatar */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <UploadAvatar 
              user={user} 
              fotoPerfil={fotoPerfil} 
              onUpload={handleFotoUpload}
              puedeEditar={puedeEditar && editMode}
            />
          </Grid>
          
          {/* Campos dinámicos según rol */}
          {camposActivos.includes('nombre') && (
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
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
          )}
          
          {camposActivos.includes('email') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                disabled
                size="small"
                helperText="El correo no se puede modificar"
              />
            </Grid>
          )}
          
          {camposActivos.includes('telefono') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={!editMode || !puedeEditar}
                size="small"
                error={!!validationErrors.telefono}
                helperText={validationErrors.telefono}
              />
            </Grid>
          )}
          
          {camposActivos.includes('fechaNacimiento') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                disabled={!editMode || !puedeEditar}
                InputLabelProps={{ shrink: true }}
                size="small"
                error={!!validationErrors.fechaNacimiento}
                helperText={validationErrors.fechaNacimiento}
              />
            </Grid>
          )}
          
          {camposActivos.includes('tipoDocumento') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Documento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                disabled
                size="small"
              />
            </Grid>
          )}
          
          {camposActivos.includes('numeroDocumento') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Documento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                disabled
                size="small"
              />
            </Grid>
          )}
        </Grid>
        
        {/* Botones de acción */}
        {puedeEditar && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {!editMode ? (
              <Button 
                variant="contained" 
                onClick={() => setEditMode(true)} 
                disabled={loading}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  textTransform: 'none',
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
                    borderColor: theme.palette.grey[400],
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      borderColor: theme.palette.grey[600],
                      backgroundColor: theme.palette.action.hover,
                    },
                    textTransform: 'none',
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
                    backgroundColor: theme.palette.success.main,
                    '&:hover': {
                      backgroundColor: theme.palette.success.dark,
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.action.disabledBackground,
                    },
                    textTransform: 'none',
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
      
      {/* Cambiar Contraseña */}
      {puedeEditar && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Cambiar Contraseña
          </Typography>
          
          {!showPasswordForm ? (
            <Button 
              variant="outlined" 
              onClick={() => setShowPasswordForm(true)}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.light + '20',
                },
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Cambiar Contraseña
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
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
                    setPasswordData({ newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                  sx={{
                    borderColor: theme.palette.grey[400],
                    color: theme.palette.text.secondary,
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !passwordData.newPassword}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    textTransform: 'none',
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