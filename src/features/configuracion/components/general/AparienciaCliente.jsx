// features/configuracion/components/general/AparienciaCliente.jsx
import { Box, Typography, TextField, Button, Grid, Divider } from '@mui/material';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';

const PRIMARY_COLOR = "#1a4a4a";
const PRIMARY_DARK = "#0d2e2e";
const SUCCESS_COLOR = "#1f7a6a";
const GRAY_500 = "#4e6e6e";
const GRAY_300 = "#b8d4d4";
const GRAY_100 = "#eaf3f3";

export default function AparienciaCliente({ user, onUserUpdate }) {
  const {
    formData,
    fotoPerfil,
    editMode,
    showPasswordForm,
    validationErrors,
    passwordData,
    notification,
    handleCloseNotification,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handlePasswordSubmit,
    handleCancelEdit,
    setEditMode,
    setShowPasswordForm,
    handleFotoUpload,
    hasValidChanges,
    isUpdating,
    isUpdatingPassword
  } = useConfiguracion(user, onUserUpdate);

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    handlePasswordChange({ target: { name: 'contrasenia_actual', value: '' } });
    handlePasswordChange({ target: { name: 'nueva_contrasenia', value: '' } });
    handlePasswordChange({ target: { name: 'confirmar_contrasenia', value: '' } });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <UploadAvatar
            user={user}
            fotoPerfil={fotoPerfil}
            onUpload={handleFotoUpload}
            puedeEditar={editMode}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              error={!!validationErrors.nombre}
              helperText={validationErrors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              error={!!validationErrors.apellido}
              helperText={validationErrors.apellido}
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
              helperText="No se puede modificar"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono principal"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              placeholder="300 123 4567"
              error={!!validationErrors.telefono}
              helperText={validationErrors.telefono}
            />
          </Grid>

          {/* Datos de entrega completos */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, color: PRIMARY_COLOR }}>
              Datos de entrega
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Departamento"
              name="departamento"
              value={formData.departamento || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Dirección principal"
              name="direccion_principal"
              value={formData.direccion_principal || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Apto / Torre"
              name="apto_torre"
              value={formData.apto_torre || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Barrio"
              name="barrio"
              value={formData.barrio || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del receptor"
              name="nombre_receptor"
              value={formData.nombre_receptor || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono de contacto (entrega)"
              name="telefono_entrega"
              value={formData.telefono_entrega || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Indicaciones adicionales"
              name="indicaciones"
              value={formData.indicaciones || ''}
              onChange={handleChange}
              disabled={!editMode}
              size="small"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!editMode ? (
            <Button
              variant="contained"
              onClick={() => setEditMode(true)}
              disabled={isUpdating}
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
                disabled={isUpdating}
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
                disabled={isUpdating || !hasValidChanges()}
                sx={{
                  bgcolor: SUCCESS_COLOR,
                  '&:hover': { bgcolor: PRIMARY_DARK },
                  textTransform: 'none',
                  px: 4
                }}
              >
                {isUpdating ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        </Box>
      </form>

      {/* Cambiar contraseña */}
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
                onClick={handleCancelPassword}
                disabled={isUpdatingPassword}
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
                disabled={isUpdatingPassword || !passwordData?.nueva_contrasenia || !passwordData?.contrasenia_actual}
                sx={{
                  bgcolor: PRIMARY_COLOR,
                  '&:hover': { bgcolor: PRIMARY_DARK },
                  textTransform: 'none',
                  px: 4
                }}
              >
                {isUpdatingPassword ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </Box>
          </Box>
        )}
      </>
    </Box>
  );
}