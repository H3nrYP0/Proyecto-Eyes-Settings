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
import { Security, Save, PictureAsPdf } from "@mui/icons-material";

const PoliticaPrivacidad = ({ canEdit = false }) => {
  const [politica, setPolitica] = useState({
    titulo: "Política de Privacidad",
    contenido: `# Política de Privacidad

## 1. Información que Recopilamos
Recopilamos información necesaria para la gestión de su óptica, incluyendo:
- Datos de clientes y pacientes
- Información de inventario y ventas
- Datos de empleados y proveedores

## 2. Uso de la Información
Utilizamos la información para:
- Gestionar citas y servicios de la óptica
- Procesar ventas y transacciones
- Mantener registros médicos de pacientes
- Mejorar nuestros servicios

## 3. Protección de Datos
Implementamos medidas de seguridad para proteger su información contra accesos no autorizados.`,
    version: "1.0",
    fechaActualizacion: new Date().toISOString().split('T')[0],
    contactoPrivacidad: "privacidad@optica.com"
  });

  const handleChange = (e) => {
    setPolitica({
      ...politica,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para modificar la política de privacidad");
      return;
    }
    console.log("Política de privacidad guardada:", politica);
    alert("Política de privacidad actualizada correctamente");
  };

  const handleExportPDF = () => {
    alert("Exportando política de privacidad a PDF...");
    console.log("PDF exportado:", politica);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Security color="primary" />
        <Typography variant="h6" component="h2">
          Política de Privacidad
        </Typography>
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Modo de solo lectura. Solo los administradores pueden modificar la política de privacidad.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Metadatos */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Versión"
                name="version"
                value={politica.version}
                onChange={handleChange}
                placeholder="Ej: 1.0"
                disabled={!canEdit}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fecha de Actualización"
                name="fechaActualizacion"
                type="date"
                value={politica.fechaActualizacion}
                onChange={handleChange}
                disabled={!canEdit}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email de Contacto para Privacidad"
                name="contactoPrivacidad"
                type="email"
                value={politica.contactoPrivacidad}
                onChange={handleChange}
                placeholder="privacidad@empresa.com"
                disabled={!canEdit}
              />
            </Grid>

            {/* Título y Contenido */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la Política"
                name="titulo"
                value={politica.titulo}
                onChange={handleChange}
                placeholder="Título de la política de privacidad"
                disabled={!canEdit}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenido"
                name="contenido"
                value={politica.contenido}
                onChange={handleChange}
                placeholder="Escribe aquí la política de privacidad..."
                disabled={!canEdit}
                multiline
                rows={12}
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Describe cómo manejas y proteges los datos de tus clientes. Soporta formato Markdown.
              </Typography>
            </Grid>
          </Grid>

          {/* Vista Previa */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Vista Previa:
            </Typography>
            <Box sx={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '0.9rem'
            }}>
              {politica.contenido}
            </Box>
          </Box>

          {/* Acciones */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={<Save />}
              disabled={!canEdit}
            >
              {canEdit ? "Guardar Política" : "Solo Lectura"}
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
            >
              Exportar PDF
            </Button>
          </Box>

          {!canEdit && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Documento legal:</strong> La política de privacidad es un documento 
              legal importante que debe ser gestionado únicamente por administradores autorizados.
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default PoliticaPrivacidad;