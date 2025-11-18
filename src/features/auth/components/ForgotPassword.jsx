import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert
} from "@mui/material";
import { 
  EmailOutlined as EmailIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico para continuar");
      return;
    }

    if (!email.includes('@')) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    // Simular envío de email
    console.log(`Enviando enlace de recuperación a: ${email}`);
    setSuccess(true);
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
              {/* Icono de email */}
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
                <EmailIcon 
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
                Recuperar Contraseña
              </Typography>
              <Typography 
                variant="body1" 
                component="h2" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  lineHeight: 1.5
                }}
              >
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Typography>
            </Box>

            {/* Alertas */}
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

            {success && (
              <Alert severity="success" sx={{ 
                mb: 2, 
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                borderRadius: 2
              }}>
                Se ha enviado un enlace de recuperación a: <strong>{email}</strong>
              </Alert>
            )}

            {/* Form */}
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
                disabled={success}
              />

              {/* Submit Button */}
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
                disabled={success}
              >
                {success ? 'Enlace Enviado' : 'Enviar Enlace de Recuperación'}
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
                  mb: 1
                }}
              >
                ¿Recordaste tu contraseña?{" "}
                <Button 
                  component={Link}
                  to="/login"
                  variant="text"
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    fontWeight: '600'
                  }}
                >
                  Inicia sesión aquí
                </Button>
              </Typography>

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