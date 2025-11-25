import { useLocation, useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function DetalleServicio() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { servicioData } = location.state || {};

  if (!servicioData) {
    return (
      <CrudLayout
        title="👁️ Detalle del Servicio"
        description="Servicio no encontrado"
        showAddButton={false}
      >
        <Box className="formulario-container">
          <Box style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>❌ Servicio no encontrado</h3>
            <p>No se pudo cargar la información del servicio.</p>
            <Button 
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Volver a Servicios
            </Button>
          </Box>
        </Box>
      </CrudLayout>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  return (
    <CrudLayout
      title="👁️ Detalle del Servicio"
      description={`Información de: ${servicioData.nombre}`}
      showAddButton={false}
    >
      <Box className="formulario-container">
        <Box className="formulario-header">
          <h3>🛠️ {servicioData.nombre}</h3>
          <p>Detalles completos del servicio seleccionado</p>
        </Box>

        <Box className="formulario-section">
          <h4>Información Básica</h4>
          <Box className="formulario-row">
            <Box className="detail-group">
              <label>Nombre del Servicio</label>
              <Box className="detail-value">{servicioData.nombre}</Box>
            </Box>
            <Box className="detail-group">
              <label>Estado</label>
              <Box className={`detail-value status-${servicioData.estado}`}>
                {servicioData.estado === 'active' ? 'Activo' : 'Inactivo'}
              </Box>
            </Box>
          </Box>
          
          <Box className="detail-group full-width">
            <label>Descripción</label>
            <Box className="detail-value">{servicioData.descripcion}</Box>
          </Box>
        </Box>

        <Box className="formulario-section">
          <h4>Detalles del Servicio</h4>
          <Box className="formulario-row">
            <Box className="detail-group">
              <label>Duración</label>
              <Box className="detail-value">{servicioData.duracion} minutos</Box>
            </Box>
            <Box className="detail-group">
              <label>Precio</label>
              <Box className="detail-value">{formatPrice(servicioData.precio)}</Box>
            </Box>
          </Box>
          
          <Box className="detail-group full-width">
            <label>Empleado Responsable</label>
            <Box className="detail-value">{servicioData.empleado}</Box>
          </Box>
        </Box>

        <Box className="formulario-actions">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Volver a Servicios
          </Button>
        </Box>
      </Box>
    </CrudLayout>
  );
}