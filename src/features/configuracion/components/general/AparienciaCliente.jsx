/**
 * Formulario de perfil para clientes, con los mismos componentes de validación y límites.
 */

import { Box, Typography, Button, Grid, Divider, MenuItem } from '@mui/material';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import TextFieldLetters from '@shared/components/base/TextFieldLetters';
import TextFieldNumbers from '@shared/components/base/TextFieldNumbers';
import TextFieldAlphanumeric from '@shared/components/base/TextFieldAlphanumeric';

const PRIMARY_COLOR = "#1a4a4a";
const PRIMARY_DARK = "#0d2e2e";
const SUCCESS_COLOR = "#1f7a6a";
const GRAY_500 = "#4e6e6e";
const GRAY_300 = "#b8d4d4";
const GRAY_100 = "#eaf3f3";

const genderOptions = ['Masculino', 'Femenino', 'Otro'];
const docTypeOptions = ['CC', 'TI', 'CE', 'PA'];

const LIMITS = {
  NOMBRE: 70,
  APELLIDO: 70,
  TELEFONO: 20,
  NUMERO_DOCUMENTO: 20,
  MUNICIPIO: 50,
  DEPARTAMENTO: 50,
  DIRECCION: 100,
  BARRIO: 50,
  CODIGO_POSTAL: 10,
  OCUPACION: 20,
  TELEFONO_EMERGENCIA: 20
};

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
          <UploadAvatar user={user} fotoPerfil={fotoPerfil} onUpload={handleFotoUpload} puedeEditar={editMode} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth label="Nombre" name="nombre" value={formData.nombre || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.NOMBRE}
              error={!!validationErrors.nombre} helperText={validationErrors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth label="Apellido" name="apellido" value={formData.apellido || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.APELLIDO}
              error={!!validationErrors.apellido} helperText={validationErrors.apellido}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth label="Correo electrónico" name="correo" value={formData.correo || ''}
              disabled size="small" helperText="No se puede modificar"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
              fullWidth label="Teléfono principal" name="telefono" value={formData.telefono || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.TELEFONO}
              placeholder="3001234567" error={!!validationErrors.telefono} helperText={validationErrors.telefono}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              select fullWidth label="Tipo de documento" name="tipo_documento"
              value={formData.tipo_documento || ''} onChange={handleChange} disabled={!editMode} size="small"
            >
              {docTypeOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextFieldLetters>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldAlphanumeric
              fullWidth label="Número de documento" name="numero_documento"
              value={formData.numero_documento || ''} onChange={handleChange} disabled={!editMode}
              size="small" maxLength={LIMITS.NUMERO_DOCUMENTO}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldAlphanumeric
              fullWidth label="Fecha de nacimiento" name="fecha_nacimiento" type="date"
              value={formData.fecha_nacimiento || ''} onChange={handleChange} disabled={!editMode}
              size="small" InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              select fullWidth label="Género" name="genero" value={formData.genero || ''}
              onChange={handleChange} disabled={!editMode} size="small"
            >
              {genderOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextFieldLetters>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, color: PRIMARY_COLOR }}>Dirección y ubicación</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth label="Departamento" name="departamento" value={formData.departamento || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.DEPARTAMENTO}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth label="Municipio / Ciudad" name="municipio" value={formData.municipio || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.MUNICIPIO}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextFieldAlphanumeric
              fullWidth label="Dirección" name="direccion" value={formData.direccion || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.DIRECCION}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextFieldLetters
              fullWidth label="Barrio" name="barrio" value={formData.barrio || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.BARRIO}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
              fullWidth label="Código postal" name="codigo_postal" value={formData.codigo_postal || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.CODIGO_POSTAL}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth label="Ocupación" name="ocupacion" value={formData.ocupacion || ''}
              onChange={handleChange} disabled={!editMode} size="small" maxLength={LIMITS.OCUPACION}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
              fullWidth label="Teléfono de emergencia" name="telefono_emergencia"
              value={formData.telefono_emergencia || ''} onChange={handleChange} disabled={!editMode}
              size="small" maxLength={LIMITS.TELEFONO_EMERGENCIA} placeholder="3007654321"
              error={!!validationErrors.telefono_emergencia} helperText={validationErrors.telefono_emergencia}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!editMode ? (
            <Button variant="contained" onClick={() => setEditMode(true)} disabled={isUpdating}
              sx={{ bgcolor: PRIMARY_COLOR, '&:hover': { bgcolor: PRIMARY_DARK }, textTransform: 'none', px: 4 }}>
              Editar
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={handleCancelEdit} disabled={isUpdating}
                sx={{ textTransform: 'none', borderColor: GRAY_300, color: GRAY_500 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={isUpdating || !hasValidChanges()}
                sx={{ bgcolor: SUCCESS_COLOR, '&:hover': { bgcolor: PRIMARY_DARK }, textTransform: 'none', px: 4 }}>
                {isUpdating ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        </Box>
      </form>

      {/* Cambiar contraseña (similar a admin) */}
      <>
        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" gutterBottom sx={{ color: PRIMARY_COLOR }}>Cambiar contraseña</Typography>
        {!showPasswordForm ? (
          <Button variant="outlined" onClick={() => setShowPasswordForm(true)}
            sx={{ textTransform: 'none', borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}>
            Cambiar contraseña
          </Button>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextFieldAlphanumeric
                  fullWidth label="Contraseña actual" name="contrasenia_actual" type="password"
                  value={passwordData.contrasenia_actual || ''} onChange={handlePasswordChange} required size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextFieldAlphanumeric
                  fullWidth label="Nueva contraseña" name="nueva_contrasenia" type="password"
                  value={passwordData.nueva_contrasenia || ''} onChange={handlePasswordChange} required size="small"
                  helperText="Mínimo 6 caracteres, una mayúscula y un número"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextFieldAlphanumeric
                  fullWidth label="Confirmar contraseña" name="confirmar_contrasenia" type="password"
                  value={passwordData.confirmar_contrasenia || ''} onChange={handlePasswordChange} required size="small"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleCancelPassword} disabled={isUpdatingPassword}>Cancelar</Button>
              <Button variant="contained" onClick={handlePasswordSubmit}
                disabled={isUpdatingPassword || !passwordData.nueva_contrasenia}
                sx={{ bgcolor: PRIMARY_COLOR, '&:hover': { bgcolor: PRIMARY_DARK } }}>
                {isUpdatingPassword ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </Box>
          </Box>
        )}
      </>
    </Box>
  );
}