import { useState, useEffect } from "react";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { useEmpleados } from "../hooks/useEmpleados";
import EmpleadoForm from "../components/EmpleadoForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Empleados() {
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
    recargar,
  } = useEmpleados();

  // Estado para modales de formulario
  const [modalForm, setModalForm] = useState({
    open: false,
    mode: "create", // create, edit, view
    title: "",
    initialData: null,
  });

  // Estado para notificaciones
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success"
  });

  // Función para mostrar notificaciones
  const showNotification = (message, type = "success") => {
    setNotification({
      isVisible: true,
      message,
      type
    });
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      isVisible: false
    });
  };

  // Auto-cerrar notificación después de 5 segundos
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        handleCloseNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  // ============================
  // Handlers de modales de formulario
  // ============================
  const handleOpenCreate = () => {
    setModalForm({
      open: true,
      mode: "create",
      title: "Registrar Nuevo Empleado",
      initialData: null
    });
  };

  const handleOpenEdit = (item) => {
    setModalForm({
      open: true,
      mode: "edit",
      title: `Editar Empleado: ${item.nombre}`,
      initialData: item
    });
  };

  const handleOpenView = (item) => {
    setModalForm({
      open: true,
      mode: "view",
      title: `Detalle del Empleado: ${item.nombre}`,
      initialData: item
    });
  };

  const handleCloseForm = () => {
    setModalForm({
      open: false,
      mode: "create",
      title: "",
      initialData: null
    });
  };

  // ============================
  // Handler de submit del formulario
  // ============================
  const handleFormSubmit = async (data) => {
    // Recargar la lista después de crear/editar
    await recargar();
    handleCloseForm();
  };

  // ============================
  // Eliminar empleado
  // ============================
  const confirmDelete = async () => {
    const result = await eliminarEmpleado(modalDelete.id);
    if (result.success) {
      showNotification(`Empleado "${modalDelete.nombre}" eliminado exitosamente`, "success");
      closeDeleteModal();
    } else {
      showNotification(result.error || "Error al eliminar el empleado", "error");
    }
  };

  // ============================
  // Cambiar estado
  // ============================
  const handleChangeStatus = async (row, nuevoEstado) => {
    // Determinar el nuevo estado si no se especifica
    const estadoFinal = nuevoEstado !== undefined 
      ? nuevoEstado 
      : (row.estado === "activo" ? "inactivo" : "activo");
    
    const result = await cambiarEstado(row.id, estadoFinal);
    
    if (result.success) {
      const mensaje = estadoFinal === "activo" 
        ? `Empleado "${row.nombre}" activado exitosamente`
        : `Empleado "${row.nombre}" desactivado exitosamente`;
      showNotification(mensaje, "success");
    } else {
      showNotification(result.error || "Error al cambiar el estado", "error");
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
  // Acciones de la tabla
  // ============================
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => handleChangeStatus(item, undefined),
    },
    {
      label: "Ver detalles",
      type: "view",
      onClick: (item) => handleOpenView(item),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => handleOpenEdit(item),
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
        onAddClick={handleOpenCreate}
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

      {/* MODAL FORMULARIO (Crear/Editar/Ver) */}
      <Modal
        open={modalForm.open}
        type="info"
        title={modalForm.title}
        confirmText={modalForm.mode === "view" ? "Cerrar" : "Guardar"}
        cancelText="Cancelar"
        showCancel={modalForm.mode !== "view"}
        onConfirm={() => {
          // Disparar submit del formulario
          const formElement = document.getElementById("empleado-form");
          if (formElement) {
            formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        }}
        onCancel={handleCloseForm}
      >
        <EmpleadoForm
          id="empleado-form"
          mode={modalForm.mode}
          initialData={modalForm.initialData}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          embedded={true}
        />
      </Modal>

      {/* NOTIFICACIONES */}
      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}