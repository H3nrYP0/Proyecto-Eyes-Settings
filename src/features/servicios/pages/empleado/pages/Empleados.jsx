import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../../shared/components/crud/CrudTable";
import Modal from "../../../../../shared/components/ui/Modal";
import Loading from "../../../../../shared/components/ui/Loading";
import { useEmpleados } from "../hooks/useEmpleados";
import "../../../../../shared/styles/components/crud-table.css";
import "../../../../../shared/styles/components/modal.css";

export default function Empleados() {
  const navigate = useNavigate();
  const {
    empleados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    eliminarEmpleado,
    cambiarEstado,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  } = useEmpleados();

  // ============================
  // Eliminar
  // ============================
  const confirmDelete = async () => {
    const result = await eliminarEmpleado(modalDelete.id);
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
  // Filtros
  // ============================
  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  // ============================
  // Columnas
  // ============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "cargo", header: "Cargo" },
    { field: "correo", header: "Correo Electrónico" },
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
      onClick: (item) => openDeleteModal(item.id, item.nombre),
    },
  ];

  // ============================
  // Loading
  // ============================
  if (loading && empleados.length === 0) {
    return (
      <CrudLayout title="Empleados" showSearch>
        <Loading message="Cargando empleados..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Empleados"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar por nombre, documento, cargo, email..."
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
          data={empleados}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron empleados para los filtros aplicados"
              : "No hay empleados registrados"
          }
        />
      </CrudLayout>

      {/* MODAL ELIMINAR */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Empleado?"
        message={`Esta acción eliminará al empleado "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </>
  );
}