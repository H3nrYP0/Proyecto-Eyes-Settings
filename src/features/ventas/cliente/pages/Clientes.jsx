import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { useClientes } from "../hooks/useClientes";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Clientes() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  const showNotification = (message, type = "success") => {
    setNotification({ isVisible: true, message, type });
  };

  const {
    clientes,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    filterGenero,
    setFilterGenero,
    estadoFilters,
    generoFilters,
    columns,
    tableActions,
    modalDelete,
    modalEstado,
    confirmDelete,
    closeDeleteModal,
    confirmChangeStatus,
    closeEstadoModal,
  } = useClientes({ onSuccess: showNotification });

  const actionsWithNavigate = tableActions.map(action => ({
    ...action,
    onClick: (row) => {
      if (action.type === "view") navigate(`detalle/${row.id}`);
      else if (action.type === "edit") navigate(`editar/${row.id}`);
      else action.onClick(row);
    }
  }));

  if (loading && clientes.length === 0) {
    return (
      <CrudLayout title="Clientes" showSearch={false}>
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          Cargando clientes...
        </div>
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Clientes"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar por nombre, documento, ciudad..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchFiltersRol={generoFilters}
        filterRol={filterGenero}
        onFilterChangeRol={setFilterGenero}
      >
        {error && <div className="crud-error">⚠️ {error}</div>}

        <CrudTable
          columns={columns}
          data={clientes}
          actions={actionsWithNavigate}
          emptyMessage={
            search || filterEstado || filterGenero
              ? "No se encontraron clientes para los filtros aplicados"
              : "No hay clientes registrados"
          }
        />

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Cliente?"
          message={`Esta acción eliminará al cliente "${modalDelete.nombre}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />

        <Modal
          open={modalEstado.open}
          type="info"
          title="¿Cambiar estado?"
          message={`El cliente "${modalEstado.nombre}" cambiará a estado "${modalEstado.nuevoEstado}".`}
          confirmText="Confirmar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmChangeStatus}
          onCancel={closeEstadoModal}
        />
      </CrudLayout>

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}