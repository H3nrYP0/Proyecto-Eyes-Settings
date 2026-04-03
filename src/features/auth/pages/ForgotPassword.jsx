import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Container, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@mui/icons-material';

import authServices                from '../services/authServices';
import { validateForgotEmail, validateOtpCode, validateResetPassword } from '../utils/authValidators';
import { isInvalidCodeError }      from '../utils/authNormalizer';

const STEP_TITLES = {
  1: 'Recuperar contraseña',
  2: 'Ingresa el código',
  3: 'Nueva contraseña',
};

export default function ForgotPassword() {
  const [step,                 setStep]                 = useState(1);
  const [correo,               setCorreo]               = useState('');
  const [codigo,               setCodigo]               = useState('');
  const [nuevaContrasenia,     setNuevaContrasenia]     = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [showPassword,         setShowPassword]         = useState(false);
  const [showConfirmPassword,  setShowConfirmPassword]  = useState(false);
  const [loading,              setLoading]              = useState(false);
  const [error,                setError]                = useState('');
  const [success,              setSuccess]              = useState(false);

  const stepDescriptions = {
    1: 'Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.',
    2: `Hemos enviado un código de 6 dígitos a ${correo}.`,
    3: 'Ingresa y confirma tu nueva contraseña.',
  };

  // ── Paso 1: enviar código ──
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    const err = validateForgotEmail(correo);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await authServices.sendForgotPasswordCode(correo.trim().toLowerCase());
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  // ── Paso 2: verificar código (avance local) ──
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');
    const err = validateOtpCode(codigo);
    if (err) { setError(err); return; }
    setStep(3);
  };

  // ── Paso 3: cambiar contraseña ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const err = validateResetPassword(nuevaContrasenia, confirmarContrasenia);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await authServices.resetPassword(
        correo.trim().toLowerCase(),
        codigo,
        nuevaContrasenia,
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
      if (isInvalidCodeError(err)) {
        setStep(2);
        setCodigo('');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Reenviar código ──
  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await authServices.sendForgotPasswordCode(correo.trim().toLowerCase());
      setCodigo('');
    } catch {
      setError('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 50%, #ffffff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      py: 2,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <Container component="main" maxWidth="md"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card elevation={2} sx={{ width: '100%', maxWidth: 440, p: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 1 }}>

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom color="primary"
                fontWeight="500" sx={{ letterSpacing: '-0.025em' }}>
                {STEP_TITLES[step]}
              </Typography>
              <Typography variant="body1" color="text.secondary"
                sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                {stepDescriptions[step]}
              </Typography>
            </Box>

            {/* Indicador de pasos */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              {[1, 2, 3].map((s) => (
                <Box key={s} sx={{
                  width: 28, height: 4, borderRadius: 2,
                  backgroundColor: s <= step ? 'primary.main' : 'grey.300',
                  transition: 'background-color 0.3s',
                }} />
              ))}
            </Box>

            {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                ¡Contraseña actualizada correctamente!{' '}
                <Button component={Link} to="/login" variant="text" size="small"
                  sx={{ textTransform: 'none', fontWeight: '600', fontSize: '0.85rem', p: 0, verticalAlign: 'baseline' }}>
                  Inicia sesión aquí
                </Button>
              </Alert>
            )}

            {/* Paso 1 */}
            {step === 1 && !success && (
              <Box component="form" onSubmit={handleSendCode}>
                <TextField
                  margin="normal" required fullWidth label="Correo Electrónico" type="email"
                  autoComplete="email" autoFocus value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="tu@correo.com" size="small" disabled={loading}
                />
                <Button type="submit" fullWidth variant="contained" disabled={loading}
                  sx={{ mt: 2, mb: 2, py: 1.1, textTransform: 'none', fontSize: '0.95rem', fontWeight: '600', borderRadius: 2 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar código'}
                </Button>
              </Box>
            )}

            {/* Paso 2 */}
            {step === 2 && !success && (
              <Box component="form" onSubmit={handleVerifyCode}>
                <TextField
                  margin="normal" required fullWidth label="Código de verificación"
                  autoFocus value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456" size="small" inputProps={{ maxLength: 6 }} disabled={loading}
                />
                <Button type="submit" fullWidth variant="contained"
                  disabled={loading || codigo.length !== 6}
                  sx={{ mt: 2, mb: 1, py: 1.1, textTransform: 'none', fontSize: '0.95rem', fontWeight: '600', borderRadius: 2 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verificar código'}
                </Button>
                <Button fullWidth variant="text" size="small" onClick={handleResend}
                  disabled={loading}
                  sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                  Reenviar código
                </Button>
              </Box>
            )}

            {/* Paso 3 */}
            {step === 3 && !success && (
              <Box component="form" onSubmit={handleResetPassword}>
                <TextField
                  margin="normal" required fullWidth label="Nueva contraseña" autoFocus
                  type={showPassword ? 'text' : 'password'}
                  value={nuevaContrasenia} onChange={(e) => setNuevaContrasenia(e.target.value)}
                  placeholder="········" size="small" disabled={loading}
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
                <TextField
                  margin="normal" required fullWidth label="Confirmar contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmarContrasenia} onChange={(e) => setConfirmarContrasenia(e.target.value)}
                  placeholder="········" size="small" disabled={loading}
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
                <Button type="submit" fullWidth variant="contained" disabled={loading}
                  sx={{ mt: 2, mb: 2, py: 1.1, textTransform: 'none', fontSize: '0.95rem', fontWeight: '600', borderRadius: 2 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Restablecer contraseña'}
                </Button>
              </Box>
            )}

            {/* Footer */}
            {!success && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
                  ¿Recordaste tu contraseña?{' '}
                  <Button component={Link} to="/login" variant="text" size="small"
                    sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                    Inicia sesión
                  </Button>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  ¿No tienes cuenta?{' '}
                  <Button component={Link} to="/register" variant="text" size="small"
                    sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                    Regístrate
                  </Button>
                </Typography>
              </Box>
            )}

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}