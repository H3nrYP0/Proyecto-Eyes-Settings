import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Divider,
  Container,
  Alert
} from "@mui/material";
import { 
  Facebook as FacebookIcon,
  VisibilityOutlined as VisibilityOutlinedIcon
} from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { ROLES } from "../../../shared/constants/roles";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState(ROLES.ADMIN);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa correo y contraseña para continuar");
      return;
    }

    const userData = { 
      name: email.split('@')[0], 
      email,
      role,
      permissions: getPermissionsByRole(role)
    };
    setUser(userData);
    navigate("/admin/dashboard");
  };

  const getPermissionsByRole = (role) => {
    const permissionsMap = {
      [ROLES.ADMIN]: ['*'],
      [ROLES.DEMO]: ['dashboard'],
      [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'clientes'],
      [ROLES.OPTICO]: ['dashboard', 'servicios', 'agenda']
    };
    return permissionsMap[role] || ['dashboard'];
  };

  const handleSocialLogin = (provider) => {
    console.log(`Iniciando sesión con ${provider}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 50%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
      }}
    >
      <Container 
        component="main" 
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card 
          elevation={2}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: 4,
            borderRadius: 3,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
          }}
        >
          <CardContent sx={{ p: 1 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              {/* Icono del ojo con fondo cuadrado y degradado */}
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  borderRadius: '12px',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                }}
              >
                <VisibilityOutlinedIcon 
                  sx={{ 
                    fontSize: 26, 
                    color: 'white'
                  }} 
                />
              </Box>
              <Typography 
                variant="h5" 
                component="h1" 
                gutterBottom
                color="primary"
                fontWeight="600"
                fontFamily="inherit"
                sx={{ letterSpacing: '-0.025em' }}
              >
                Visual Outlet
              </Typography>
              <Typography 
                variant="body1" 
                component="h2" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Inicia sesión en tu cuenta
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ 
                mb: 2, 
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                borderRadius: 2
              }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@visualoutlet.com"
                size="small"
                sx={{ fontFamily: 'inherit' }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="········"
                size="small"
                sx={{ fontFamily: 'inherit' }}
              />

              {/* Options Row */}
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                mt: 1,
                mb: 1
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Recordarme"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontSize: '0.85rem',
                      fontFamily: 'inherit'
                    } 
                  }}
                />
                
                <Button 
                  component={Link}
                  to="/forgot-password"
                  variant="text"
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    fontWeight: '500'
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </Box>

              {/* Role Selector */}
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel 
                  id="role-label"
                  sx={{ fontFamily: 'inherit' }}
                >
                  Rol
                </InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Rol"
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ fontFamily: 'inherit' }}
                >
                  <MenuItem value={ROLES.ADMIN} sx={{ fontFamily: 'inherit' }}>Administrador</MenuItem>
                  <MenuItem value={ROLES.DEMO} sx={{ fontFamily: 'inherit' }}>Usuario Demo</MenuItem>
                  <MenuItem value={ROLES.VENDEDOR} sx={{ fontFamily: 'inherit' }}>Vendedor</MenuItem>
                  <MenuItem value={ROLES.OPTICO} sx={{ fontFamily: 'inherit' }}>Óptico</MenuItem>
                </Select>
              </FormControl>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  py: 1.1,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  fontWeight: '600',
                  borderRadius: 2,
                  letterSpacing: '0.01em'
                }}
              >
                Iniciar sesión
              </Button>
            </Box>

            {/* Social Login */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    fontWeight: '500'
                  }}
                >
                  O continúa con
                </Typography>
              </Divider>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FcGoogle style={{ fontSize: '1.2rem' }} />}
                onClick={() => handleSocialLogin('google')}
                sx={{ 
                  mb: 1, 
                  py: 0.9,
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  borderRadius: 2
                }}
              >
                Continuar con Google
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('facebook')}
                sx={{ 
                  py: 0.9,
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  borderRadius: 2
                }}
              >
                Continuar con Facebook
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontFamily: 'inherit'
                }}
              >
                ¿No tienes una cuenta?{" "}
                <Button 
                  component={Link}
                  to="/register"
                  variant="text"
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    fontWeight: '600'
                  }}
                >
                  Regístrate aquí
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}