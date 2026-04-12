import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import UnifiedCrudTable from "@shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { useNovedades } from "../hooks/useNovedades";
import { useNovedadForm } from "../hooks/useNovedadForm";
import NovedadForm from "../components/NovedadForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Novedades() {
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
    novedades,
    empleados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarNovedad,
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
  } = useNovedades();

  const {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
  } = useNovedadForm({
    mode: modalForm.mode,
    initialData: modalForm.initialData,
    onSubmitSuccess: () => {
      showNotification("Novedad guardada correctamente", "success");
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
      const formElement = document.getElementById("novedad-form");
      if (formElement) formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const confirmDelete = async () => {
    const result = await eliminarNovedad(modalDelete.id);
    if (result.success) {
      showNotification("Novedad eliminada correctamente", "success");
      closeDeleteModal();
      recargar();
    } else {
      showNotification(result.error, "error");
    }
  };

  // Columnas esenciales
  const columns = [
    { field: "empleado_nombre", header: "Empleado" },
    { field: "tipo_label", header: "Tipo" },
    { field: "fechas_display", header: "Fechas" },
    { field: "motivo", header: "Motivo" },
  ];

  const tableActions = [
    { label: "Ver Detalles", type: "view", onClick: (item) => openViewModal(item) },
    { label: "Editar", type: "edit", onClick: (item) => openEditModal(item) },
    { label: "Eliminar", type: "delete", onClick: (item) => openDeleteModal(item.id, item.descripcion) },
  ];

  if (loading && novedades.length === 0) {
    return (
      <CrudLayout title="Novedades" showSearch>
        <Loading message="Cargando novedades..." />
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
        title="Novedades"
        onAddClick={openCreateModal}
        showSearch
        searchPlaceholder="Buscar por empleado, tipo, motivo..."
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
          data={novedades}
          actions={tableActions}
          onChangeStatus={cambiarEstado} 
          emptyMessage={
            search || filterEstado
              ? "No se encontraron novedades para los filtros aplicados"
              : "No hay novedades registradas"
          }
        />

        {novedades.length === 0 && !search && !filterEstado && !loading && (
          <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
            <Button variant="contained" onClick={openCreateModal}>Crear Primera Novedad</Button>
          </Box>
        )}

        {/* Modal Eliminar */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Novedad?"
          message={`Esta acción eliminará la novedad "${modalDelete.descripcion}" y no se puede deshacer.`}
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
          <NovedadForm
            id="novedad-form"
            mode={modalForm.mode}
            empleados={empleados}
            formData={formData}
            errors={errors}
            submitting={submitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitError={notificacion.type === "error" && notificacion.visible ? notificacion.message : null}
          />
        </Modal>
      </CrudLayout>
    </>
  );
}