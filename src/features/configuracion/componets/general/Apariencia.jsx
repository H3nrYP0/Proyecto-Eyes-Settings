/* import { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
  Chip
} from "@mui/material";
import { Palette, Brightness4, Brightness7 } from "@mui/icons-material";

const Apariencia = ({ canEdit = false, isGlobal = false, userRole = "" }) => {
  const [apariencia, setApariencia] = useState({
    tema: "claro",
    densidad: "comoda",
    tamanoFuente: "medio",
    colorPrimario: "#3B82F6"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApariencia({
      ...apariencia,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para guardar cambios en la apariencia");
      return;
    }
    console.log("Configuración de apariencia:", apariencia);
    alert("Configuración de apariencia guardada");
  };

  const handleReset = () => {
    if (!canEdit) {
      alert("No tienes permisos para restablecer la configuración");
      return;
    }
    setApariencia({
      tema: "claro",
      densidad: "comoda",
      tamanoFuente: "medio",
      colorPrimario: "#3B82F6"
    });
    alert("Configuración restablecida");
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Palette color="primary" />
        <Typography variant="h6" component="h2">
          Apariencia y Tema
        </Typography>
        <Chip 
          label={isGlobal ? "Configuración Global" : "Configuración Personal"} 
          color={isGlobal ? "primary" : "default"}
          size="small"
          variant="outlined"
        />
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Estás en modo de solo lectura. Solo los administradores pueden modificar la apariencia.
        </Alert>
      )}

      {isGlobal && canEdit && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Los cambios en esta sección afectarán a todos los usuarios del sistema.
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Tema de la Aplicación }
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tema de la Aplicación</FormLabel>
                <RadioGroup
                  row
                  name="tema"
                  value={apariencia.tema}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel 
                    value="claro" 
                    control={<Radio disabled={!canEdit} />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Brightness7 />
                        Tema Claro
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="oscuro" 
                    control={<Radio disabled={!canEdit} />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Brightness4 />
                        Tema Oscuro
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="auto" 
                    control={<Radio disabled={!canEdit} />} 
                    label="Automático (según sistema)" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Densidad y Tamaño de Fuente }
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <FormLabel>Densidad de la Interfaz</FormLabel>
                <Select
                  name="densidad"
                  value={apariencia.densidad}
                  onChange={handleChange}
                  disabled={!canEdit}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="compacta">Compacta</MenuItem>
                  <MenuItem value="comoda">Cómoda</MenuItem>
                  <MenuItem value="espaciosa">Espaciosa</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <FormLabel>Tamaño de Fuente</FormLabel>
                <Select
                  name="tamanoFuente"
                  value={apariencia.tamanoFuente}
                  onChange={handleChange}
                  disabled={!canEdit}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="pequeno">Pequeño</MenuItem>
                  <MenuItem value="medio">Medio</MenuItem>
                  <MenuItem value="grande">Grande</MenuItem>
                  <MenuItem value="muy-grande">Muy Grande</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Color Primario }
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Color Primario</FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <TextField
                    type="color"
                    name="colorPrimario"
                    value={apariencia.colorPrimario}
                    onChange={handleChange}
                    disabled={!canEdit}
                    sx={{
                      width: 60,
                      height: 60,
                      '& .MuiInputBase-input': {
                        padding: 1,
                        height: '100%'
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {apariencia.colorPrimario}
                  </Typography>
                </Box>
              </FormControl>
            </Grid>
          </Grid>

          {/* Acciones }
          <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button 
              type="submit" 
              variant="contained"
              disabled={!canEdit}
            >
              {canEdit ? "Aplicar Cambios" : "Solo Lectura"}
            </Button>
            <Button 
              type="button" 
              variant="outlined"
              onClick={handleReset}
              disabled={!canEdit}
            >
              Restablecer
            </Button>
          </Box>

          {!canEdit && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Permisos requeridos:</strong> Rol de Administrador o Super Administrador
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
}; */

import EnConstruccionUniversal from "../EnConstruccionUniversal";

const Apariencia = () => {
  return (
    <EnConstruccionUniversal 
      titulo="Información de la Empresa"
      mensaje="Esta sección de configuración está en desarrollo. Volverá pronto con nuevas funcionalidades."
    />
  );
};


export default Apariencia;