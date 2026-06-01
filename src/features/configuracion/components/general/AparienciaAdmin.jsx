// features/configuracion/components/general/AparienciaAdmin.jsx
import {
  Box, Typography, TextField, Button,
  Grid, Alert, Divider
} from '@mui/material';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';

const BRAND_COLOR    = '#1a2540';
const BRAND_HOVER    = '#2d3a6b';
const TEXT_SECONDARY = '#64748b';
const BORDER_COLOR   = '#cbd5e1';

export default function AparienciaAdmin({ user, onUserUpdate }) {
  const {
    formData,
    fotoPerfil,
    loading,
    editMode,
    showPasswordForm,
    validationErrors,
    passwordData,
    puedeEditar,
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
    handlePasswordChange({ target: { name: 'contrasenia_actual',    value: '' } });
    handlePasswordChange({ target: { name: 'nueva_contrasenia',     value: '' } });
    handlePasswordChange({ target: { name: 'confirmar_contrasenia', value: '' } });
  };

  return (
    <Box sx={{ p: 3 }}>
      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />

      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Información Personal
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <UploadAvatar
            user={user}
            fotoPerfil={fotoPerfil}
            onUpload={handleFotoUpload}
            puedeEditar={editMode && puedeEditar}
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
              disabled={!editMode || !puedeEditar}
              required={editMode}
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
              disabled={!editMode || !puedeEditar}
              required={editMode}
              size="small"
              error={!!validationErrors.apellido}
              helperText={validationErrors.apellido}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={formData.correo || ''}
              disabled
              size="small"
              helperText="El correo no se puede modificar"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono principal"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              placeholder="Ej: 3001234567"
              error={!!validationErrors.telefono}
              helperText={validationErrors.telefono}
            />
          </Grid>
        </Grid>

        {/* Datos de Entrega */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Datos de Entrega
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              error={!!validationErrors.ciudad}
              helperText={validationErrors.ciudad}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Departamento"
              name="departamento"
              value={formData.departamento || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              error={!!validationErrors.departamento}
              helperText={validationErrors.departamento}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Dirección principal"
              name="direccion_principal"
              value={formData.direccion_principal || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              error={!!validationErrors.direccion_principal}
              helperText={validationErrors.direccion_principal}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Apto / Torre"
              name="apto_torre"
              value={formData.apto_torre || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              error={!!validationErrors.apto_torre}
              helperText={validationErrors.apto_torre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Barrio"
              name="barrio"
              value={formData.barrio || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              error={!!validationErrors.barrio}
              helperText={validationErrors.barrio}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del receptor"
              name="nombre_receptor"
              value={formData.nombre_receptor || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              error={!!validationErrors.nombre_receptor}
              helperText={validationErrors.nombre_receptor}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono de contacto (entrega)"
              name="telefono_entrega"
              value={formData.telefono_entrega || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              placeholder="Ej: 3007654321"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Indicaciones adicionales"
              name="indicaciones"
              value={formData.indicaciones || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              multiline
              rows={2}
              error={!!validationErrors.indicaciones}
              helperText={validationErrors.indicaciones}
            />
          </Grid>
        </Grid>

        {puedeEditar && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {!editMode ? (
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
                disabled={loading || isUpdating}
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
                  disabled={isUpdating}
                  sx={{
                    textTransform: 'none',
                    borderColor: BORDER_COLOR,
                    color: TEXT_SECONDARY,
                    '&:hover': {
                      borderColor: BRAND_HOVER,
                      color: BRAND_HOVER,
                      backgroundColor: `${BRAND_COLOR}12`
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
                    backgroundColor: BRAND_COLOR,
                    '&:hover': { backgroundColor: BRAND_HOVER },
                    textTransform: 'none',
                    boxShadow: 'none'
                  }}
                >
                  {isUpdating ? 'Guardando...' : 'Guardar'}
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
              disabled={isUpdatingPassword}
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
                    value={passwordData.contrasenia_actual || ''}
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
                    value={passwordData.nueva_contrasenia || ''}
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
                    value={passwordData.confirmar_contrasenia || ''}
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
                    borderColor: BORDER_COLOR,
                    color: TEXT_SECONDARY,
                    '&:hover': {
                      borderColor: BRAND_HOVER,
                      color: BRAND_HOVER,
                      backgroundColor: `${BRAND_COLOR}12`
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUpdatingPassword || !passwordData.nueva_contrasenia || !passwordData.contrasenia_actual}
                  sx={{
                    backgroundColor: BRAND_COLOR,
                    '&:hover': { backgroundColor: BRAND_HOVER },
                    textTransform: 'none',
                    boxShadow: 'none'
                  }}
                >
                  {isUpdatingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </Box>
            </form>
          )}
        </>
      )}
    </Box>
  );
}