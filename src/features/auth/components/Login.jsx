import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Box,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Divider,
  Container,
  Alert
} from "@mui/material";
import { 
  VisibilityOutlined as VisibilityOutlinedIcon
} from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { ROLES } from "../../../shared/constants/roles";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa correo y contraseña para continuar");
      return;
    }

    // Simulación de autenticación
    // En producción, aquí llamarías a tu backend
    const userData = { 
      name: email.split('@')[0], 
      email,
      // Todos los usuarios tienen rol "usuario" por defecto
      // Los roles específicos se asignan internamente
      role: ROLES.USUARIO,
      // Este será actualizado por el backend según las credenciales
      permissions: []
    };
    setUser(userData);
    navigate("/admin/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 50%, #ffffff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
      }}
    >
      {/* Logo fuera de la card - centrado en la parte superior */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Box 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 2
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              borderRadius: '12px',
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
            variant="h4" 
            component="h1" 
            color="primary"
            fontWeight="700"
            fontFamily="inherit"
            sx={{ letterSpacing: '-0.025em' }}
          >
            Visual Outlet
          </Typography>
        </Box>
      </Box>

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
            {/* Header dentro de la card */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                color="text.primary"
                fontWeight="600"
                fontFamily="inherit"
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
                      fontFamily: 'inherit',
                      fontWeight: '500'
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
                    fontWeight: '600'
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </Box>

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
                  fontWeight: '700',
                  borderRadius: 2,
                  letterSpacing: '0.01em'
                }}
              >
                Iniciar sesión
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  fontWeight: '500'
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
                    fontWeight: '700'
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