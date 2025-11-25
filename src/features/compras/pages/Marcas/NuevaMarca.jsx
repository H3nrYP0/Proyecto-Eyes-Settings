// src/features/compras/pages/Marcas/NuevaMarca.jsx

/**
 * COMPONENTE NUEVA MARCA - Formulario para crear nuevas marcas
 * Utiliza los estilos globales de formularios.css
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import "../../../../shared/styles/globals/formularios.css"; // ✅ Usamos tu CSS existente

export default function NuevaMarca() {
  // Hook para navegación entre rutas
  const navigate = useNavigate();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "Activa"
  });

  // Estado para controlar notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  /**
   * FUNCIÓN: handleSubmit
   * Propósito: Manejar el envío del formulario
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
    
    // Simulación de éxito en la creación
    setSnackbar({
      open: true,
      message: `✅ Marca "${formData.nombre}" creada exitosamente`,
      severity: "success"
    });
    
    // Navegar de regreso a la lista de marcas después de 2 segundos
    setTimeout(() => {
      navigate("/admin/compras/marcas");
    }, 2000);
  };

  /**
   * FUNCIÓN: handleChange
   * Propósito: Manejar cambios en los campos del formulario
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
    navigate("/admin/compras/marcas");
  };

  return (
    <CrudLayout
      title="➕ Nueva Marca"
      description="Registra una nueva marca en el sistema"
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

      {/* Formulario principal usando tus clases CSS existentes */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        className="formulario-container"
      >
        {/* Header del formulario */}
        <Box className="formulario-header">
          <Typography variant="h4" component="h3" gutterBottom>
            Información de la Marca
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Completa los datos para registrar una nueva marca en el sistema
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
        {/* FUNCION PARA DETERMINAR EL ESTADO DE LA MARCA AL MOMENTO DE AGREGAR UNA MARCA */}
        {/* Campo: Estado
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
        </Box> */}

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

          {/* Botón Crear Marca */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              padding: '12px 24px',
              backgroundColor: '#2563EB', // Azul del botón Nuevo
              '&:hover': {
                backgroundColor: '#1D4ED8'
              }
            }}
          >
            Crear Marca
          </Button>
        </Box>
      </Box>
    </CrudLayout>
  );
}