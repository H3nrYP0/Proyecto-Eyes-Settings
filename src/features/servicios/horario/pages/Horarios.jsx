import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import { useHorarios } from "../hooks/useHorarios";
import { useHorarioForm } from "../hooks/useHorarioForm";
import HorarioForm from "../components/HorarioForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Horarios() {
  const navigate = useNavigate();
  
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

  // ============================
  // Configurar formulario
  // ============================
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
      closeFormModal();
      recargar();
    },
    onError: (error) => {
      alert(error);
    },
  });

  // ============================
  // Handlers
  // ============================
  const handleFormSubmit = async () => {
    const result = await handleSubmit();
    if (result.success) {
      closeFormModal();
      recargar();
    }
  };

  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      closeFormModal();
    } else {
      const formElement = document.getElementById("horario-form");
      if (formElement) {
        formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
  };

  const confirmDelete = async () => {
    const result = await eliminarHorario(modalDelete.id);
    if (result.success) {
      closeDeleteModal();
    } else {
      alert(result.error);
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    const result = await cambiarEstado(row.id, nuevoEstado);
    if (!result.success) {
      alert(result.error);
    }
  };

  // ============================
  // Columnas y acciones
  // ============================
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
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => openViewModal(item),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => openEditModal(item),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => openDeleteModal(item.id, item.descripcion),
    },
  ];

  // ============================
  // Loading
  // ============================
  if (loading && horarios.length === 0) {
    return (
      <CrudLayout title="Horarios" showSearch>
        <Loading message="Cargando horarios..." />
      </CrudLayout>
    );
  }

  return (
    <>
      {/* Botón Volver */}
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
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={openCreateModal}
              className="btn-primary"
              style={{ padding: '12px 24px' }}
            >
              Crear Primer Horario
            </button>
          </div>
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
            onSubmit={handleFormSubmit}
            onCancel={closeFormModal}
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