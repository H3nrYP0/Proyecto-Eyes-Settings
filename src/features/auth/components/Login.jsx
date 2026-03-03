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
  Container,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import { 
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon
} from "@mui/icons-material";
import { ROLES, TEST_USERS, PERMISSIONS } from "../../../shared/constants/roles"; // Asegúrate de importar PERMISSIONS

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Función para verificar usuarios especiales
  const verifySpecialUser = (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Verificar si es usuario especial (de TEST_USERS)
    for (const [key, user] of Object.entries(TEST_USERS)) {
      if (user.email.toLowerCase() === normalizedEmail && user.password === password) {
        console.log(`✅ Usuario especial encontrado: ${key} (${user.role})`);
        
        // IMPORTANTE: Asegurarse de incluir los permisos del rol
        const userWithPermissions = {
          ...user,
          permissions: PERMISSIONS[user.role] || []
        };
        
        return userWithPermissions;
      }
    }
    
    return null; // No es usuario especial
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa correo y contraseña para continuar");
      return;
    }

    // 1. Verificar si es usuario especial (super_admin, admin, vendedor, óptico)
    const specialUser = verifySpecialUser(email, password);
    
    if (specialUser) {
      // Es usuario especial - redirigir al dashboard
      console.log("🔑 Autenticación exitosa como:", specialUser.role);
      console.log("📋 Permisos:", specialUser.permissions);
      setUser(specialUser);
      
      // Solo usuarios especiales van al dashboard
      navigate("/admin/dashboard");
      return;
    }

    // 2. Si NO es usuario especial, es usuario normal
    console.log("👤 Usuario normal detectado - Redirigiendo a landing");
    const normalUser = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      role: ROLES.USUARIO, // Rol USUARIO por defecto
      permissions: PERMISSIONS[ROLES.USUARIO] || [] // Agregar permisos vacíos
    };
    
    setUser(normalUser);
    console.log("📍 Navegando a / (landing page)");
    
    // IMPORTANTE: Usar replace: true para limpiar el historial
    navigate("/", { replace: true });
  };

  // Función para alternar visibilidad de contraseña
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Función para evitar que el botón active el submit
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
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
                placeholder="ejemplo@correo.com"
                size="small"
                sx={{ fontFamily: 'inherit' }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="········"
                size="small"
                sx={{ fontFamily: 'inherit' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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