import { useState, useMemo, useRef, useEffect } from "react";
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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress
} from "@mui/material";
import { 
  PersonAddOutlined as PersonAddIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

// Constantes - Documentos para mayores de 18 años
const TIPOS_DOCUMENTO = {
  CC: "Cédula de Ciudadanía",
  CE: "Cédula de Extranjería",
  PASAPORTE: "Pasaporte",
  PEP: "Permiso Especial de Permanencia"
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

// Componente de verificación por código con reenvío controlado
const VerificationCodeDialog = ({ open, email, onClose, onVerify }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Temporizador para reenvío
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Iniciar temporizador al abrir el diálogo
  useEffect(() => {
    if (open) {
      setResendTimer(30);
      setCanResend(false);
    }
  }, [open]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      onVerify(verificationCode);
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    
    console.log("Reenviar código a:", email);
    setCanResend(false);
    setResendTimer(30);
    console.log("Código reenviado");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          mx: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontSize="1.1rem">
            Verifica tu correo
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          Hemos enviado un código de verificación de 6 dígitos a:
        </Typography>
        <Typography variant="body1" fontWeight="600" paragraph>
          {email}
        </Typography>
        
        <Box 
          display="flex" 
          justifyContent="center" 
          gap={{ xs: 0.5, sm: 1 }} 
          mb={3}
          flexWrap="wrap"
        >
          {code.map((digit, index) => (
            <TextField
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: { 
                  textAlign: 'center', 
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  padding: { xs: '8px', sm: '12px' }
                }
              }}
              sx={{
                width: { xs: 40, sm: 45 },
                '& .MuiInputBase-input': {
                  textAlign: 'center'
                }
              }}
            />
          ))}
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center">
          ¿No recibiste el código?{" "}
          {canResend ? (
            <Button 
              variant="text" 
              size="small" 
              onClick={handleResendCode}
              sx={{ 
                textTransform: 'none', 
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Reenviar código
            </Button>
          ) : (
            <Typography 
              component="span" 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.85rem' }}
            >
              Reenviar en {formatTime(resendTimer)}
            </Typography>
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit" 
          size="small"
        >
          Volver
        </Button>
        <Button 
          onClick={handleVerify} 
          variant="contained" 
          size="small"
          disabled={code.join('').length !== 6}
          sx={{ minWidth: 100 }}
        >
          Verificar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
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
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const requiredFields = ['nombreCompleto', 'correo', 'numeroDocumento', 'password', 'confirmPassword'];
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

      if (!formData.fechaNacimiento) {
        setError("La fecha de nacimiento es obligatoria");
        return;
      }

      const age = calculateAge(formData.fechaNacimiento);
      if (age < 18) {
        setError("Debes ser mayor de 18 años para registrarte");
        return;
      }

      if (!formData.agreeTerms) {
        setError("Debes aceptar los términos y condiciones");
        return;
      }

      const docValidations = {
        CC: /^\d{8,10}$/,
        CE: /^\d{6,12}$/,
        PASAPORTE: /^[A-Z0-9]{6,12}$/,
        PEP: /^[A-Z0-9]{6,15}$/
      };

      const validation = docValidations[formData.tipoDocumento];
      if (validation && !validation.test(formData.numeroDocumento)) {
        const errors = {
          CC: "La cédula de ciudadanía debe tener entre 8 y 10 dígitos",
          CE: "La cédula de extranjería debe tener entre 6 y 12 dígitos",
          PASAPORTE: "El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos",
          PEP: "El Permiso Especial de Permanencia debe tener entre 6 y 15 caracteres alfanuméricos"
        };
        setError(errors[formData.tipoDocumento]);
        return;
      }

      setShowVerificationDialog(true);
      
    } catch (err) {
      setError("Ocurrió un error al procesar el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    setLoading(true);
    
    try {
      console.log("Código verificado:", code);
      
      const userData = {
        ...formData,
        tipoDocumentoTexto: TIPOS_DOCUMENTO[formData.tipoDocumento],
        edad: calculateAge(formData.fechaNacimiento),
        estado: "pendiente",
        fechaRegistro: new Date().toISOString(),
        rol: "usuario"
      };

      if (onRegister) {
        onRegister(userData);
      }

      setSuccess(true);
      setShowVerificationDialog(false);
      
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Registro completado. Tu cuenta está pendiente de activación.",
            email: formData.correo 
          } 
        });
      }, 2000);
      
    } catch (err) {
      setError("Error al verificar el código");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentPlaceholder = () => {
    const placeholders = {
      CC: "12345678",
      CE: "123456789012", 
      PASAPORTE: "AB123456",
      PEP: "PEP2023001"
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
        py: 1, // Reducido de 2 a 1
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
      }}
    >
      {/* Logo fuera de la card - centrado en la parte superior */}
      <Box sx={{ textAlign: "center", mb: 0.5 }}> {/* Reducido de 1 a 0.5 */}
        <Box 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 1.5 // Reducido de 2 a 1.5
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48, // Reducido de 52 a 48
              height: 48, // Reducido de 52 a 48
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
            }}
          >
            <PersonAddIcon 
              sx={{ 
                fontSize: 24, // Reducido de 26 a 24
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
            sx={{ letterSpacing: '-0.025em', fontSize: { xs: '1.75rem', sm: '2rem' } }} // Ajustado tamaño
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
            maxWidth: 500,
            p: 3, // Reducido de 4 a 3
            borderRadius: 3,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
          }}
        >
          <CardContent sx={{ p: 0 }}> {/* Reducido de 1 a 0 */}
            {/* Header dentro de la card */}
            <Box sx={{ textAlign: "center", mb: 2.5 }}> {/* Reducido de 3 a 2.5 */}
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                color="text.primary"
                fontWeight="600"
                fontFamily="inherit"
                sx={{ mb: 0.5 }} // Reducido margen
              >
                Crear una cuenta
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ 
                mb: 1.5, // Reducido de 2 a 1.5
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                borderRadius: 2,
                py: 0.75 // Reducido padding
              }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ 
                mb: 1.5, // Reducido de 2 a 1.5
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                borderRadius: 2,
                py: 0.75 // Reducido padding
              }}>
                ¡Registro exitoso! Serás redirigido al inicio de sesión...
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 0.5 }}> {/* Reducido de 1 a 0.5 */}
              <Grid container spacing={1.5}> {/* Reducido de 2 a 1.5 */}
                {/* Campos reorganizados para mejor uso del espacio */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    name="nombreCompleto"
                    label="Nombre completo"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
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
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
                  />
                </Grid>

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
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
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
                    required
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
                    InputProps={{
                      sx: {
                        '& input': {
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontFamily: 'inherit'
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" sx={{ fontFamily: 'inherit' }}>
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      label="Tipo de documento"
                      onChange={handleChange}
                      disabled={success || loading}
                    >
                      {Object.entries(TIPOS_DOCUMENTO).map(([key, value]) => (
                        <MenuItem key={key} value={key} sx={{ fontFamily: 'inherit' }}>{value}</MenuItem>
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
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
                  />
                </Grid>

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
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
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
                    disabled={success || loading}
                    sx={{ fontFamily: 'inherit' }}
                  />
                </Grid>
              </Grid>

              {/* Términos y condiciones - MEJOR ALINEADO */}
              <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Checkbox 
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  color="primary"
                  size="small"
                  disabled={success || loading}
                  sx={{ mt: -0.5 }} // Ajuste fino para alineación vertical
                />
                <Typography sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '500',
                  fontFamily: 'inherit',
                  lineHeight: 1.5
                }}>
                  Acepto los{' '}
                  <Button 
                    component={Link}
                    to="/terms"
                    variant="text"
                    size="small"
                    sx={{ 
                      fontSize: '0.85rem', 
                      p: 0, 
                      minWidth: 'auto', 
                      fontWeight: '600', 
                      textTransform: 'none',
                      fontFamily: 'inherit',
                      verticalAlign: 'baseline'
                    }}
                    disabled={success || loading}
                  >
                    términos y condiciones
                  </Button>
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={success || loading}
                sx={{ 
                  mt: 1, // Reducido de 2 a 1
                  mb: 1.5, // Reducido de 3 a 1.5
                  py: 1, // Reducido de 1.1 a 1
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  fontWeight: '700',
                  borderRadius: 2,
                  letterSpacing: '0.01em',
                  position: 'relative'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : success ? (
                  'Cuenta creada'
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </Box>

            {/* Footer - MEJOR ALINEADO */}
            <Box sx={{ textAlign: "center", mt: 1.5 }}> {/* Añadido margen superior */}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  display: 'inline' // Para mejor alineación con el botón
                }}
              >
                ¿Ya tienes una cuenta?{" "}
              </Typography>
              <Button 
                component={Link}
                to="/login"
                variant="text"
                size="small"
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  fontWeight: '700',
                  p: 0,
                  minWidth: 'auto',
                  verticalAlign: 'baseline' // Para alinear con el texto
                }}
              >
                Inicia sesión aquí
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Diálogo de verificación */}
      <VerificationCodeDialog
        open={showVerificationDialog}
        email={formData.correo}
        onClose={() => setShowVerificationDialog(false)}
        onVerify={handleVerifyCode}
      />
    </Box>
  );
}