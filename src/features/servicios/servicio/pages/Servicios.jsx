import { Alert, Box, Button } from '@mui/material';
import CrudLayout from '@shared/components/crud/CrudLayout';
import CrudTable from '@shared/components/crud/CrudTable';
import Modal from '@shared/components/ui/Modal';
import ServicioForm from '../components/ServicioForm';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import Loading from '@shared/components/ui/Loading';
import { useServicios } from '../hooks/useServicios';

const BRAND_COLOR = '#1a2540';
const BRAND_HOVER = '#2d3a6b';

export default function Servicios() {
  const {
    servicios,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    notification,
    modalForm,
    modalDelete,
    submitButtonRef,
    isSaving,
    searchFilters,
    columns,
    tableActions,
    crearServicio,
    editarServicio,
    eliminarServicio,
    cambiarEstado,
    handleOpenCreate,
    handleOpenEdit,      // para abrir edición desde vista
    handleCloseForm,
    handleCancelDelete,
    handleCloseNotification,
    handleModalConfirm,
  } = useServicios();

  const isProcessing = modalForm.mode !== 'view' && isSaving;

  const handleFormSubmit = async (data) => {
    if (modalForm.mode === 'create') {
      await crearServicio(data);
    } else {
      await editarServicio(modalForm.initialData.id, data);
    }
  };

  // Función para cerrar vista y abrir edición
  const handleEditFromView = () => {
    const viewData = modalForm.initialData;
    handleCloseForm();               // cierra modal de vista
    handleOpenEdit(viewData);        // abre modal de edición con los mismos datos
  };

  const handleModalConfirmClick = () => {
    if (modalForm.mode === 'view') {
      handleEditFromView();
    } else {
      // Disparar el submit del formulario
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  if (loading && servicios.length === 0) {
    return (
      <CrudLayout title="Servicios" showSearch searchPlaceholder="Buscar por nombre o descripción...">
        <Loading message="Cargando servicios..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Servicios"
        onAddClick={handleOpenCreate}
        showSearch
        searchPlaceholder="Buscar por nombre o descripción..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={searchFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message || 'No se pudieron cargar los servicios'}
          </Alert>
        )}

        <CrudTable
          columns={columns}
          data={servicios}
          actions={tableActions}
          onChangeStatus={(item, nuevoEstado) => cambiarEstado(item, nuevoEstado)}
          emptyMessage={
            search || filterEstado
              ? 'No se encontraron servicios para los filtros aplicados'
              : 'No hay servicios registrados'
          }
        />
        
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Servicio?"
          message={
            <>
              Esta acción eliminará el servicio{' '}
              <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                {modalDelete.nombre}
              </Box>{' '}
              y no se puede deshacer.
            </>
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={() => eliminarServicio(modalDelete.id, modalDelete.nombre)}
          onCancel={handleCancelDelete}
        />
      </CrudLayout>

      <Modal
        open={modalForm.open}
        type="info"
        title={modalForm.title}
        confirmText={modalForm.mode === 'view' ? 'Editar' : 'Guardar'}
        cancelText={modalForm.mode === 'view' ? 'Cerrar' : 'Cancelar'}
        showCancel={true}
        onConfirm={handleModalConfirmClick}
        onCancel={handleCloseForm}
        confirmButtonColor={BRAND_COLOR}
        confirmButtonHoverColor={BRAND_HOVER}
        confirmDisabled={isProcessing}
        maxWidth="md"
        PaperProps={{ sx: { width: '100%' } }}
      >
        <ServicioForm
          id="servicio-form"
          mode={modalForm.mode}
          initialData={modalForm.initialData}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          embedded
          submitButtonRef={submitButtonRef}
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