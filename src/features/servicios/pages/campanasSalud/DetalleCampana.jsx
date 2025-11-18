import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Chip,
  Paper
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";

/**
 * Componente para ver los detalles de una campaña (solo lectura)
 */
export default function DetalleCampana() {
  const navigate = useNavigate();
  const location = useLocation();

  const [campanaData, setCampanaData] = useState(null);
  const [hasData, setHasData] = useState(false);

  /**
   * Carga los datos de la campaña
   */
  useEffect(() => {
    if (location.state?.campanaData) {
      setCampanaData(location.state.campanaData);
      setHasData(true);
    } else {
      alert("No se encontraron datos de la campaña");
      navigate(-1);
    }
  }, [location.state, navigate]);

  /**
   * Navega a editar
   */
  const handleEdit = () => {
    navigate("editar", { state: { campanaData } });
  };

  /**
   * Regresa a la lista
   */
  const handleBack = () => {
    navigate(-1);
  };

  /**
   * Obtiene color del estado
   */
  const getStatusColor = (estado) => {
    const colors = {
      'en proceso': 'success',
      'inactiva': 'default',
      'finalizada': 'primary'
    };
    return colors[estado] || 'default';
  };

  /**
   * Obtiene texto del estado
   */
  const getStatusText = (estado) => {
    const textos = {
      'en proceso': 'En Proceso',
      'inactiva': 'Inactiva',
      'finalizada': 'Finalizada'
    };
    return textos[estado] || 'Inactiva';
  };

  if (!hasData || !campanaData) {
    return (
      <div className="formulario-container">
        <Typography variant="h6" align="center">
          Cargando...
        </Typography>
      </div>
    );
  }

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <Typography variant="h4" component="h1" gutterBottom>
          👁️ Detalle de Campaña
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Información completa de la campaña
        </Typography>
      </div>

      <Box>
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Información Básica
          </Typography>
          
          <div className="formulario-row">
            <div className="detail-group">
              <label className="formulario-label">Nombre</label>
              <div className="detail-value">
                {campanaData.nombre}
              </div>
            </div>

            <div className="detail-group">
              <label className="formulario-label">Descuento</label>
              <div className="detail-value">
                {campanaData.descuento}
              </div>
            </div>
          </div>

          <div className="detail-group">
            <label className="formulario-label">Descripción</label>
            <div className="detail-value">
              {campanaData.descripcion}
            </div>
          </div>
        </Paper>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Fechas
          </Typography>
          
          <div className="formulario-row">
            <div className="detail-group">
              <label className="formulario-label">Fecha Inicio</label>
              <div className="detail-value">
                {campanaData.fechaInicio}
              </div>
            </div>

            <div className="detail-group">
              <label className="formulario-label">Fecha Fin</label>
              <div className="detail-value">
                {campanaData.fechaFin}
              </div>
            </div>
          </div>
        </Paper>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Estado
          </Typography>
          
          <div className="detail-group">
            <label className="formulario-label">Estado</label>
            <div>
              <Chip 
                label={getStatusText(campanaData.estado)}
                color={getStatusColor(campanaData.estado)}
                variant="outlined"
              />
            </div>
          </div>
        </Paper>
      </Box>

      <div className="formulario-actions">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Volver
        </Button>
        
        {/* <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          Editar
        </Button> */}
      </div>
    </div>
  );
}