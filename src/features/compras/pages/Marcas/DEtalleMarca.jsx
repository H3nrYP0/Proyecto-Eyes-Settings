// src/features/compras/pages/Marcas/DetalleMarca.jsx

/**
 * COMPONENTE DETALLE MARCA - Vista de solo lectura para ver detalles completos
 * Reutiliza la estructura del formulario en modo lectura
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Importaciones de Material UI
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Paper
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

// Importaciones de componentes y estilos
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/globals/formularios.css";

export default function DetalleMarca() {
  // Hooks para navegación y acceso a datos
  const location = useLocation();
  const navigate = useNavigate();
  const { marca } = location.state || {};

  /**
   * VALIDACIÓN: Verificar si existe la marca
   * Si no hay datos de marca, mostrar mensaje de error
   */
  if (!marca) {
    return (
      <CrudLayout
        title="Marca No Encontrada"
        description="No se encontraron datos de la marca solicitada."
      >
        <Box className="formulario-container" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error: Marca no encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            No se pudieron cargar los datos de la marca. Puede que haya sido eliminada o no exista.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/admin/compras/marcas")}
            sx={{ mt: 2 }}
          >
            Volver a Marcas
          </Button>
        </Box>
      </CrudLayout>
    );
  }

  /**
   * FUNCIÓN: handleVolver
   * Propósito: Manejar el regreso a la lista de marcas
   */
  const handleVolver = () => {
    navigate("/admin/compras/marcas");
  };

  /**
   * FUNCIÓN: handleEditar
   * Propósito: Navegar a la vista de edición
   */
  const handleEditar = () => {
    navigate("editar", { state: { marca } });
  };

  return (
    <CrudLayout
      title={`👁️ Detalle de Marca: ${marca.nombre}`}
      description="Información completa de la marca seleccionada."
      showAddButton={false}
    >
      {/* Botón para volver */}
      <Box sx={{ marginBottom: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleVolver}
          variant="outlined"
          sx={{
            padding: '10px 20px',
            borderColor: 'grey.400',
            color: 'grey.700',
            '&:hover': {
              borderColor: 'grey.500',
              backgroundColor: 'grey.50'
            }
          }}
        >
          Volver a Marcas
        </Button>
      </Box>

      {/* Contenedor principal en modo solo lectura */}
      <Box className="formulario-container form-readonly">
        
        {/* Header del formulario */}
        <Box className="formulario-header">
          <Typography variant="h4" component="h3" gutterBottom>
            Información Detallada de la Marca
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vista de solo lectura - Todos los campos son informativos
          </Typography>
        </Box>

        {/* Campo: Nombre de la marca (solo lectura) */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Nombre de la Marca
          </Typography>
          <TextField
            value={marca.nombre}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            className="formulario-control"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50',
                '& fieldset': {
                  borderColor: 'grey.300',
                },
                '&:hover fieldset': {
                  borderColor: 'grey.400',
                },
              }
            }}
          />
        </Box>

        {/* Campo: Descripción (solo lectura) */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Descripción
          </Typography>
          <TextField
            value={marca.descripcion}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            className="formulario-control formulario-textarea"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50',
                '& fieldset': {
                  borderColor: 'grey.300',
                },
                '&:hover fieldset': {
                  borderColor: 'grey.400',
                },
              }
            }}
          />
        </Box>

        {/* Campo: Estado con Chip visual */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Estado
          </Typography>
          <Chip
            label={marca.estado === "Activa" ? "✅ Activa" : "❌ Inactiva"}
            color={marca.estado === "Activa" ? "success" : "default"}
            variant={marca.estado === "Activa" ? "filled" : "outlined"}
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px'
            }}
          />
        </Box>

        {/* Información de identificación */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Identificación
          </Typography>
          <Paper 
            elevation={0}
            sx={{
              padding: 2,
              backgroundColor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ID de la marca: <strong>{marca.id}</strong>
            </Typography>
          </Paper>
        </Box>

        {/* Información adicional si existe */}
        {(marca.fechaCreacion || marca.productosAsociados || marca.categoria || marca.paisOrigen) && (
          <Box className="formulario-group">
            <Typography 
              variant="subtitle1" 
              component="label" 
              className="formulario-label"
              sx={{ color: 'primary.main', mb: 2 }}
            >
              Información Adicional
            </Typography>
            
            <Box className="formulario-row">
              {marca.fechaCreacion && (
                <Box className="formulario-group">
                  <Typography variant="body2" fontWeight="600" gutterBottom>
                    Fecha de Creación
                  </Typography>
                  <TextField
                    value={marca.fechaCreacion}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'grey.50',
                      }
                    }}
                  />
                </Box>
              )}
              
              {marca.productosAsociados && (
                <Box className="formulario-group">
                  <Typography variant="body2" fontWeight="600" gutterBottom>
                    Productos Asociados
                  </Typography>
                  <TextField
                    value={`${marca.productosAsociados} productos`}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'grey.50',
                      }
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box className="formulario-row">
              {marca.categoria && (
                <Box className="formulario-group">
                  <Typography variant="body2" fontWeight="600" gutterBottom>
                    Categoría
                  </Typography>
                  <TextField
                    value={marca.categoria}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'grey.50',
                      }
                    }}
                  />
                </Box>
              )}
              
              {marca.paisOrigen && (
                <Box className="formulario-group">
                  <Typography variant="body2" fontWeight="600" gutterBottom>
                    País de Origen
                  </Typography>
                  <TextField
                    value={marca.paisOrigen}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'grey.50',
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Box className="formulario-actions">
        
        </Box>
      </Box>
    </CrudLayout>
  );
}