// src/features/compras/pages/Marcas/EditarMarca.jsx

/**
 * COMPONENTE EDITAR MARCA - Formulario para editar marcas existentes
 * Reutiliza la misma estructura y campos que NuevaMarca
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Importaciones de Material UI
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  Snackbar
} from "@mui/material";

// Importaciones de componentes y estilos
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/globals/formularios.css";

export default function EditarMarca() {
  // Hooks para navegación y acceso a datos
  const location = useLocation();
  const navigate = useNavigate();
  const { marca } = location.state || {};

  // Estado para los datos del formulario (mismos campos que NuevaMarca)
  const [formData, setFormData] = useState({
    nombre: marca?.nombre || "",
    descripcion: marca?.descripcion || "",
    estado: marca?.estado || "Activa"
  });

  // Estado para controlar notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  /**
   * VALIDACIÓN: Verificar si existe la marca
   * Si no hay datos de marca, mostrar mensaje de error
   */
  if (!marca) {
    return (
      <CrudLayout
        title="Marca No Encontrada"
        description="No se encontraron datos de la marca para editar."
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
   * FUNCIÓN: handleSubmit
   * Propósito: Manejar el envío del formulario de edición
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica del formulario
    if (!formData.nombre.trim()) {
      setSnackbar({
        open: true,
        message: "El nombre de la marca es obligatorio",
        severity: "error"
      });
      return;
    }
    
    // Confirmación antes de guardar cambios
    if (confirm(`¿Estás seguro de que deseas guardar los cambios en la marca "${formData.nombre}"?`)) {
      // Simulación de éxito en la edición
      setSnackbar({
        open: true,
        message: `✅ Marca "${formData.nombre}" actualizada exitosamente`,
        severity: "success"
      });
      
      // Navegar de regreso a la lista de marcas después de 2 segundos
      setTimeout(() => {
        navigate("/admin/compras/marcas");
      }, 2000);
    }
  };

  /**
   * FUNCIÓN: handleChange
   * Propósito: Manejar cambios en los campos del formulario
   * @param {Event} e - Evento del cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * FUNCIÓN: handleCloseSnackbar
   * Propósito: Cerrar el snackbar de notificaciones
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * FUNCIÓN: handleCancel
   * Propósito: Manejar la cancelación y regresar a la lista
   */
  const handleCancel = () => {
    if (confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
      navigate("/admin/compras/marcas");
    }
  };

  return (
    <CrudLayout
      title={`✏️ Editar Marca: ${marca.nombre}`}
      description="Modifica los datos de la marca seleccionada."
      onAddClick={null}
    >
      {/* Notificación de éxito/error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Formulario principal usando las mismas clases que NuevaMarca */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        className="formulario-container"
      >
        {/* Header del formulario */}
        <Box className="formulario-header">
          <Typography variant="h4" component="h3" gutterBottom>
            Editar Información de la Marca
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Modifica los datos de <strong>{marca.nombre}</strong> en el siguiente formulario
          </Typography>
        </Box>

        {/* Campo: Nombre de la marca */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Nombre de la Marca *
          </Typography>
          <TextField
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder="Ej: Ray-Ban, Oakley, Essilor..."
            className="formulario-control"
          />
        </Box>

        {/* Campo: Descripción */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Descripción
          </Typography>
          <TextField
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Describe la marca y sus características..."
            className="formulario-control formulario-textarea"
          />
        </Box>

        {/* Campo: Estado */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle1" 
            component="label" 
            className="formulario-label"
          >
            Estado
          </Typography>
          <TextField
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            select
            fullWidth
            variant="outlined"
            className="formulario-control formulario-select"
          >
            <MenuItem value="Activa">Activa</MenuItem>
            <MenuItem value="Inactiva">Inactiva</MenuItem>
          </TextField>
        </Box>

        {/* Información de auditoría (solo lectura) */}
        <Box className="formulario-group">
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontStyle: 'italic', mt: 2 }}
          >
            ID de la marca: {marca.id}
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Box className="formulario-actions">
          {/* Botón Cancelar */}
          <Button
            type="button"
            onClick={handleCancel}
            variant="outlined"
            sx={{
              padding: '12px 24px',
              borderColor: 'grey.400',
              color: 'grey.700',
              '&:hover': {
                borderColor: 'grey.500',
                backgroundColor: 'grey.50'
              }
            }}
          >
            Cancelar
          </Button>

          {/* Botón Guardar Cambios */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              padding: '12px 24px',
              backgroundColor: '#2563EB',
              '&:hover': {
                backgroundColor: '#1D4ED8'
              }
            }}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Box>
    </CrudLayout>
  );
}