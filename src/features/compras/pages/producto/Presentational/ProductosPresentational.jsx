// src/features/compras/pages/productos/components/ProductosPresentational.jsx
import { Box } from "@mui/material";
import CrudLayout from "../../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../../shared/components/crud/CrudTable";
import Modal from "../../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../../shared/styles/components/notifications/CrudNotification";
import "../Products.css";

export default function ProductosPresentational({
  search,
  setSearch,
  filterEstado,
  setFilterEstado,
  filterMarca,
  setFilterMarca,
  filterCategoria,
  setFilterCategoria,
  marcaFilters,
  categoriaFilters,
  estadoFilters,
  error,
  columns,
  data,
  actions,
  loading,
  emptyMessage,
  onChangeStatus,
  showEmptyState,
  onCreateClick,
  notification,
  hideNotification,
  modalDelete,
  onConfirmDelete,
  onCancelDelete
}) {
  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <CrudLayout
        title="Productos"
        onAddClick={onCreateClick}
        showSearch
        searchPlaceholder="Buscar por nombre..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        <div className="unified-search-container">
          <select
            value={filterMarca}
            onChange={(e) => setFilterMarca(e.target.value)}
            className="unified-filter-select"
          >
            {marcaFilters.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="unified-filter-select"
          >
            {categoriaFilters.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        <CrudTable
          columns={columns}
          data={data}
          actions={actions}
          loading={loading}
          emptyMessage={emptyMessage}
          onChangeStatus={onChangeStatus}
        />

        {showEmptyState && (
          <div className="empty-state">
            <button 
              onClick={onCreateClick}
              className="btn-primary create-button"
            >
              Crear Primer Producto
            </button>
          </div>
        )}

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Producto?"
          message={`Advertencia: al continuar, el producto "${modalDelete.nombre}" se eliminará permanentemente del sistema.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      </CrudLayout>
    </>
  );
}