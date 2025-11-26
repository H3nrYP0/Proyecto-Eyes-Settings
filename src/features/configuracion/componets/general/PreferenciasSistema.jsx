import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Settings, Save, Restore } from "@mui/icons-material";

const PreferenciasSistema = ({ canEdit = false, isGlobal = false }) => {
  const [preferencias, setPreferencias] = useState({
    moneda: "USD",
    zonaHoraria: "America/Bogota",
    idioma: "es",
    notificacionesEmail: true,
    notificacionesSMS: false,
    recordatoriosCitas: true,
    backupAutomatico: true,
    limiteBackups: 30
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencias({
      ...preferencias,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para guardar las preferencias del sistema");
      return;
    }
    console.log("Preferencias guardadas:", preferencias);
    alert("Preferencias del sistema guardadas correctamente");
  };

  const handleReset = () => {
    if (!canEdit) {
      alert("No tienes permisos para restablecer las preferencias");
      return;
    }
    setPreferencias({
      moneda: "USD",
      zonaHoraria: "America/Bogota",
      idioma: "es",
      notificacionesEmail: true,
      notificacionesSMS: false,
      recordatoriosCitas: true,
      backupAutomatico: true,
      limiteBackups: 30
    });
    alert("Preferencias restablecidas a valores por defecto");
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Settings color="primary" />
        <Typography variant="h6" component="h2">
          Preferencias del Sistema
        </Typography>
        {isGlobal && (
          <Alert severity="warning" sx={{ py: 0 }}>
            Configuración Global
          </Alert>
        )}
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Modo de solo lectura. Solo los administradores pueden modificar las preferencias del sistema.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Configuración Regional */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Configuración Regional
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Moneda Principal</InputLabel>
                <Select
                  name="moneda"
                  value={preferencias.moneda}
                  onChange={handleChange}
                  disabled={!canEdit}
                  label="Moneda Principal"
                >
                  <MenuItem value="USD">Dólares Americanos (USD)</MenuItem>
                  <MenuItem value="EUR">Euros (EUR)</MenuItem>
                  <MenuItem value="COP">Pesos Colombianos (COP)</MenuItem>
                  <MenuItem value="MXN">Pesos Mexicanos (MXN)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Zona Horaria</InputLabel>
                <Select
                  name="zonaHoraria"
                  value={preferencias.zonaHoraria}
                  onChange={handleChange}
                  disabled={!canEdit}
                  label="Zona Horaria"
                >
                  <MenuItem value="America/Bogota">Bogotá, Lima, Quito (UTC-5)</MenuItem>
                  <MenuItem value="America/Mexico_City">Ciudad de México (UTC-6)</MenuItem>
                  <MenuItem value="America/New_York">Nueva York (UTC-5)</MenuItem>
                  <MenuItem value="America/Los_Angeles">Los Ángeles (UTC-8)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Idioma</InputLabel>
                <Select
                  name="idioma"
                  value={preferencias.idioma}
                  onChange={handleChange}
                  disabled={!canEdit}
                  label="Idioma"
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="pt">Português</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Notificaciones */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Configuración de Notificaciones
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="notificacionesEmail"
                    checked={preferencias.notificacionesEmail}
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                }
                label="Notificaciones por email"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="notificacionesSMS"
                    checked={preferencias.notificacionesSMS}
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                }
                label="Notificaciones por SMS"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="recordatoriosCitas"
                    checked={preferencias.recordatoriosCitas}
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                }
                label="Recordatorios de citas automáticos"
              />
            </Grid>

            {/* Backup y Seguridad */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Backup y Seguridad
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="backupAutomatico"
                    checked={preferencias.backupAutomatico}
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                }
                label="Backup automático diario"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Límite de backups (días)"
                name="limiteBackups"
                type="number"
                value={preferencias.limiteBackups}
                onChange={handleChange}
                disabled={!canEdit || !preferencias.backupAutomatico}
                InputProps={{ inputProps: { min: 1, max: 365 } }}
              />
            </Grid>
          </Grid>

          {/* Acciones */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={<Save />}
              disabled={!canEdit}
            >
              {canEdit ? "Guardar Preferencias" : "Solo Lectura"}
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              startIcon={<Restore />}
              onClick={handleReset}
              disabled={!canEdit}
            >
              Restablecer Valores
            </Button>
          </Box>

          {!canEdit && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Configuración del sistema:</strong> Estas preferencias afectan el comportamiento 
              global de la aplicación. Modificarlas requiere permisos de administrador.
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default PreferenciasSistema;