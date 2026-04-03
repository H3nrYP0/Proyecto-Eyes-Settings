import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
// Importamos Security correctamente
import { Security, Save, PictureAsPdf } from "@mui/icons-material";

const PoliticaPrivacidad = ({ canEdit = false }) => {
  const [politica, setPolitica] = useState({
    titulo: "Política de Privacidad",
    contenido: `# Política de Privacidad ...`, // Contenido omitido por brevedad
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
    if (!canEdit) return;
    console.log("Política guardada:", politica);
    alert("Actualizada correctamente");
  };

  const handleExportPDF = () => {
    alert("Exportando a PDF...");
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {/* CORRECCIÓN: Usamos el componente Security de MUI que importamos arriba */}
        <Security color="primary" />
        <Typography variant="h6" component="h2">
          Política de Privacidad
        </Typography>
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Modo de solo lectura. Solo los administradores pueden modificar la política.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* ... Campos de Versión, Fecha y Email se mantienen igual ... */}
            <Grid item xs={12} md={4}>
               <TextField
                 fullWidth
                 label="Versión"
                 name="version"
                 value={politica.version}
                 onChange={handleChange}
                 disabled={!canEdit}
               />
            </Grid>
            {/* (Resto de los Grid items del formulario...) */}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenido"
                name="contenido"
                value={politica.contenido}
                onChange={handleChange}
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
        </form>
      </Paper>
    </Box>
  );
};

export default PoliticaPrivacidad;