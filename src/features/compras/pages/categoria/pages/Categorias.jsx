import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../../shared/components/crud/CrudTable";
import Modal from "../../../../../shared/components/ui/Modal";
import Loading from "../../../../../shared/components/ui/Loading";
import { useCategorias } from "../hooks/useCategorias";
import { useCategoriaForm } from "../hooks/useCategoriaForm";
import CategoriaForm from "../components/CategoriaForm";
import "../../../../../shared/styles/components/crud-table.css";
import "../../../../../shared/styles/components/modal.css";

export default function Categorias() {
  const navigate = useNavigate();
  const submitButtonRef = useRef(null);
  
  const {
    categorias,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    modalForm,
    modalDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    eliminarCategoria,
    cambiarEstado,
    loadCategorias,
  } = useCategorias();

  // ============================
  // Configurar formulario según modo
  // ============================
  const {
    formData,
    errors,
    nombreExists,
    submitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCategoriaForm({
    mode: modalForm.mode,
    initialData: modalForm.initialData,
    onSubmitSuccess: () => {
      closeFormModal();
      loadCategorias();
    },
    onError: (error) => {
      alert(error);
    },
  });

  // ============================
  // Handlers de modales
  // ============================
  const handleFormSubmit = async (data) => {
    const result = await handleSubmit();
    if (result.success) {
      closeFormModal();
      loadCategorias();
    }
  };

  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      closeFormModal();
    } else {
      const formElement = document.getElementById("categoria-form");
      if (formElement) {
        formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
  };

  const handleDelete = (id, nombre) => {
    openDeleteModal(id, nombre);
  };

  const confirmDelete = async () => {
    const result = await eliminarCategoria(modalDelete.id, modalDelete.nombre);
    if (result.success) {
      closeDeleteModal();
    } else {
      alert(result.error);
    }
  };

  const handleStatusChange = async (row) => {
    const result = await cambiarEstado(row.id, row.estado);
    if (!result.success) {
      alert(result.error);
    }
  };

  // ============================
  // Filtros y configuración
  // ============================
  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'activa', label: 'Activas' },
    { value: 'inactiva', label: 'Inactivas' }
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => handleStatusChange(item),
    },
    { 
      label: "Ver Detalles", 
      type: "view", 
      onClick: (item) => openViewModal(item) 
    },
    { 
      label: "Editar", 
      type: "edit", 
      onClick: (item) => openEditModal(item) 
    },
    { 
      label: "Eliminar", 
      type: "delete", 
      onClick: (item) => handleDelete(item.id, item.nombre) 
    },
  ];

  // ============================
  // Renderizado
  // ============================
  if (loading && categorias.length === 0) {
    return (
      <CrudLayout
        title="Categorías de Productos"
        showSearch={true}
        searchPlaceholder="Buscar por nombre, descripción..."
        searchPosition="left"
      >
        <Loading message="Cargando categorías..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Categorías de Productos"
        onAddClick={openCreateModal}
        showSearch={true}
        searchPlaceholder="Buscar por nombre, descripción..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={searchFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        {error && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            borderRadius: '4px', 
            marginBottom: '16px' 
          }}>
            ⚠️ {error}
          </div>
        )}

        <CrudTable 
          columns={columns} 
          data={categorias} 
          actions={tableActions}
          onChangeStatus={handleStatusChange}
          emptyMessage={
            search || filterEstado ? 
              'No se encontraron categorías para los filtros aplicados' : 
              'No hay categorías registradas'
          }
        />

        {categorias.length === 0 && !search && !filterEstado && !loading && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <button 
              onClick={openCreateModal}
              className="btn-primary"
              style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
            >
              Crear Primera Categoría
            </button>
          </div>
        )}

        {/* Modal de Eliminación */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Categoría?"
          message={`Esta acción eliminará la categoría "${modalDelete.nombre}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel={true}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      </CrudLayout>

      {/* Modal de Formulario */}
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
        <CategoriaForm
          id="categoria-form"
          mode={modalForm.mode}
          initialData={modalForm.initialData}
          onSubmit={handleFormSubmit}
          onCancel={closeFormModal}
          embedded={true}
          buttonRef={submitButtonRef}
          formData={formData}
          errors={errors}
          nombreExists={nombreExists}
          submitting={submitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}