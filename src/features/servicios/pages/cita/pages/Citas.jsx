import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../../shared/components/crud/CrudTable";
import Modal from "../../../../../shared/components/ui/Modal";
import Loading from "../../../../../shared/components/ui/Loading";
import { useCitas } from "../hooks/useCitas";
import "../../../../../shared/styles/components/crud-table.css";
import "../../../../../shared/styles/components/modal.css";

export default function Citas() {
  const navigate = useNavigate();
  const {
    citas,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarCita,
    cambiarEstado,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  } = useCitas();

  // ============================
  // Eliminar
  // ============================
  const confirmDelete = async () => {
    const result = await eliminarCita(modalDelete.id);
    if (result.success) {
      closeDeleteModal();
    } else {
      alert(result.error);
    }
  };

  // ============================
  // Cambiar estado
  // ============================
  const handleChangeStatus = async (row, nuevoEstado) => {
    const result = await cambiarEstado(row.id, nuevoEstado);
    if (!result.success) {
      alert(result.error);
    }
  };

  // ============================
  // Columnas
  // ============================
  const columns = [
    { field: "cliente_nombre", header: "Cliente" },
    { field: "servicio_nombre", header: "Servicio" },
    { field: "fecha_formateada", header: "Fecha" },
    { field: "hora_formateada", header: "Hora" },
  ];

  // ============================
  // Acciones
  // ============================
  const tableActions = [
    {
      label: "Ver detalles",
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
      onClick: (item) => openDeleteModal(item.id, `${item.cliente_nombre} - ${item.servicio_nombre}`),
    },
  ];

  // ============================
  // Loading
  // ============================
  if (loading && citas.length === 0) {
    return (
      <CrudLayout title="Citas" showSearch>
        <Loading message="Cargando citas..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Citas"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar por cliente, servicio, empleado..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <CrudTable
          columns={columns}
          data={citas}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron citas para los filtros aplicados"
              : "No hay citas registradas"
          }
        />
      </CrudLayout>

      {/* Modal Eliminar */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Cita?"
        message={`Esta acción eliminará la cita "${modalDelete.descripcion}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </>
  );
}