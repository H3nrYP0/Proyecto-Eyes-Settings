import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import UnifiedCrudTable from "@shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { useHorarios } from "../hooks/useHorarios";
import { useHorarioForm } from "../hooks/useHorarioForm";
import HorarioForm from "../components/HorarioForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Horarios() {
  const navigate = useNavigate();
  const [notificacion, setNotificacion] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotificacion({ visible: true, message, type });
    setTimeout(() => setNotificacion(prev => ({ ...prev, visible: false })), 5000);
  };

  const closeNotification = () => setNotificacion(prev => ({ ...prev, visible: false }));

  const {
    horarios,
    empleados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarHorario,
    cambiarEstado,
    recargar,
    modalForm,
    modalDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
  } = useHorarios();

  const {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useHorarioForm({
    mode: modalForm.mode,
    initialData: modalForm.initialData,
    onSubmitSuccess: () => {
      showNotification("Horario guardado correctamente", "success");
      closeFormModal();
      recargar();
    },
    onError: (errorMsg) => {
      showNotification(errorMsg, "error");
    },
  });

  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      closeFormModal();
    } else {
      const formElement = document.getElementById("horario-form");
      if (formElement) formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const confirmDelete = async () => {
    const result = await eliminarHorario(modalDelete.id);
    if (result.success) {
      showNotification("Horario eliminado correctamente", "success");
      closeDeleteModal();
      recargar();
    } else {
      showNotification(result.error, "error");
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    const result = await cambiarEstado(row.id, nuevoEstado);
    if (result.success) {
      showNotification("Estado actualizado correctamente", "success");
    } else {
      showNotification(result.error, "error");
    }
  };

  const columns = [
    { field: "empleado_nombre", header: "Empleado" },
    { field: "dia_nombre", header: "Día" },
    { field: "hora_inicio", header: "Hora Inicio" },
    { field: "hora_final", header: "Hora Final" },
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => handleChangeStatus(item),
    },
    { label: "Ver Detalles", type: "view", onClick: (item) => openViewModal(item) },
    { label: "Editar", type: "edit", onClick: (item) => openEditModal(item) },
    { label: "Eliminar", type: "delete", onClick: (item) => openDeleteModal(item.id, item.descripcion) },
  ];

  if (loading && horarios.length === 0) {
    return (
      <CrudLayout title="Horarios" showSearch>
        <Loading message="Cargando horarios..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, pb: 0 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/servicios/agenda")}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        >
          Volver a Agenda
        </Button>
      </Box>

      <CrudLayout
        title="Horarios"
        onAddClick={openCreateModal}
        showSearch
        searchPlaceholder="Buscar por empleado, día, hora..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        <CrudNotification
          message={notificacion.message}
          type={notificacion.type}
          isVisible={notificacion.visible}
          onClose={closeNotification}
        />

        {error && (
          <CrudNotification
            message={`⚠️ Error al cargar datos: ${error}`}
            type="error"
            isVisible={true}
            onClose={() => {}}
          />
        )}

        <UnifiedCrudTable
          columns={columns}
          data={horarios}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron horarios para los filtros aplicados"
              : "No hay horarios registrados"
          }
        />

        {horarios.length === 0 && !search && !filterEstado && !loading && (
          <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
            <Button variant="contained" onClick={openCreateModal}>Crear Primer Horario</Button>
          </Box>
        )}

        {/* Modal Eliminar */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Horario?"
          message={`Esta acción eliminará el horario de "${modalDelete.descripcion}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />

        {/* Modal Formulario */}
        <Modal
          open={modalForm.open}
          type="info"
          title={modalForm.title}
          confirmText={modalForm.mode === "view" ? "Cerrar" : "Guardar"}
          cancelText="Cancelar"
          showCancel={modalForm.mode !== "view"}
          onConfirm={handleModalConfirm}
          onCancel={closeFormModal}
        >
          <HorarioForm
            id="horario-form"
            mode={modalForm.mode}
            initialData={modalForm.initialData}
            empleados={empleados}
            formData={formData}
            errors={errors}
            submitting={submitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </Modal>
      </CrudLayout>
    </>
  );
}