import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllHorarios,
  deleteHorario,
  updateEstadoHorario,
} from "../../../../lib/data/horariosData";

export default function Horarios() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    empleado: "",
  });

  // Cargar datos
  useEffect(() => {
    const horariosData = getAllHorarios();
    setHorarios(horariosData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, empleado) => {
    setModalDelete({
      open: true,
      id,
      empleado,
    });
  };

  const confirmDelete = () => {
    const updated = deleteHorario(modalDelete.id);
    setHorarios([...updated]);
    setModalDelete({ open: false, id: null, empleado: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoHorario(id);
    setHorarios([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredHorarios = horarios.filter((horario) => {
    const matchesSearch = 
      horario.empleado.toLowerCase().includes(search.toLowerCase()) ||
      horario.dia.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterEstado || horario.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA HORARIOS
  const searchFilters = [
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "empleado", header: "Empleado" },
    { field: "dia", header: "Día" },
    { field: "horaInicio", header: "Hora Inicio" },
    { field: "horaFinal", header: "Hora Final" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activo" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "✅ Activo" : "⛔ Inactivo"}
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
      onClick: (item) => handleDelete(item.id, item.empleado),
    },
  ];

  // Función para manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterEstado(value);
  };

  return (
    <CrudLayout
      title="⏰ Horarios"
      description="Gestiona los horarios de trabajo del personal de la óptica."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por empleado, día..."
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
        data={filteredHorarios} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron horarios para los filtros aplicados' : 
            'No hay horarios registrados'
        }
      />

      {/* Botón para primer horario */}
      {filteredHorarios.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primer Horario
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Horario?"
        message={`Esta acción eliminará el horario de "${modalDelete.empleado}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, empleado: "" })}
      />
    </CrudLayout>
  );
}