import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllAgenda,
  deleteAgenda,
  updateEstadoAgenda,
} from "../../../../lib/data/agendaData";

export default function Agenda() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    cliente: "",
  });

  // Cargar datos
  useEffect(() => {
    const agendaData = getAllAgenda();
    setCitas(agendaData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, cliente) => {
    setModalDelete({
      open: true,
      id,
      cliente,
    });
  };

  const confirmDelete = () => {
    const updated = deleteAgenda(modalDelete.id);
    setCitas([...updated]);
    setModalDelete({ open: false, id: null, cliente: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoAgenda(id);
    setCitas([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredCitas = citas.filter((cita) => {
    const matchesSearch = 
      cita.cliente.toLowerCase().includes(search.toLowerCase()) ||
      cita.servicio.toLowerCase().includes(search.toLowerCase()) ||
      cita.empleado.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterEstado || cita.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA AGENDA
  const searchFilters = [
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "cliente", header: "Cliente" },
    { field: "servicio", header: "Servicio" },
    { field: "empleado", header: "Empleado" },
    { field: "fecha", header: "Fecha" },
    { field: "hora", header: "Hora" },
    { field: "duracion", header: "Duración (min)" },
    { field: "metodo_pago", header: "Método Pago" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "pendiente" ? "pendiente" : item.estado === "completada" ? "completada" : "cancelada"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "pendiente" ? "🟡 Pendiente" : item.estado === "completada" ? "✅ Completada" : "❌ Cancelada"}
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
      onClick: (item) => handleDelete(item.id, item.cliente),
    },
  ];

  // Función para manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterEstado(value);
  };

  return (
    <CrudLayout
      title="📅 Agenda"
      description="Gestiona las citas de tus clientes."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por cliente, servicio, empleado..."
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
        data={filteredCitas} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron citas para los filtros aplicados' : 
            'No hay citas registradas'
        }
      />

      {/* Botón para primera cita */}
      {filteredCitas.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primera Cita
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Cita?"
        message={`Esta acción eliminará la cita de "${modalDelete.cliente}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, cliente: "" })}
      />
    </CrudLayout>
  );
}