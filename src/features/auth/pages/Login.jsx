import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box, Card, CardContent, TextField, FormControlLabel,
  Checkbox, Button, Typography, Container, Alert,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@mui/icons-material';

import { loginTheme } from '@theme';
import authServices              from '../services/authServices';
import { validateLoginForm }     from '../utils/authValidators';
import { normalizeLoginError }   from '../utils/authNormalizer';

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [correo,       setCorreo]       = useState('');
  const [contrasenia,  setContrasenia]  = useState('');
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const validationError = validateLoginForm(correo, contrasenia);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const usuario = await authServices.login(
        correo.trim().toLowerCase(),
        contrasenia,
        rememberMe,
      );

      setUser(usuario);

      if (authServices.hasPermission(usuario, 'dashboard')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/productos', { replace: true });
      }
    } catch (err) {
      setError(normalizeLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <Box sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        py: 2,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      }}>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52,
              bgcolor: 'primary.main',
              borderRadius: '12px',
            }}>
              <VisibilityOutlinedIcon sx={{ fontSize: 26, color: 'white' }} />
            </Box>
            <Typography variant="h4" component="h1" color="primary"
              fontWeight="700" fontFamily="inherit" sx={{ letterSpacing: '-0.025em' }}>
              Visual Outlet
            </Typography>
          </Box>
        </Box>

        <Container component="main" maxWidth="md"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card elevation={2} sx={{ width: '100%', maxWidth: 440, p: 4 }}>
            <CardContent sx={{ p: 1 }}>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" color="text.primary" fontWeight="600">
                  Inicia sesión en tu cuenta
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal" fullWidth label="Correo Electrónico"
                  autoComplete="email" value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  size="small" disabled={loading}
                />

                <TextField
                  margin="normal" fullWidth label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  size="small" disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword
                            ? <VisibilityOffOutlinedIcon fontSize="small" />
                            : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                        size="small" disabled={loading} />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem' }}>Recordarme</Typography>}
                  />
                  <Button component={Link} to="/forgot-password" size="small"
                    sx={{ textTransform: 'none', fontSize: '0.85rem' }}>
                    ¿Olvidaste tu contraseña?
                  </Button>
                </Box>

                <Button type="submit" fullWidth variant="contained" disabled={loading}
                  sx={{ mt: 2, mb: 1, py: 1.1, textTransform: 'none', fontSize: '0.95rem', fontWeight: '600' }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
                </Button>
              </Box>
            </CardContent>

            <Box sx={{ textAlign: 'center', mt: 1, pb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                ¿No tienes una cuenta?{' '}
                <Button component={Link} to="/register" variant="text" size="small"
                  sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                  Regístrate aquí
                </Button>
              </Typography>
              
              {/* Botón Volver */}
              <Button 
                component={Link} 
                to="/" 
                variant="text" 
                size="small"
                sx={{ 
                  textTransform: 'none', 
                  fontSize: '0.85rem', 
                  fontWeight: '500',
                  mt: 1.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
              Volver
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}