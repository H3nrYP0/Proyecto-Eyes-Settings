import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, Card, CardContent, TextField, FormControlLabel,
  Checkbox, Button, Typography, Container, Alert,
  InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { 
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon
} from "@mui/icons-material";

import authService from "../Services/authService";

export default function Login({ setUser }) {

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Validaciones frontend ──
    if (!correo.trim() || !contrasenia.trim()) {
      setError("Ingresa correo y contraseña para continuar");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    if (contrasenia.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const usuario = await authService.login(correo.trim(), contrasenia);

      // Guardar en estado global
      setUser(usuario);

      // ── Redirección correcta con React Router ──
      if (authService.hasPermission(usuario, "dashboard")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      const mensaje = err.response?.data?.error;

      if (mensaje === "Tu cuenta está inactiva. Contacta al administrador.") {
        setError(mensaje);
      } else {
        setError("Correo o contraseña incorrectos");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 50%, #ffffff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 2,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    }}>
      
      {/* Logo */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
          }}>
            <VisibilityOutlinedIcon sx={{ fontSize: 26, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" color="primary"
            fontWeight="700" fontFamily="inherit"
            sx={{ letterSpacing: '-0.025em' }}>
            Visual Outlet
          </Typography>
        </Box>
      </Box>

      <Container component="main" maxWidth="md"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card elevation={2} sx={{
          width: "100%",
          maxWidth: 440,
          p: 4,
          borderRadius: 3,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
        }}>
          <CardContent sx={{ p: 1 }}>

            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h5" component="h2"
                color="text.primary" fontWeight="600">
                Inicia sesión en tu cuenta
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Información para probar usuarios especiales */}
            {/* <Alert severity="info" sx={{ mb: 3, fontSize: '0.8rem', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Usuarios de prueba:
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Admin:</strong> admin@visualoutlet.com / Admin123! (Dashboard)
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Vendedor:</strong> vendedor@visualoutlet.com / Vendedor123! (Dashboard)
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Óptico:</strong> optico@visualoutlet.com / Optico123! (Dashboard)
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                <strong>Cualquier otro correo/contraseña:</strong> Irá a la Landing Page
              </Typography>
            </Alert> */}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Correo Electrónico"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                size="small"
                disabled={loading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                size="small"
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword
                          ? <VisibilityOffOutlinedIcon fontSize="small" />
                          : <VisibilityOutlinedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      disabled={loading}
                    />
                  }
                  label="Recordarme"
                />
                <Button component={Link} to="/forgot-password" size="small">
                  ¿Olvidaste tu contraseña?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : "Iniciar sesión"}
              </Button>

            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}