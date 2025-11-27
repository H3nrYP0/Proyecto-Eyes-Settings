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
  Button,
  Typography,
  Container,
  Alert,
  Grid
} from "@mui/material";
import { 
  PersonAddOutlined as PersonAddIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { ROLES } from "../../../shared/constants/roles";

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    rol: ROLES.VENDEDOR
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.nombres.trim() || !formData.apellidos.trim() || 
        !formData.correo.trim() || !formData.numeroDocumento.trim()) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    if (!formData.correo.includes('@')) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    const userData = {
      ...formData,
      estado: "c"
    };

    if (onRegister) {
      onRegister(userData);
    }

    setSuccess(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000);
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
            maxWidth: 500,
            p: 4,
            borderRadius: 3,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
          }}
        >
          <CardContent sx={{ p: 1 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              {/* Icono de registro */}
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
                <PersonAddIcon 
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
                Crear Nueva Cuenta
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
                ¡Registro exitoso! Redirigiendo al inicio de sesión...
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                {/* Nombres y Apellidos */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="nombres"
                    name="nombres"
                    label="Nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    placeholder="Ingresa tus nombres"
                    size="small"
                    sx={{ fontFamily: 'inherit' }}
                    required
                    disabled={success}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="apellidos"
                    name="apellidos"
                    label="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Ingresa tus apellidos"
                    size="small"
                    sx={{ fontFamily: 'inherit' }}
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Correo */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="correo"
                    name="correo"
                    label="Correo Electrónico"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tu@visualoutlet.com"
                    size="small"
                    sx={{ fontFamily: 'inherit' }}
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="telefono"
                    name="telefono"
                    label="Teléfono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+99 999 999"
                    size="small"
                    sx={{ fontFamily: 'inherit' }}
                    disabled={success}
                  />
                </Grid>

                {/* Tipo y Número de Documento */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="tipoDocumento-label">Tipo de Documento</InputLabel>
                    <Select
                      labelId="tipoDocumento-label"
                      id="tipoDocumento"
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      label="Tipo de Documento"
                      onChange={handleChange}
                      sx={{ fontFamily: 'inherit' }}
                      disabled={success}
                    >
                      <MenuItem value="DNI" sx={{ fontFamily: 'inherit' }}>DNI</MenuItem>
                      <MenuItem value="CE" sx={{ fontFamily: 'inherit' }}>Carnet de Extranjería</MenuItem>
                      <MenuItem value="PASAPORTE" sx={{ fontFamily: 'inherit' }}>Pasaporte</MenuItem>
                      <MenuItem value="RUC" sx={{ fontFamily: 'inherit' }}>RUC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="numeroDocumento"
                    name="numeroDocumento"
                    label="Número de Documento *"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    placeholder="Número de documento"
                    size="small"
                    sx={{ fontFamily: 'inherit' }}
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Rol */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="rol-label">Rol</InputLabel>
                    <Select
                      labelId="rol-label"
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      label="Rol"
                      onChange={handleChange}
                      sx={{ fontFamily: 'inherit' }}
                      disabled={success}
                    >
                      <MenuItem value={ROLES.ADMIN} sx={{ fontFamily: 'inherit' }}>Administrador</MenuItem>
                      <MenuItem value={ROLES.DEMO} sx={{ fontFamily: 'inherit' }}>Usuario Demo</MenuItem>
                      <MenuItem value={ROLES.VENDEDOR} sx={{ fontFamily: 'inherit' }}>Vendedor</MenuItem>
                      <MenuItem value={ROLES.OPTICO} sx={{ fontFamily: 'inherit' }}>Óptico</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
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
                {success ? 'Cuenta Creada' : 'Crear Cuenta'}
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
                ¿Ya tienes una cuenta?{" "}
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
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}