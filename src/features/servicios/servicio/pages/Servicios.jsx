// src/features/servicios/pages/servicio/pages/Servicios.jsx
import { useRef } from "react";
import { Alert, Box, Button } from "@mui/material";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import ServicioForm from "../components/ServicioForm"; 
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import Loading from "../../../../shared/components/ui/Loading";
import { useServicios } from "../hooks/useServicios";

export default function Servicios() {
  const submitButtonRef = useRef(null);

  const {
    servicios,
    loading,
    error,
    search,
    filterEstado,
    notification,
    modalForm,
    modalDelete,
    setSearch,
    setFilterEstado,
    handleFormSubmit,
    confirmDelete,
    handleOpenCreate,
    handleCloseForm,
    handleCancelDelete,
    handleStatusChange,
    handleCloseNotification,
    searchFilters,
    columns,
    tableActions,
    handleModalConfirm
  } = useServicios();

  if (loading && servicios.length === 0) {
    return (
      <CrudLayout
        title="Servicios"
        showSearch={true}
        searchPlaceholder="Buscar por nombre o descripción..."
        searchPosition="left"
      >
        <Loading message="Cargando servicios..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Servicios"
        onAddClick={handleOpenCreate}
        showSearch={true}
        searchPlaceholder="Buscar por nombre o descripción..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={searchFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <CrudTable
          columns={columns}
          data={servicios}
          actions={tableActions}
          onChangeStatus={handleStatusChange}
          emptyMessage={
            search || filterEstado ?
              'No se encontraron servicios para los filtros aplicados' :
              'No hay servicios registrados'
          }
        />

        {servicios.length === 0 && !search && !filterEstado && !loading && (
          <Box sx={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <Button
              onClick={handleOpenCreate}
              variant="contained"
              color="primary"
              sx={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}
            >
              Crear Primer Servicio
            </Button>
          </Box>
        )}

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Servicio?"
          message={
            <>
              Esta acción eliminará el servicio{" "}
              <Box component="span" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                {modalDelete.nombre}
              </Box>
              {" "}y no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel={true}
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />
      </CrudLayout>

      <Modal
        open={modalForm.open}
        type="info"
        title={modalForm.title}
        confirmText={modalForm.mode === "view" ? "Cerrar" : "Guardar"}
        cancelText="Cancelar"
        showCancel={modalForm.mode !== "view"}
        onConfirm={handleModalConfirm}
        onCancel={handleCloseForm}
      >
        <ServicioForm
          id="servicio-form"
          mode={modalForm.mode}
          initialData={modalForm.initialData}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          embedded={true}
          buttonRef={submitButtonRef}
        />
      </Modal>

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}