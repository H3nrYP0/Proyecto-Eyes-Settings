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
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const campanasData = getAllCampanasSalud();
    setCampanas(campanasData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
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
    setCampanas([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredCampanas = campanas.filter((campana) => {
    const matchesSearch = 
      campana.nombre.toLowerCase().includes(search.toLowerCase()) ||
      campana.descripcion.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterEstado || campana.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA CAMPAÑAS
  const searchFilters = [
    { value: 'activa', label: 'Activas' },
    { value: 'proxima', label: 'Próximas' },
    { value: 'finalizada', label: 'Finalizadas' },
    { value: 'inactiva', label: 'Inactivas' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { 
      field: "descripcion", 
      header: "Descripción",
      render: (item) => (
        item.descripcion ? (
          <span title={item.descripcion}>
            {item.descripcion.length > 50 
              ? item.descripcion.substring(0, 50) + '...' 
              : item.descripcion
            }
          </span>
        ) : '-'
      )
    },
    { field: "fechaInicio", header: "Fecha Inicio" },
    { field: "fechaFin", header: "Fecha Fin" },
    { 
      field: "descuento", 
      header: "Descuento",
      render: (item) => `${item.descuento}%`
    },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activa" ? "activa" : item.estado === "proxima" ? "proxima" : item.estado === "finalizada" ? "finalizada" : "inactiva"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activa" ? "🟢 Activa" : 
           item.estado === "proxima" ? "🟡 Próxima" : 
           item.estado === "finalizada" ? "🔵 Finalizada" : "⚫ Inactiva"}
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
      searchPlaceholder="Buscar por nombre, descripción..."
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