import { Alert, Box, Button } from "@mui/material";
import CrudLayout from "@shared/components/crud/CrudLayout";
import CrudTable from "@shared/components/crud/CrudTable";
import Modal from "@shared/components/ui/Modal";
import MarcaForm from "../components/MarcaForm";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";
<<<<<<< HEAD
=======
import Loading from "@shared/components/ui/Loading";
>>>>>>> Develop
import { useMarcas } from "../hooks/useMarcas";

export default function Marcas() {
  const {
    marcas,
    loading,
    error,
    search,
    filterEstado,
    notification,
    modalForm,
    modalDelete,
    submitButtonRef,
    isProcessingSave,
    setSearch,
    setFilterEstado,
    handleFormSubmit,
    confirmDelete,
    handleStatusChange,
    handleOpenCreate,
    handleCloseForm,
    handleCancelDelete,
    handleCloseNotification,
    handleModalConfirm,
    searchFilters,
    columns,
    tableActions
  } = useMarcas();

  const isProcessing = modalForm.mode !== "view" && isProcessingSave();

  return (
    <>
      <CrudLayout
        title="Marcas"
        onAddClick={handleOpenCreate}
        showSearch={true}
        searchPlaceholder="Buscar por nombre..."
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
          data={marcas} 
          actions={tableActions}
          loading={loading}
          onChangeStatus={handleStatusChange}
          emptyMessage={
            search || filterEstado ? 
              'No se encontraron marcas para los filtros aplicados' : 
              'No hay marcas registradas'
          }
        />

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Marca?"
          message={
            <>
              Advertencia: al continuar, la marca{" "}
              <Box component="span" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                {modalDelete.nombre}
              </Box>
              {" "}se eliminará permanentemente del sistema.
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
        confirmButtonColor="#1a2540"
        confirmButtonHoverColor="#2d3a6b"
        confirmDisabled={isProcessing}
      >
        <MarcaForm
          id="marca-form"
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
