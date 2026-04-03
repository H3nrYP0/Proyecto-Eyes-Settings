import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Checkbox, Button, Typography,
  Container, Alert, Grid, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import {
  PersonAddOutlined as PersonAddIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@mui/icons-material';

import authServices                            from '../services/authServices';
import { validateRegisterForm }                from '../utils/authValidators';
import { TIPOS_DOCUMENTO, DOC_PLACEHOLDERS, getRegisterInitialData, buildRegisterPayload } from '../utils/authNormalizer';
import PasswordStrength                        from '../components/PasswordStrength';
import VerificationCodeDialog                  from '../components/VerificationCodeDialog';

export default function Register() {
  const navigate = useNavigate();

  const [formData,                 setFormData]                 = useState(getRegisterInitialData());
  const [errors,                   setErrors]                   = useState({});
  const [error,                    setError]                    = useState('');
  const [success,                  setSuccess]                  = useState(false);
  const [loading,                  setLoading]                  = useState(false);
  const [showVerificationDialog,   setShowVerificationDialog]   = useState(false);
  const [showPassword,             setShowPassword]             = useState(false);
  const [showConfirmPassword,      setShowConfirmPassword]      = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) setError('');
  };

  // ── Paso 1: enviar código al correo ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formErrors = validateRegisterForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setError('Corrige los errores del formulario');
      return;
    }

    setLoading(true);
    try {
      await authServices.sendRegisterCode(buildRegisterPayload(formData));
      setShowVerificationDialog(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el código de verificación');
    } finally {
      setLoading(false);
    }
  };

  // ── Paso 2: verificar código y crear cuenta ──
  const handleVerifyCode = async (codigo) => {
    setLoading(true);
    try {
      await authServices.verifyRegisterCode(formData.correo, codigo);
      setSuccess(true);
      setShowVerificationDialog(false);
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
            email: formData.correo,
          },
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Código incorrecto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Reenviar código ──
  const handleResendCode = async () => {
    try {
      await authServices.sendRegisterCode(buildRegisterPayload(formData));
    } catch {
      setError('Error al reenviar el código');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 50%, #ffffff 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      py: 1,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Logo */}
      <Box sx={{ textAlign: 'center', mb: 0.5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(25,118,210,0.2)',
          }}>
            <PersonAddIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" color="primary" fontWeight="700"
            fontFamily="inherit" sx={{ letterSpacing: '-0.025em' }}>
            Visual Outlet
          </Typography>
        </Box>
      </Box>

      <Container component="main" maxWidth="md"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card elevation={2} sx={{ width: '100%', maxWidth: 520, p: 3.5, borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2" color="text.primary" fontWeight="600">
                Crear una cuenta
              </Typography>
            </Box>

            {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                ¡Cuenta creada! Serás redirigido al inicio de sesión...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="nombre" label="Nombre completo"
                    value={formData.nombre} onChange={handleChange}
                    placeholder="Tu nombre completo" required
                    disabled={success || loading}
                    error={!!errors.nombre} helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="correo" label="Correo electrónico"
                    type="email" value={formData.correo} onChange={handleChange}
                    placeholder="tu@correo.com" required
                    disabled={success || loading}
                    error={!!errors.correo} helperText={errors.correo}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="telefono" label="Teléfono"
                    type="tel" value={formData.telefono} onChange={handleChange}
                    placeholder="+57 300 123 4567" disabled={success || loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="fechaNacimiento" label="Fecha de nacimiento"
                    type="date" value={formData.fechaNacimiento} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} required
                    disabled={success || loading}
                    error={!!errors.fechaNacimiento} helperText={errors.fechaNacimiento}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!errors.tipoDocumento}>
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select name="tipoDocumento" value={formData.tipoDocumento}
                      label="Tipo de documento" onChange={handleChange}
                      disabled={success || loading}>
                      {Object.entries(TIPOS_DOCUMENTO).map(([key, value]) => (
                        <MenuItem key={key} value={key}>{value}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="numeroDocumento" label="Número de documento"
                    value={formData.numeroDocumento} onChange={handleChange}
                    placeholder={DOC_PLACEHOLDERS[formData.tipoDocumento] || ''}
                    required disabled={success || loading}
                    error={!!errors.numeroDocumento} helperText={errors.numeroDocumento}
                  />
                </Grid>

                {/* Contraseña */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="contrasenia" label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.contrasenia} onChange={handleChange}
                    placeholder="········" required disabled={success || loading}
                    error={!!errors.contrasenia} helperText={errors.contrasenia}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <PasswordStrength password={formData.contrasenia} />
                </Grid>

                {/* Confirmar contraseña */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="confirmContrasenia" label="Confirmar contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmContrasenia} onChange={handleChange}
                    placeholder="········" required disabled={success || loading}
                    error={!!errors.confirmContrasenia} helperText={errors.confirmContrasenia}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                            {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Términos */}
              <Box sx={{ mt: 2.5, mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Checkbox name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange}
                  color="primary" size="small" disabled={success || loading} sx={{ mt: -0.5 }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: 1.5 }}>
                  Acepto los{' '}
                  <Button component={Link} to="/terms" variant="text" size="small"
                    sx={{ fontSize: '0.85rem', p: 0, minWidth: 'auto', fontWeight: '600', textTransform: 'none', verticalAlign: 'baseline' }}>
                    términos y condiciones
                  </Button>
                </Typography>
              </Box>
              {errors.agreeTerms && (
                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                  {errors.agreeTerms}
                </Typography>
              )}

              <Button type="submit" fullWidth variant="contained" disabled={success || loading}
                sx={{ mt: 2, mb: 2.5, py: 1.2, textTransform: 'none', fontSize: '0.95rem', fontWeight: '700', borderRadius: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', display: 'inline' }}>
                ¿Ya tienes una cuenta?{' '}
              </Typography>
              <Button component={Link} to="/login" variant="text" size="small"
                sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '700', p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}>
                Inicia sesión aquí
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <VerificationCodeDialog
        open={showVerificationDialog}
        email={formData.correo}
        onClose={() => setShowVerificationDialog(false)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        loading={loading}
      />
    </Box>
  );
}