// src/features/compras/pages/producto/pages/Productos.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CrudLayout from "../../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../../shared/components/crud/CrudTable";
import Modal from "../../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../../shared/styles/components/notifications/CrudNotification";
import Loading from "../../../../../shared/components/ui/Loading/Loading";
import { useProductos } from "../hooks/useProductos";
import StockCell from "../components/StockCell";
import { formatCOP } from "../../../../../shared/utils/formatCOP";
import "../styles/Productos.css";

export default function Productos() {
  const navigate = useNavigate();
  
  const {
    productos,
    loading,
    error,
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
    cambiarEstado,
    showEmptyState,
    notification,
    hideNotification,
    modalDelete,
    confirmDelete,
    handleCancelDelete,
    handleDelete
  } = useProductos();

  useEffect(() => {
    const savedNotification = localStorage.getItem('productoNotification');
    if (savedNotification) {
      localStorage.removeItem('productoNotification');
    }
  }, []);

  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "marca", header: "Marca" },
    { field: "categoria", header: "Categoría" },
    { 
      field: "precioVenta", 
      header: "Precio Venta",
      render: (item) => formatCOP(item.precioVenta)
    },
    { 
      field: "stockActual", 
      header: "Stock",
      render: (item) => <StockCell item={item} />
    }
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: cambiarEstado,
    },
    {
      label: "Ver",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => navigate(`editar/${row.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) => handleDelete(row.id, row.nombre),
    },
  ];

  const onCreateClick = () => navigate("crear");

  if (loading && productos.length === 0) {
    return (
      <CrudLayout title="Productos" showSearch={false}>
        <Loading message="Cargando productos..." minHeight="400px" />
      </CrudLayout>
    );
  }

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
            {error}
          </div>
        )}

        <CrudTable
          columns={columns}
          data={productos}
          actions={tableActions}
          loading={loading}
          emptyMessage={
            search || filterEstado || filterMarca || filterCategoria
              ? "No se encontraron productos para los filtros aplicados"
              : "No hay productos registrados"
          }
          onChangeStatus={cambiarEstado}
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
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />
      </CrudLayout>
    </>
  );
}