import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
  Divider
} from "@mui/material";
import { Business, Save, Cancel } from "@mui/icons-material";

const EmpresaInfo = ({ canEdit = false, isGlobal = false }) => {
  const [formData, setFormData] = useState({
    nombre: "Óptica Visual Center",
    ruc: "12345678901",
    direccion: "Av. Principal #123, Ciudad",
    telefono: "+57 123 456 7890",
    email: "info@opticavisual.com",
    sitioWeb: "https://www.opticavisual.com"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para guardar la información de la empresa");
      return;
    }
    console.log("Datos guardados:", formData);
    alert("Información de la empresa guardada correctamente");
  };

  const handleCancel = () => {
    if (!canEdit) {
      alert("No tienes permisos para realizar esta acción");
      return;
    }
    // En una implementación real, aquí se restaurarían los datos originales
    alert("Cambios cancelados");
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Business color="primary" />
        <Typography variant="h6" component="h2">
          Información de la Empresa
        </Typography>
        {isGlobal && (
          <Alert severity="warning" sx={{ py: 0 }}>
            Configuración Global
          </Alert>
        )}
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Modo de solo lectura. Solo los administradores pueden modificar la información de la empresa.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Información Básica
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la Óptica *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa el nombre de tu óptica"
                required
                disabled={!canEdit}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección *"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección completa"
                required
                disabled={!canEdit}
              />
            </Grid>

            {/* Información de Contacto */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Información de Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono *"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Número de contacto"
                required
                disabled={!canEdit}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                disabled={!canEdit}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sitio Web"
                name="sitioWeb"
                type="url"
                value={formData.sitioWeb}
                onChange={handleChange}
                placeholder="https://www.ejemplo.com"
                disabled={!canEdit}
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
              {canEdit ? "Guardar Cambios" : "Solo Lectura"}
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={!canEdit}
            >
              Cancelar
            </Button>
          </Box>

          {!canEdit && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Información importante:</strong> Esta sección contiene datos legales y fiscales de la empresa. 
              Solo usuarios con rol de Administrador pueden modificarlos.
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default EmpresaInfo;