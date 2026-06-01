/**
 * Formulario de perfil para administradores/empleados.
 * Utiliza componentes de validación personalizados (solo letras, solo números, etc.)
 * y aplica los límites máximos según los modelos de base de datos.
 */

import {
  Box, Typography, Button, Grid, Divider, MenuItem
} from '@mui/material';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import UploadAvatar from './UploadAvatar';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
// Importación de componentes base validados
import TextFieldLetters from '@shared/components/base/TextFieldLetters';
import TextFieldNumbers from '@shared/components/base/TextFieldNumbers';
import TextFieldAlphanumeric from '@shared/components/base/TextFieldAlphanumeric';

const BRAND_COLOR    = '#1a2540';
const BRAND_HOVER    = '#2d3a6b';
const TEXT_SECONDARY = '#64748b';
const BORDER_COLOR   = '#cbd5e1';

// Opciones para selects
const genderOptions = ['Masculino', 'Femenino', 'Otro'];
const docTypeOptions = ['CC', 'TI', 'CE', 'PA'];

// Límites según modelos
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
          {/* Nombre - solo letras */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              required={editMode}
              size="small"
              maxLength={LIMITS.NOMBRE}
              error={!!validationErrors.nombre}
              helperText={validationErrors.nombre}
            />
          </Grid>
          {/* Apellido - solo letras */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              required={editMode}
              size="small"
              maxLength={LIMITS.APELLIDO}
              error={!!validationErrors.apellido}
              helperText={validationErrors.apellido}
            />
          </Grid>
          {/* Correo - solo lectura */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
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
          {/* Teléfono - solo números */}
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
              fullWidth
              label="Teléfono principal"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.TELEFONO}
              placeholder="3001234567"
              error={!!validationErrors.telefono}
              helperText={validationErrors.telefono}
            />
          </Grid>
          {/* Tipo de documento - select */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              select
              fullWidth
              label="Tipo de documento"
              name="tipo_documento"
              value={formData.tipo_documento || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
            >
              {docTypeOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextFieldLetters>
          </Grid>
          {/* Número de documento - alfanumérico (puede tener letras y números) */}
          <Grid item xs={12} sm={6}>
            <TextFieldAlphanumeric
              fullWidth
              label="Número de documento"
              name="numero_documento"
              value={formData.numero_documento || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.NUMERO_DOCUMENTO}
              error={!!validationErrors.numero_documento}
              helperText={validationErrors.numero_documento}
            />
          </Grid>
          {/* Fecha nacimiento - tipo date (no necesita filtro especial) */}
          <Grid item xs={12} sm={6}>
            <TextFieldAlphanumeric
              fullWidth
              label="Fecha de nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              InputLabelProps={{ shrink: true }}
              error={!!validationErrors.fecha_nacimiento}
              helperText={validationErrors.fecha_nacimiento}
            />
          </Grid>
          {/* Género - select con opciones normalizadas */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              select
              fullWidth
              label="Género"
              name="genero"
              value={formData.genero || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
            >
              {genderOptions.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextFieldLetters>
          </Grid>
        </Grid>

        {/* Datos de ubicación (igual que en el formulario de pedido) */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Dirección y ubicación
        </Typography>
        <Grid container spacing={2}>
          {/* Departamento - solo letras */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth
              label="Departamento"
              name="departamento"
              value={formData.departamento || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.DEPARTAMENTO}
            />
          </Grid>
          {/* Municipio / Ciudad - solo letras */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth
              label="Municipio / Ciudad"
              name="municipio"
              value={formData.municipio || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.MUNICIPIO}
            />
          </Grid>
          {/* Dirección - alfanumérico (permite números y letras) */}
          <Grid item xs={12} sm={8}>
            <TextFieldAlphanumeric
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.DIRECCION}
            />
          </Grid>
          {/* Barrio - solo letras */}
          <Grid item xs={12} sm={4}>
            <TextFieldLetters
              fullWidth
              label="Barrio"
              name="barrio"
              value={formData.barrio || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.BARRIO}
            />
          </Grid>
          {/* Código postal - solo números */}
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
              fullWidth
              label="Código postal"
              name="codigo_postal"
              value={formData.codigo_postal || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.CODIGO_POSTAL}
            />
          </Grid>
          {/* Ocupación - solo letras */}
          <Grid item xs={12} sm={6}>
            <TextFieldLetters
              fullWidth
              label="Ocupación"
              name="ocupacion"
              value={formData.ocupacion || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.OCUPACION}
            />
          </Grid>
          {/* Teléfono de emergencia - solo números */}
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
              fullWidth
              label="Teléfono de emergencia"
              name="telefono_emergencia"
              value={formData.telefono_emergencia || ''}
              onChange={handleChange}
              disabled={!editMode || !puedeEditar}
              size="small"
              maxLength={LIMITS.TELEFONO_EMERGENCIA}
              placeholder="3007654321"
              error={!!validationErrors.telefono_emergencia}
              helperText={validationErrors.telefono_emergencia}
            />
          </Grid>
        </Grid>

        {/* Botones de acción */}
        {puedeEditar && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {!editMode ? (
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
                disabled={loading || isUpdating}
                sx={{ backgroundColor: BRAND_COLOR, '&:hover': { backgroundColor: BRAND_HOVER }, textTransform: 'none' }}
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button variant="outlined" onClick={handleCancelEdit} disabled={isUpdating} sx={{ textTransform: 'none' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUpdating || !hasValidChanges()}
                  sx={{ backgroundColor: BRAND_COLOR, '&:hover': { backgroundColor: BRAND_HOVER }, textTransform: 'none' }}
                >
                  {isUpdating ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            )}
          </Box>
        )}
      </form>

      {/* Sección de cambio de contraseña (sin cambios) */}
      {puedeEditar && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>Cambiar Contraseña</Typography>
          {!showPasswordForm ? (
            <Button
              variant="contained"
              onClick={() => setShowPasswordForm(true)}
              disabled={isUpdatingPassword}
              sx={{ backgroundColor: BRAND_COLOR, '&:hover': { backgroundColor: BRAND_HOVER }, textTransform: 'none' }}
            >
              Cambiar Contraseña
            </Button>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextFieldAlphanumeric
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
                  <TextFieldAlphanumeric
                    fullWidth
                    label="Nueva Contraseña"
                    name="nueva_contrasenia"
                    type="password"
                    value={passwordData.nueva_contrasenia || ''}
                    onChange={handlePasswordChange}
                    required
                    size="small"
                    helperText="Mínimo 6 caracteres, una mayúscula y un número"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextFieldAlphanumeric
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
                <Button variant="outlined" onClick={handleCancelPassword} disabled={isUpdatingPassword}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={isUpdatingPassword || !passwordData.nueva_contrasenia}>
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