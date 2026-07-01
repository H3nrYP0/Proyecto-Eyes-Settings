/**
 * Formulario de perfil para clientes.
 * Diseño compacto (centrado, ancho limitado) y todos los campos en 3 columnas.
 * Incluye cambio de contraseña con toggle de visibilidad.
 * La sección de contraseña tiene el mismo diseño que admin.
 */

import {
  Box, Typography, Button, Grid, Divider, MenuItem, TextField,
  InputAdornment, IconButton, Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import UploadAvatar from './UploadAvatar';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import TextFieldLetters from '@shared/components/base/TextFieldLetters';
import TextFieldNumbers from '@shared/components/base/TextFieldNumbers';
import TextFieldAlphanumeric from '@shared/components/base/TextFieldAlphanumeric';

// Colores para el perfil (cliente)
const PRIMARY_COLOR = '#1a4a4a';
const PRIMARY_DARK  = '#0d2e2e';
const SUCCESS_COLOR = '#1f7a6a';
const GRAY_500      = '#4e6e6e';
const GRAY_300      = '#b8d4d4';

// Colores para la sección de contraseña (unificados con admin)
const BRAND_COLOR    = '#1a2540';
const BRAND_HOVER    = '#2d3a6b';
const BORDER_COLOR   = '#cbd5e1';

const genderOptions  = ['Masculino', 'Femenino', 'Otro'];
const docTypeOptions = ['CC', 'CE', 'PA'];

const LIMITS = {
  NOMBRE: 70, APELLIDO: 70, TELEFONO: 10, NUMERO_DOCUMENTO: 10,
  MUNICIPIO: 50, DEPARTAMENTO: 50, DIRECCION: 100, BARRIO: 50,
  CODIGO_POSTAL: 10, OCUPACION: 20, TELEFONO_EMERGENCIA: 10,
  APTO: 20, NOMBRE_RECEPTOR: 70, TELEFONO_ENTREGA: 10, INDICACIONES: 200,
};

const PasswordField = ({ label, name, value, onChange, required, disabled, size, fullWidth, error, helperText, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleToggle = () => setShowPassword((prev) => !prev);

  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      size={size || 'small'}
      fullWidth={fullWidth !== undefined ? fullWidth : true}
      error={!!error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleToggle} edge="end" size="small" tabIndex={-1}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};

export default function AparienciaCliente({ user, onUserUpdate, configuracion, canEdit }) {
  const {
    formData, fotoPerfil, editMode, showPasswordForm,
    validationErrors, passwordData, passwordErrors, notification,
    handleCloseNotification, handleChange, handlePasswordChange,
    handleSubmit, handlePasswordSubmit, handleCancelEdit,
    handleCancelPassword, setEditMode, setShowPasswordForm,
    handleFotoUpload, hasAnyChange, isUpdating, isUpdatingPassword,
  } = configuracion;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ maxWidth: 'lg', width: '100%', p: 3, borderRadius: 2 }}>
        <CrudNotification
          isVisible={notification.isVisible}
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />

        {/* ========== FORMULARIO DE PERFIL ========== */}
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
            {/* 3 columnas: sm={4} */}
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Nombre *" name="nombre" value={formData.nombre || ''}
                onChange={handleChange} disabled={!editMode} size="small"
                maxLength={LIMITS.NOMBRE}
                error={!!validationErrors.nombre} helperText={validationErrors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Apellido *" name="apellido" value={formData.apellido || ''}
                onChange={handleChange} disabled={!editMode} size="small"
                maxLength={LIMITS.APELLIDO}
                error={!!validationErrors.apellido} helperText={validationErrors.apellido}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Correo electrónico" name="correo"
                value={formData.correo || ''} disabled size="small"
                helperText="No se puede modificar"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldNumbers
                fullWidth label="Teléfono principal" name="telefono"
                value={formData.telefono || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.TELEFONO}
                placeholder="3001234567"
                error={!!validationErrors.telefono} helperText={validationErrors.telefono}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select fullWidth label="Tipo de documento" name="tipo_documento"
                value={formData.tipo_documento || ''} onChange={handleChange}
                disabled={!editMode} size="small"
              >
                {docTypeOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldNumbers
                fullWidth label="Número de documento" name="numero_documento"
                value={formData.numero_documento || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.NUMERO_DOCUMENTO}
                error={!!validationErrors.numero_documento}
                helperText={validationErrors.numero_documento}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldAlphanumeric
                fullWidth label="Fecha de nacimiento" name="fecha_nacimiento" type="date"
                value={formData.fecha_nacimiento || ''} onChange={handleChange}
                disabled={!editMode} size="small" InputLabelProps={{ shrink: true }}
                error={!!validationErrors.fecha_nacimiento}
                helperText={validationErrors.fecha_nacimiento}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select fullWidth label="Género" name="genero"
                value={formData.genero || ''} onChange={handleChange}
                disabled={!editMode} size="small"
              >
                {genderOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, color: PRIMARY_COLOR }}>
                Dirección y ubicación
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Departamento" name="departamento"
                value={formData.departamento || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.DEPARTAMENTO}
                error={!!validationErrors.departamento}
                helperText={validationErrors.departamento}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Municipio / Ciudad" name="municipio"
                value={formData.municipio || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.MUNICIPIO}
                error={!!validationErrors.municipio}
                helperText={validationErrors.municipio}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldAlphanumeric
                fullWidth label="Dirección" name="direccion"
                value={formData.direccion || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.DIRECCION}
                error={!!validationErrors.direccion}
                helperText={validationErrors.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Barrio" name="barrio"
                value={formData.barrio || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.BARRIO}
                error={!!validationErrors.barrio}
                helperText={validationErrors.barrio}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldNumbers
                fullWidth label="Código postal" name="codigo_postal"
                value={formData.codigo_postal || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.CODIGO_POSTAL}
                error={!!validationErrors.codigo_postal}
                helperText={validationErrors.codigo_postal}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Ocupación" name="ocupacion"
                value={formData.ocupacion || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.OCUPACION}
                error={!!validationErrors.ocupacion}
                helperText={validationErrors.ocupacion}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldNumbers
                fullWidth label="Teléfono de emergencia" name="telefono_emergencia"
                value={formData.telefono_emergencia || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.TELEFONO_EMERGENCIA}
                placeholder="3007654321"
                error={!!validationErrors.telefono_emergencia}
                helperText={validationErrors.telefono_emergencia}
              />
            </Grid>

            {/* Campos específicos de entrega (no se repiten Departamento/Municipio/
                Dirección/Barrio porque ya están arriba en esta misma sección) */}
            <Grid item xs={12} sm={4}>
              <TextFieldAlphanumeric
                fullWidth label="Apto / Torre" name="apto_torre"
                value={formData.apto_torre || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.APTO}
                error={!!validationErrors.apto_torre}
                helperText={validationErrors.apto_torre}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldLetters
                fullWidth label="Nombre del receptor *" name="nombre_receptor"
                value={formData.nombre_receptor || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.NOMBRE_RECEPTOR}
                error={!!validationErrors.nombre_receptor}
                helperText={validationErrors.nombre_receptor}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextFieldNumbers
                fullWidth label="Celular *" name="telefono_entrega"
                value={formData.telefono_entrega || ''} onChange={handleChange}
                disabled={!editMode} size="small" maxLength={LIMITS.TELEFONO_ENTREGA}
                placeholder="3001234567"
                error={!!validationErrors.telefono_entrega}
                helperText={validationErrors.telefono_entrega}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth label="Indicaciones" name="indicaciones"
                value={formData.indicaciones || ''} onChange={handleChange}
                disabled={!editMode} size="small" multiline rows={2}
                error={!!validationErrors.indicaciones}
                helperText={validationErrors.indicaciones}
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
                  px: 4,
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
                  sx={{ textTransform: 'none', borderColor: GRAY_300, color: GRAY_500 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUpdating || !hasAnyChange()}
                  sx={{
                    bgcolor: SUCCESS_COLOR,
                    '&:hover': { bgcolor: PRIMARY_DARK },
                    textTransform: 'none',
                    px: 4,
                  }}
                >
                  {isUpdating ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            )}
          </Box>
        </form>

        {/* ========== CAMBIAR CONTRASEÑA (unificado con admin) ========== */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Cambiar Contraseña
        </Typography>

        {!showPasswordForm ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => setShowPasswordForm(true)}
              disabled={isUpdatingPassword}
              sx={{
                backgroundColor: BRAND_COLOR,
                '&:hover': { backgroundColor: BRAND_HOVER },
                textTransform: 'none',
              }}
            >
              Cambiar Contraseña
            </Button>
          </Box>
        ) : (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <PasswordField
                  fullWidth
                  label="Contraseña actual"
                  name="contrasenia_actual"
                  value={passwordData.contrasenia_actual || ''}
                  onChange={handlePasswordChange}
                  required
                  size="small"
                  error={!!passwordErrors?.contrasenia_actual}
                  helperText={passwordErrors?.contrasenia_actual || ''}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PasswordField
                  fullWidth
                  label="Nueva contraseña"
                  name="nueva_contrasenia"
                  value={passwordData.nueva_contrasenia || ''}
                  onChange={handlePasswordChange}
                  required
                  size="small"
                  error={!!passwordErrors?.nueva_contrasenia}
                  helperText={passwordErrors?.nueva_contrasenia || 'Mínimo 8 caracteres, mayúscula, minúscula, número, y no común ni basada en nombre/correo'}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PasswordField
                  fullWidth
                  label="Confirmar contraseña"
                  name="confirmar_contrasenia"
                  value={passwordData.confirmar_contrasenia || ''}
                  onChange={handlePasswordChange}
                  required
                  size="small"
                  error={!!passwordErrors?.confirmar_contrasenia}
                  helperText={passwordErrors?.confirmar_contrasenia || ''}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancelPassword}
                disabled={isUpdatingPassword}
                sx={{ textTransform: 'none' }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isUpdatingPassword || !passwordData.nueva_contrasenia}
                sx={{
                  backgroundColor: BRAND_COLOR,
                  '&:hover': { backgroundColor: BRAND_HOVER },
                  textTransform: 'none',
                }}
              >
                {isUpdatingPassword ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}