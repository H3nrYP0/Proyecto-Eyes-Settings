import { useState, useMemo } from "react";
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
  Container,
  Alert,
  Grid,
  LinearProgress
} from "@mui/material";
import { 
  PersonAddOutlined as PersonAddIcon
} from "@mui/icons-material";
import { ROLES } from "../../../shared/constants/roles";

// Constantes
const TIPOS_DOCUMENTO = {
  CC: "Cédula de Ciudadanía",
  CE: "Cédula de Extranjería", 
  PASAPORTE: "Pasaporte",
  NIT: "NIT",
  TI: "Tarjeta de Identidad"
};

// Componente de fortaleza de contraseña
const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    if (password.length >= 6) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    
    return Math.min(score, 100);
  }, [password]);

  const getColor = () => {
    if (strength < 40) return "error";
    if (strength < 70) return "warning";
    return "success";
  };

  const getLabel = () => {
    if (strength < 40) return "Débil";
    if (strength < 70) return "Media";
    return "Fuerte";
  };

  if (!password) return null;

  return (
    <Box sx={{ mt: 0.5, mb: 1 }}>
      <LinearProgress 
        variant="determinate" 
        value={strength} 
        color={getColor()}
        sx={{ height: 4, borderRadius: 2 }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: '500' }}>
        Fortaleza: {getLabel()}
      </Typography>
    </Box>
  );
};

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    rol: ROLES.VENDEDOR,
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError("");
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    const requiredFields = ['nombres', 'apellidos', 'correo', 'numeroDocumento', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    if (!formData.correo.includes('@')) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.fechaNacimiento) {
      const age = calculateAge(formData.fechaNacimiento);
      if (age < 18) {
        setError("Debes ser mayor de 18 años para registrarte");
        return;
      }
    }

    if (!formData.agreeTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    // Validaciones de documento
    const docValidations = {
      CC: /^\d{8,10}$/,
      CE: /^\d{6,12}$/,
      NIT: /^\d{9}$/,
      TI: /^\d{6,12}$/,
      PASAPORTE: /^[A-Z0-9]{6,12}$/
    };

    const validation = docValidations[formData.tipoDocumento];
    if (validation && !validation.test(formData.numeroDocumento)) {
      const errors = {
        CC: "La cédula de ciudadanía debe tener entre 8 y 10 dígitos",
        CE: "La cédula de extranjería debe tener entre 6 y 12 dígitos",
        NIT: "El NIT debe tener 9 dígitos",
        TI: "La tarjeta de identidad debe tener entre 6 y 12 dígitos",
        PASAPORTE: "El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos"
      };
      setError(errors[formData.tipoDocumento]);
      return;
    }

    const userData = {
      ...formData,
      tipoDocumentoTexto: TIPOS_DOCUMENTO[formData.tipoDocumento],
      edad: formData.fechaNacimiento ? calculateAge(formData.fechaNacimiento) : null,
      estado: "activo",
      fechaRegistro: new Date().toISOString()
    };

    if (onRegister) {
      onRegister(userData);
    }

    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  const getDocumentPlaceholder = () => {
    const placeholders = {
      CC: "12345678",
      CE: "123456789012", 
      TI: "1234567890",
      NIT: "123456789",
      PASAPORTE: "AB123456"
    };
    return placeholders[formData.tipoDocumento] || "Número de documento";
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
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
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
            <PersonAddIcon sx={{ fontSize: 26, color: 'white' }} />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            color="primary"
            fontWeight="700"
            sx={{ letterSpacing: '-0.025em' }}
          >
            Visual Outlet
          </Typography>
        </Box>
      </Box>

      <Container component="main" maxWidth="sm">
        <Card 
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            fontFamily: "inherit",
            maxHeight: "85vh",
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ p: 0, maxHeight: "100%", overflow: "auto" }}>
            {/* Header dentro de la card */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                color="text.primary"
                fontWeight="600"
              >
                Crear una cuenta
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                Es fácil.
              </Typography>
            </Box>

            {/* Alertas */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem', borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2, fontSize: '0.85rem', borderRadius: 2 }}>
                ¡Registro exitoso! Redirigiendo al inicio de sesión...
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={1.5}>
                {/* Información Personal - Primera fila */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="nombres"
                    label="Nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    placeholder="Tus nombres"
                    required
                    disabled={success}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="apellidos"
                    label="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Correo */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    name="correo"
                    label="Correo electrónico"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tu@visualoutlet.com"
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Teléfono y Fecha Nacimiento */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="telefono"
                    label="Teléfono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                    disabled={success}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="fechaNacimiento"
                    label="Fecha de nacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={success}
                  />
                </Grid>

                {/* Documento */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      label="Tipo de documento"
                      onChange={handleChange}
                      disabled={success}
                    >
                      {Object.entries(TIPOS_DOCUMENTO).map(([key, value]) => (
                        <MenuItem key={key} value={key}>{value}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="numeroDocumento"
                    label="Número de documento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    placeholder={getDocumentPlaceholder()}
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Contraseñas */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="password"
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="········"
                    required
                    disabled={success}
                  />
                  <PasswordStrength password={formData.password} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="········"
                    required
                    disabled={success}
                  />
                </Grid>

                {/* Rol */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="rol"
                      value={formData.rol}
                      label="Rol"
                      onChange={handleChange}
                      disabled={success}
                    >
                      <MenuItem value={ROLES.ADMIN}>Administrador</MenuItem>
                      <MenuItem value={ROLES.DEMO}>Usuario demo</MenuItem>
                      <MenuItem value={ROLES.VENDEDOR}>Vendedor</MenuItem>
                      <MenuItem value={ROLES.OPTICO}>Óptico</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Términos */}
              <FormControlLabel
                control={
                  <Checkbox 
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: '500' }}>
                    Acepto los{' '}
                    <Button 
                      component={Link}
                      to="/terms"
                      variant="text"
                      size="small"
                      sx={{ fontSize: '0.85rem', p: 0, minWidth: 'auto', fontWeight: '600', textTransform: 'none' }}
                    >
                      términos y condiciones
                    </Button>
                  </Typography>
                }
                sx={{ mt: 2, mb: 2 }}
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  py: 1.2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: 2,
                  mb: 2
                }}
                disabled={success}
              >
                {success ? 'Cuenta creada' : 'Crear cuenta'}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: '500' }}>
                ¿Ya tienes una cuenta?{" "}
                <Button 
                  component={Link}
                  to="/login"
                  variant="text"
                  size="small"
                  sx={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'none' }}
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