import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/servicios.css";

// Importaciones de Material-UI
import { Box, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function Servicios() {
  const navigate = useNavigate();
  
  // Estado para los servicios
  const [servicios, setServicios] = useState([
    {
      id: 1,
      nombre: "Examen de la Vista",
      descripcion: "Examen completo de agudeza visual",
      duracion: 30,
      precio: 50000,
      empleado: "Dr. Carlos Méndez",
      estado: "active",
    },
    {
      id: 2,
      nombre: "Adaptación Lentes de Contacto",
      descripcion: "Primera adaptación y enseñanza de uso",
      duracion: 45,
      precio: 80000,
      empleado: "Dra. Ana Rodríguez",
      estado: "active",
    },
    {
      id: 3,
      nombre: "Limpieza y Ajuste de Monturas",
      descripcion: "Mantenimiento y ajuste de armazones",
      duracion: 15,
      precio: 15000,
      empleado: "Técnico Javier López",
      estado: "active",
    },
    {
      id: 4,
      nombre: "Consulta Especializada",
      descripcion: "Evaluación de condiciones oculares específicas",
      duracion: 60,
      precio: 120000,
      empleado: "Dr. Carlos Méndez",
      estado: "inactive",
    }
  ]);

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Navegar a agregar nuevo servicio
  const handleAddServicio = () => {
    navigate("agregar");
  };

  // Navegar a editar servicio
  const handleEdit = (servicioId) => {
    const servicioSeleccionado = servicios.find(servicio => servicio.id === servicioId);
    
    if (servicioSeleccionado) {
      navigate("editar", { 
        state: { 
          servicioData: servicioSeleccionado
        } 
      });
    } else {
      alert("Servicio no encontrado");
    }
  };

  // Navegar a ver detalle del servicio
  const handleViewDetail = (servicioId) => {
    const servicioSeleccionado = servicios.find(servicio => servicio.id === servicioId);
    
    if (servicioSeleccionado) {
      navigate("detalle", { 
        state: { 
          servicioData: servicioSeleccionado
        } 
      });
    } else {
      alert("Servicio no encontrado");
    }
  };

  // Eliminar servicio con validación
  const handleDelete = (servicioId, servicioNombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el servicio "${servicioNombre}"?`)) {
      setServicios(servicios.filter(s => s.id !== servicioId));
      alert(`Servicio "${servicioNombre}" eliminado correctamente`);
    }
  };

 // Cambiar estado del servicio con validación
const handleChangeStatus = (servicioId) => {
  // Buscar el servicio específico por ID
  const servicio = servicios.find(s => s.id === servicioId);
  // Determinar el nuevo estado (toggle entre active/inactive)
  const nuevoEstado = servicio.estado === "active" ? "inactive" : "active";
  // Texto descriptivo para la confirmación
  const accion = servicio.estado === "active" ? "desactivar" : "activar";
  
  // Validación con confirmación del usuario
  if (confirm(`¿Estás seguro de que deseas ${accion} el servicio: ${servicio.nombre}?`)) {
    // Mapear los servicios para actualizar solo el específico
    const nuevosServicios = servicios.map(s => 
      s.id === servicioId 
        ? { ...s, estado: nuevoEstado } // Actualizar estado
        : s // Mantener sin cambios
    );
    
    // Actualizar el estado global de servicios
    setServicios(nuevosServicios);
    
    // Mostrar notificación de éxito
    setSnackbar({
      open: true,
      message: `Servicio "${servicio.nombre}" ${accion === "activar" ? "activado" : "desactivado"} correctamente`,
      severity: "success"
    });
  }
  // Si el usuario cancela, no se ejecuta ninguna acción
};

  // Filtrar servicios basado en el término de búsqueda
  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.empleado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  // Función para obtener la clase CSS según el estado
  const getStatusClass = (status) => {
    const classes = { 
      'active': 'status-active', 
      'inactive': 'status-inactive'
    };
    return classes[status] || 'status-inactive';
  };

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    const texts = { 
      'active': 'Activo', 
      'inactive': 'Inactivo'
    };
    return texts[status] || 'Inactivo';
  };

  return (
    <CrudLayout
      title="🛠️ Servicios"
      description="Administra los servicios optométricos ofrecidos por la óptica."
      onAddClick={handleAddServicio}
    >
      {/* BARRA DE BÚSQUEDA - Filtrado en tiempo real */}
      <Box className="search-container">
        <TextField
          placeholder="Buscar servicios por nombre, descripción o empleado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="search-input"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{
            width: '100%',
            maxWidth: '500px',
            mb: 2
          }}
        />
        
        {/* Contador de resultados */}
        <Box className="search-results">
          <span className="results-count">
            {filteredServicios.length} de {servicios.length} servicios
          </span>
        </Box>
      </Box>

      <div className="table-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Duración (min)</th>
              <th>Precio</th>
              <th>Empleado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicios.length > 0 ? (
              filteredServicios.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.descripcion}</td>
                  <td className="duration">{servicio.duracion}</td>
                  <td className="price">{formatPrice(servicio.precio)}</td>
                  <td>{servicio.empleado}</td>
                  <td>
                    <span 
                      className={getStatusClass(servicio.estado)}
                      onClick={() => handleChangeStatus(servicio.id, servicio.estado, servicio.nombre)}
                      title="Click para cambiar estado"
                    >
                      {getStatusText(servicio.estado)}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetail(servicio.id)}
                    >
                      Ver Detalle
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(servicio.id)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(servicio.id, servicio.nombre)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  <div className="no-results-content">
                    <span className="no-results-icon">🔍</span>
                    <h3>No se encontraron servicios</h3>
                    <p>
                      {searchTerm 
                        ? `No hay resultados para "${searchTerm}"`
                        : "No hay servicios registrados"
                      }
                    </p>
                    {searchTerm && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setSearchTerm("")}
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}