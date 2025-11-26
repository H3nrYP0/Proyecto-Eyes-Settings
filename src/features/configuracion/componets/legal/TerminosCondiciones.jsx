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
import { Description, Save, PictureAsPdf } from "@mui/icons-material";

const TerminosCondiciones = ({ canEdit = false }) => {
  const [terminos, setTerminos] = useState({
    titulo: "Términos y Condiciones de Uso",
    contenido: `# Términos y Condiciones de Uso

## 1. Aceptación de los Términos
Al utilizar el sistema de gestión Visual Outtle, usted acepta cumplir con estos términos y condiciones.

## 2. Uso del Servicio
El sistema está destinado para la gestión de ópticas y debe ser utilizado de manera responsable.

## 3. Responsabilidades del Usuario
- Mantener la confidencialidad de sus credenciales
- Utilizar el sistema conforme a la ley
- Reportar cualquier uso no autorizado

## 4. Propiedad Intelectual
Todo el contenido y software son propiedad de Visual Outtle © 2025.`,
    version: "1.0",
    fechaActualizacion: new Date().toISOString().split('T')[0],
    contactoLegal: "legal@optica.com"
  });

  const handleChange = (e) => {
    setTerminos({
      ...terminos,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para modificar los términos y condiciones");
      return;
    }
    console.log("Términos y condiciones guardados:", terminos);
    alert("Términos y condiciones actualizados correctamente");
  };

  const handleExportPDF = () => {
    alert("Exportando términos y condiciones a PDF...");
    console.log("PDF exportado:", terminos);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Description color="primary" />
        <Typography variant="h6" component="h2">
          Términos y Condiciones
        </Typography>
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Modo de solo lectura. Solo los administradores pueden modificar los términos y condiciones.
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
                value={terminos.version}
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
                value={terminos.fechaActualizacion}
                onChange={handleChange}
                disabled={!canEdit}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email de Contacto Legal"
                name="contactoLegal"
                type="email"
                value={terminos.contactoLegal}
                onChange={handleChange}
                placeholder="legal@empresa.com"
                disabled={!canEdit}
              />
            </Grid>

            {/* Título y Contenido */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título del Documento"
                name="titulo"
                value={terminos.titulo}
                onChange={handleChange}
                placeholder="Título de los términos y condiciones"
                disabled={!canEdit}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenido"
                name="contenido"
                value={terminos.contenido}
                onChange={handleChange}
                placeholder="Escribe aquí los términos y condiciones..."
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
                Establece los términos de uso del sistema. Soporta formato Markdown.
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
              {terminos.contenido}
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
              {canEdit ? "Guardar Términos" : "Solo Lectura"}
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
              <strong>Documento legal:</strong> Los términos y condiciones son un documento 
              legal importante que debe ser gestionado únicamente por administradores autorizados.
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default TerminosCondiciones;