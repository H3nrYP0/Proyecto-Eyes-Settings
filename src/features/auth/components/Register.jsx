import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, Card, CardContent, TextField, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Checkbox, Button, Typography,
  Container, Alert, Grid, LinearProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, CircularProgress, InputAdornment
} from "@mui/material";
import {
  PersonAddOutlined as PersonAddIcon,
  Close as CloseIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon
} from "@mui/icons-material";
import api from "../../../lib/axios";

const TIPOS_DOCUMENTO = {
  CC: "Cédula de Ciudadanía",
  CE: "Cédula de Extranjería",
  PASAPORTE: "Pasaporte",
  PEP: "Permiso Especial de Permanencia"
};

// ── Indicador de fortaleza de contraseña ──
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

  const getColor = () => strength < 40 ? "error" : strength < 70 ? "warning" : "success";
  const getLabel = () => strength < 40 ? "Débil" : strength < 70 ? "Media" : "Fuerte";

  if (!password) return null;
  return (
    <Box sx={{ mt: 0.5, mb: 1 }}>
      <LinearProgress variant="determinate" value={strength} color={getColor()} sx={{ height: 4, borderRadius: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: '500' }}>
        Fortaleza: {getLabel()}
      </Typography>
    </Box>
  );
};

// ── Diálogo de verificación por código ──
const VerificationCodeDialog = ({ open, email, onClose, onVerify, onResend, loading }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (open) {
      setResendTimer(30);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
    }
  }, [open]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) onVerify(verificationCode);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setCode(["", "", "", "", "", ""]);
    onResend();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, mx: 2 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontSize="1.1rem">Verifica tu correo</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          Hemos enviado un código de 6 dígitos a:
        </Typography>
        <Typography variant="body1" fontWeight="600" paragraph>{email}</Typography>

        <Box display="flex" justifyContent="center" gap={{ xs: 0.5, sm: 1 }} mb={3}>
          {code.map((digit, index) => (
            <TextField
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
              sx={{ width: { xs: 40, sm: 45 }, '& .MuiInputBase-input': { textAlign: 'center' } }}
            />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          ¿No recibiste el código?{" "}
          {canResend ? (
            <Button variant="text" size="small" onClick={handleResend}
              sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
              Reenviar código
            </Button>
          ) : (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              Reenviar en {formatTime(resendTimer)}
            </Typography>
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" size="small" disabled={loading}>Volver</Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          size="small"
          disabled={code.join('').length !== 6 || loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Verificar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── Componente principal ──
export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    contrasenia: "",
    confirmContrasenia: "",
    agreeTerms: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError("");
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const validateForm = () => {
    const required = ['nombre', 'correo', 'numeroDocumento', 'contrasenia', 'confirmContrasenia'];
    if (required.some(f => !formData[f].trim())) {
      setError("Completa todos los campos obligatorios");
      return false;
    }
    if (!formData.correo.includes('@')) {
      setError("Ingresa un correo electrónico válido");
      return false;
    }
    if (formData.contrasenia !== formData.confirmContrasenia) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (formData.contrasenia.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (!formData.fechaNacimiento) {
      setError("La fecha de nacimiento es obligatoria");
      return false;
    }
    if (calculateAge(formData.fechaNacimiento) < 18) {
      setError("Debes ser mayor de 18 años para registrarte");
      return false;
    }
    if (!formData.agreeTerms) {
      setError("Debes aceptar los términos y condiciones");
      return false;
    }

    const docValidations = {
      CC: /^\d{8,10}$/,
      CE: /^\d{6,12}$/,
      PASAPORTE: /^[A-Z0-9]{6,12}$/,
      PEP: /^[A-Z0-9]{6,15}$/
    };
    if (!docValidations[formData.tipoDocumento].test(formData.numeroDocumento)) {
      const errors = {
        CC: "La cédula debe tener entre 8 y 10 dígitos",
        CE: "La cédula de extranjería debe tener entre 6 y 12 dígitos",
        PASAPORTE: "El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos",
        PEP: "El PEP debe tener entre 6 y 15 caracteres alfanuméricos"
      };
      setError(errors[formData.tipoDocumento]);
      return false;
    }
    return true;
  };

  // ── Paso 1: enviar código al correo ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/auth/register", {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasenia: formData.contrasenia,
        numeroDocumento: formData.numeroDocumento,
        fechaNacimiento: formData.fechaNacimiento,
        tipoDocumento: formData.tipoDocumento,
        telefono: formData.telefono
      });
      setShowVerificationDialog(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error al enviar el código de verificación");
    } finally {
      setLoading(false);
    }
  };

  // ── Paso 2: verificar código y crear cuenta ──
  const handleVerifyCode = async (codigo) => {
    setLoading(true);
    try {
      await api.post("/auth/verify-register", {
        correo: formData.correo,
        codigo
      });

      setSuccess(true);
      setShowVerificationDialog(false);

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Cuenta creada exitosamente. Ya puedes iniciar sesión.",
            email: formData.correo
          }
        });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Código incorrecto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reenviar código ──
  const handleResendCode = async () => {
    try {
      await api.post("/auth/register", {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasenia: formData.contrasenia,
        numeroDocumento: formData.numeroDocumento,
        fechaNacimiento: formData.fechaNacimiento,
        tipoDocumento: formData.tipoDocumento,
        telefono: formData.telefono
      });
    } catch (err) {
      setError("Error al reenviar el código");
    }
  };

  const getDocumentPlaceholder = () => ({
    CC: "12345678", CE: "123456789012", PASAPORTE: "AB123456", PEP: "PEP2023001"
  })[formData.tipoDocumento] || "";

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 50%, #ffffff 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      py: 1,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Logo */}
      <Box sx={{ textAlign: "center", mb: 0.5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(25,118,210,0.2)'
          }}>
            <PersonAddIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" color="primary" fontWeight="700"
            fontFamily="inherit" sx={{ letterSpacing: '-0.025em' }}>
            Visual Outlet
          </Typography>
        </Box>
      </Box>

      <Container component="main" maxWidth="md"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card elevation={2} sx={{ width: "100%", maxWidth: 520, p: 3.5, borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h5" component="h2" color="text.primary" fontWeight="600">
                Crear una cuenta
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                ¡Cuenta creada! Serás redirigido al inicio de sesión...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="nombre" label="Nombre completo"
                    value={formData.nombre} onChange={handleChange}
                    placeholder="Tu nombre completo" required disabled={success || loading} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="correo" label="Correo electrónico"
                    type="email" value={formData.correo} onChange={handleChange}
                    placeholder="tu@correo.com" required disabled={success || loading} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="telefono" label="Teléfono"
                    type="tel" value={formData.telefono} onChange={handleChange}
                    placeholder="+57 300 123 4567" disabled={success || loading} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="fechaNacimiento" label="Fecha de nacimiento"
                    type="date" value={formData.fechaNacimiento} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} required disabled={success || loading} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select name="tipoDocumento" value={formData.tipoDocumento}
                      label="Tipo de documento" onChange={handleChange} disabled={success || loading}>
                      {Object.entries(TIPOS_DOCUMENTO).map(([key, value]) => (
                        <MenuItem key={key} value={key}>{value}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="numeroDocumento" label="Número de documento"
                    value={formData.numeroDocumento} onChange={handleChange}
                    placeholder={getDocumentPlaceholder()} required disabled={success || loading} />
                </Grid>

                {/* Contraseña */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="contrasenia" label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={formData.contrasenia} onChange={handleChange}
                    placeholder="········" required disabled={success || loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <PasswordStrength password={formData.contrasenia} />
                </Grid>

                {/* Confirmar contraseña */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" name="confirmContrasenia" label="Confirmar contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmContrasenia} onChange={handleChange}
                    placeholder="········" required disabled={success || loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                            {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              {/* Términos */}
              <Box sx={{ mt: 2.5, mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Checkbox name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange}
                  color="primary" size="small" disabled={success || loading} sx={{ mt: -0.5 }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: 1.5 }}>
                  Acepto los{' '}
                  <Button component={Link} to="/terms" variant="text" size="small"
                    sx={{ fontSize: '0.85rem', p: 0, minWidth: 'auto', fontWeight: '600', textTransform: 'none', verticalAlign: 'baseline' }}>
                    términos y condiciones
                  </Button>
                </Typography>
              </Box>

              <Button type="submit" fullWidth variant="contained"
                disabled={success || loading}
                sx={{ mt: 2, mb: 2.5, py: 1.2, textTransform: 'none', fontSize: '0.95rem', fontWeight: '700', borderRadius: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Crear cuenta"}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', display: 'inline' }}>
                ¿Ya tienes una cuenta?{" "}
              </Typography>
              <Button component={Link} to="/login" variant="text" size="small"
                sx={{ textTransform: 'none', fontSize: '0.85rem', fontWeight: '700', p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}>
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
        onResend={handleResendCode}
        loading={loading}
      />
    </Box>
  );
}