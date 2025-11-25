import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/campanasSalud.css";

// Importaciones de Material-UI
import { Box, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

/**
 * Componente principal de Campañas de Salud
 * Maneja la lista y navegación a otras vistas
 */
export default function CampanasSalud() {
  const navigate = useNavigate();
  
  // Estado para las campañas de salud
  const [campanas, setCampanas] = useState([
    {
      id: 1,
      nombre: "Chequeo Visual Gratuito",
      descripcion: "Campaña de exámenes visuales sin costo",
      fechaInicio: "2024-02-01",
      fechaFin: "2024-02-29",
      descuento: "100%",
      estado: "en proceso",
    },
    {
      id: 2,
      nombre: "Descuento en Lentes de Sol",
      descripcion: "Promoción especial en lentes de sol Ray-Ban",
      fechaInicio: "2024-01-15",
      fechaFin: "2024-01-31",
      descuento: "20%",
      estado: "finalizada",
    },
    
  {
    id: 3,
    nombre: "Examen Visual Gratuito",
    descripcion: "Chequeo ocular completo sin costo.",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-31",
    descuento: "100%", // Representa que el examen es gratuito
    estado: "vigente",
  },
  {
    id: 4,
    nombre: "2x1 en Marcos Seleccionados",
    descripcion: "Compra un marco y lleva el segundo gratis de una selección específica.",
    fechaInicio: "2024-04-10",
    fechaFin: "2024-04-20",
    descuento: "50%", // Representa el valor promedio del 2x1
    estado: "proxima",
  },

  ]);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Navega a la vista de agregar nueva campaña
   */
  const handleAddCampana = () => {
    navigate("nuevo");
  };

  /**
   * Navega a la vista de editar campaña
   */
  const handleEdit = (campanaId) => {
    const campana = campanas.find(c => c.id === campanaId);
    if (campana) {
      navigate("editar", { state: { campanaData: campana } });
    }
  };

  /**
   * Navega a la vista de detalle
   */
  const handleViewDetail = (campanaId) => {
    const campana = campanas.find(c => c.id === campanaId);
    if (campana) {
      navigate("detalle", { state: { campanaData: campana } });
    }
  };

  /**
   * Elimina una campaña con confirmación
   */
  const handleDelete = (campanaId, campanaNombre) => {
    if (window.confirm(`¿Eliminar la campaña "${campanaNombre}"?`)) {
      setCampanas(campanas.filter(c => c.id !== campanaId));
    }
  };

  /**
   * Cambia el estado de una campaña
   */
  const handleChangeStatus = (campanaId, estadoActual, nombre) => {
    const nuevoEstado = estadoActual === "inactiva" ? "en proceso" : 
                       estadoActual === "en proceso" ? "finalizada" : "inactiva";
    
    if (window.confirm(`¿Cambiar estado de "${nombre}" a ${nuevoEstado}?`)) {
      setCampanas(campanas.map(c => 
        c.id === campanaId ? { ...c, estado: nuevoEstado } : c
      ));
    }
  };

  /**
   * Obtiene la clase CSS para el estado
   */
  const getStatusClass = (estado) => {
    const clases = {
      'en proceso': 'status-active',
      'inactiva': 'status-inactive', 
      'finalizada': 'status-completed'
    };
    return clases[estado] || 'status-inactive';
  };

  /**
   * Obtiene texto legible para el estado
   */
  const getStatusText = (estado) => {
    const textos = {
      'en proceso': 'En Proceso',
      'inactiva': 'Inactiva',
      'finalizada': 'Finalizada'
    };
    return textos[estado] || 'Inactiva';
  };

  // Filtrar campañas basado en búsqueda
  const campanasFiltradas = campanas.filter(campana =>
    campana.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campana.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CrudLayout
      title="🏥 Campañas de Salud"
      description="Gestiona las campañas de salud visual y promociones especiales."
      onAddClick={handleAddCampana}
    >
      {/* Barra de búsqueda */}
      <Box className="search-container">
        <TextField
          placeholder="Buscar campañas por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ maxWidth: '500px', mb: 2 }}
        />
        
        <Box className="search-results">
          <span className="results-count">
            {campanasFiltradas.length} de {campanas.length} campañas
          </span>
        </Box>
      </Box>

      {/* Tabla de campañas */}
      <div className="table-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Descuento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {campanasFiltradas.length > 0 ? (
              campanasFiltradas.map((campana) => (
                <tr key={campana.id}>
                  <td>{campana.nombre}</td>
                  <td>{campana.descripcion}</td>
                  <td className="date">{campana.fechaInicio}</td>
                  <td className="date">{campana.fechaFin}</td>
                  <td className="discount">{campana.descuento}</td>
                  <td>
                    <span 
                      className={`${getStatusClass(campana.estado)} clickable`}
                      onClick={() => handleChangeStatus(campana.id, campana.estado, campana.nombre)}
                      title="Click para cambiar estado"
                    >
                      {getStatusText(campana.estado)}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetail(campana.id)}
                    >
                      Ver Detalle
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(campana.id)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(campana.id, campana.nombre)}
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
                    <h3>No se encontraron campañas</h3>
                    <p>
                      {searchTerm 
                        ? `No hay resultados para "${searchTerm}"`
                        : "No hay campañas registradas"
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