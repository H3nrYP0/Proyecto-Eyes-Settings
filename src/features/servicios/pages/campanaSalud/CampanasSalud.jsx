import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllCampanasSalud,
  deleteCampanaSalud,
  updateEstadoCampanaSalud,
} from "../../../../lib/data/campanasSaludData";

export default function CampanasSalud() {
  const navigate = useNavigate();

  const [campanas, setCampanas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "", // Cambiado a 'nombre' que es lo que se muestra
  });

  // Cargar datos
  useEffect(() => {
    const campanasData = getAllCampanasSalud();
    console.log("Campañas cargadas:", campanasData); // Para debug
    setCampanas(campanasData || []);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre, // Usamos 'nombre' de la campaña
    });
  };

  const confirmDelete = () => {
    const updated = deleteCampanaSalud(modalDelete.id);
    setCampanas([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoCampanaSalud(id);
    if (updated) {
      setCampanas([...updated]);
    }
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredCampanas = campanas.filter((campana) => {
    const matchesSearch = 
      (campana.nombre && campana.nombre.toLowerCase().includes(search.toLowerCase())) ||
      (campana.empresa && campana.empresa.toLowerCase().includes(search.toLowerCase())) ||
      (campana.observaciones && campana.observaciones.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = !filterEstado || campana.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA CAMPAÑAS (ajustados a tus estados)
  const searchFilters = [
    { value: 'PLANIFICADA', label: 'Planificadas' },
    { value: 'EN_CURSO', label: 'En Curso' },
    { value: 'COMPLETADA', label: 'Completadas' },
    { value: 'CANCELADA', label: 'Canceladas' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { 
      field: "nombre", 
      header: "Nombre de la Campaña",
      render: (item) => item.nombre || "Sin nombre"
    },
    { 
      field: "empresa", 
      header: "Empresa",
      render: (item) => item.empresa || "Sin empresa"
    },
    { 
      field: "fecha", 
      header: "Fecha",
      render: (item) => item.fecha || "Sin fecha"
    },
    {
      field: "hora",
      header: "Hora inicio",
      render: (item) => item.hora || "Sin hora"
    },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activa" ? "activa" : item.estado === "proxima" ? "proxima" : item.estado === "finalizada" ? "finalizada" : "inactiva"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activa" ? "Activa" : 
           item.estado === "proxima" ? "Próxima" : 
           item.estado === "finalizada" ? "Finalizada" : "Inactiva"}
        </button>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  // Función para manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterEstado(value);
  };

  return (
    <CrudLayout
      title="Campañas de Salud"
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, empresa u observaciones..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={handleFilterChange}
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredCampanas} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron campañas para los filtros aplicados' : 
            'No hay campañas registradas'
        }
      />

      {/* Botón para primera campaña */}
      {filteredCampanas.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primera Campaña
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Campaña?"
        message={`Esta acción eliminará la campaña "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}