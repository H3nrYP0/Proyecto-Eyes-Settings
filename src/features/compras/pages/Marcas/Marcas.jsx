// src/features/compras/pages/Marcas/Marcas.jsx

/**
 * COMPONENTE MARCAS - Gestión completa de marcas de productos
 * 
 * Funcionalidades:
 * - Listar marcas con búsqueda
 * - Cambiar estado (Activo/Inactivo)
 * - Ver detalles, editar y eliminar marcas
 * - Notificaciones con Snackbar
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones de Material UI para componentes de interfaz
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Typography
} from "@mui/material";

// Importaciones de íconos de Material UI
import { Search, Add } from "@mui/icons-material";

// Importaciones de componentes y estilos personalizados
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/CrudLayout.css";
import "../../../../shared/styles/components/Marcas.css";

export default function Marcas() {
  // Hook de React Router para navegación entre rutas
  const navigate = useNavigate();
  
  /**
   * ESTADO DE MARCAS - Datos de ejemplo iniciales
   * Cada marca contiene:
   * - id: Identificador único
   * - nombre: Nombre de la marca
   * - descripcion: Descripción detallada
   * - estado: Estado actual (Activa/Inactiva)
   */
  const [marcas, setMarcas] = useState([
    {
      id: 1,
      nombre: "Ray-Ban",
      descripcion: "Lentes de sol y monturas de alta gama",
      estado: "Activa"
    },
    {
      id: 2,
      nombre: "Oakley",
      descripcion: "Lentes deportivos y de protección",
      estado: "Activa"
    },
    {
      id: 3,
      nombre: "Essilor",
      descripcion: "Lentes oftálmicos y tecnología visual",
      estado: "Activa"
    },
    {
      id: 4,
      nombre: "Johnson & Johnson",
      descripcion: "Lentes de contacto y productos oftálmicos",
      estado: "Activa"
    }
  ]);

  // Estado para el texto de búsqueda en tiempo real
  const [busqueda, setBusqueda] = useState("");

  /**
   * ESTADO DE SNACKBAR - Control de notificaciones
   * - open: Controla visibilidad
   * - message: Texto del mensaje
   * - severity: Tipo de alerta (success, error, warning, info)
   */
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  /**
   * FUNCIÓN: handleAddMarca
   * Propósito: Navegar a la vista de creación de nueva marca
   */
  const handleAddMarca = () => {
    navigate("nueva");
  };

  /**
   * FUNCIÓN: cambiarEstado
   * Propósito: Cambiar el estado de una marca entre Activa/Inactiva
   * @param {number} id - ID de la marca a modificar
   */
  const cambiarEstado = (id) => {
    // Buscar la marca específica por ID
    const marca = marcas.find(m => m.id === id);
    // Determinar el nuevo estado (toggle entre Activa/Inactiva)
    const nuevoEstado = marca.estado === "Activa" ? "Inactiva" : "Activa";
    // Texto descriptivo para la confirmación
    const accion = marca.estado === "Activa" ? "desactivar" : "activar";
    
    // Validación con confirmación del usuario
    if (confirm(`¿Estás seguro de que deseas ${accion} la marca: ${marca.nombre}?`)) {
      // Mapear las marcas para actualizar solo la específica
      const nuevasMarcas = marcas.map(m => 
        m.id === id 
          ? { ...m, estado: nuevoEstado } // Actualizar estado
          : m // Mantener sin cambios
      );
      
      // Actualizar el estado global de marcas
      setMarcas(nuevasMarcas);
      
      // Mostrar notificación de éxito
      setSnackbar({
        open: true,
        message: `Marca ${marca.nombre} ${nuevoEstado.toLowerCase()} correctamente`,
        severity: "success"
      });
    }
    // Si el usuario cancela, no se ejecuta ninguna acción
  };

  /**
   * FUNCIÓN: verDetalles
   * Propósito: Navegar a la vista de detalles de una marca
   * @param {Object} marca - Objeto marca completo
   */
  const verDetalles = (marca) => {
    navigate("detalle", { state: { marca } });
  };

  /**
   * FUNCIÓN: editarMarca
   * Propósito: Navegar a la vista de edición de una marca con validación
   * @param {Object} marca - Objeto marca a editar
   */
  const editarMarca = (marca) => {
   navigate("editar", { state: { marca } });
   
  };

  /**
   * FUNCIÓN: eliminarMarca
   * Propósito: Eliminar una marca con validación y notificación
   * @param {Object} marca - Objeto marca a eliminar
   */
  const eliminarMarca = (marca) => {
    // Validación crítica antes de eliminar
    if (confirm(`¿Estás seguro de eliminar la marca: ${marca.nombre}?`)) {
      // Filtrar el array removiendo la marca específica
      const nuevasMarcas = marcas.filter(m => m.id !== marca.id);
      setMarcas(nuevasMarcas);
      
      // Notificación de eliminación exitosa
      setSnackbar({
        open: true,
        message: `Marca ${marca.nombre} eliminada correctamente`,
        severity: "success"
      });
    }
  };

  /**
   * FUNCIÓN: handleCloseSnackbar
   * Propósito: Cerrar el snackbar de notificaciones
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * FILTRADO DE MARCAS - Búsqueda en tiempo real
   * Filtra las marcas basándose en el texto de búsqueda
   * Busca tanto en nombre como en descripción (case insensitive)
   */
  const marcasFiltradas = marcas.filter(marca =>
    marca.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    marca.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    /**
     * LAYOUT CRUD - Componente base para todas las vistas CRUD
     * Proporciona estructura consistente: título, descripción y botón de acción
     */
    <CrudLayout
      title="Marcas de Productos"
      description="Administra las marcas de productos para organizar tu inventario."
      onAddClick={handleAddMarca}
      addButtonText="Nueva Marca"
      addButtonIcon={<Add />}
    >
      {/* Contenedor principal con estilos específicos */}
      <Box className="marcas-container">
        
        {/* COMPONENTE SNACKBAR - Notificaciones del sistema */}
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

        {/* BARRA DE BÚSQUEDA - Filtrado en tiempo real */}
        <Box className="search-container">
          <TextField
            placeholder="Buscar marcas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            variant="outlined"
            className="search-input"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{
              width: '100%',
              maxWidth: '400px'
            }}
          />
        </Box>
        

        {/* TABLA DE MARCAS - Visualización principal de datos */}
        <TableContainer component={Paper} elevation={2}>
          <Table>
            {/* ENCABEZADO DE TABLA - Títulos de columnas */}
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Descripción
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Estado
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            {/* CUERPO DE TABLA - Datos de las marcas */}
            <TableBody>
              {marcasFiltradas.map((marca) => (
                <TableRow 
                  key={marca.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'action.hover' 
                    } 
                  }}
                >
                  {/* COLUMNA NOMBRE */}
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {marca.nombre}
                    </Typography>
                  </TableCell>

                  {/* COLUMNA DESCRIPCIÓN */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {marca.descripcion}
                    </Typography>
                  </TableCell>

                  {/* COLUMNA ESTADO - Chip interactivo */}
                  <TableCell>
                    {/* En la tabla, actualiza el Chip para usar las clases CSS: */}
<Chip
  label={marca.estado === "Activa" ? "✅ Activa" : " Inactiva"}
  className={marca.estado === "Activa" ? "estado-activa" : "estado-inactiva"}
  onClick={() => cambiarEstado(marca.id)}
  clickable
/>
                  </TableCell>

                  {/* COLUMNA ACCIONES - Botones de operaciones */}
                  <TableCell>
                    <Box className="actions-container">
                      {/* Botón Ver Detalles */}
                      <button 
                        className="btn-detalles"
                        onClick={() => verDetalles(marca)}
                      >
                        Ver Detalles
                      </button>
                      
                      {/* Botón Editar */}
                      <button 
                        className="btn-editar"
                        onClick={() => editarMarca(marca)}
                      >
                        Editar
                      </button>
                      
                      {/* Botón Eliminar */}
                      <button 
                        className="btn-eliminar"
                        onClick={() => eliminarMarca(marca)}
                      >
                        Eliminar
                      </button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* MENSAJE DE ESTADO VACÍO - Cuando no hay resultados */}
        {marcasFiltradas.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}
          >
            <Typography variant="h6">
              {busqueda ? 'No se encontraron marcas' : 'No hay marcas registradas'}
            </Typography>
          </Box>
        )}
      </Box>
    </CrudLayout>
  );
}