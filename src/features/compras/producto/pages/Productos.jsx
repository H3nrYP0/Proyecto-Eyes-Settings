// src/features/compras/pages/producto/pages/Productos.jsx
import { useEffect } from "react";
import { Pagination, Typography, Box, Button, Stack } from "@mui/material"; // ← Typography agregado
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import CrudLayout from "@shared/components/crud/CrudLayout";
import CrudTable from "@shared/components/crud/CrudTable";
import Modal from "@shared/components/ui/Modal";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";
import Loading from "@shared/components/ui/Loading/Loading";
import { useProductos } from "../hooks/useProductos";
import StockCell from "../components/StockCell";
import { ImageGallery } from "../components/ImageGallery";
import { formatCOP } from "@shared/utils/formatCOP";

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
    estadoFilters,
    cambiarEstado,
    showEmptyState,
    notification,
    hideNotification,
    showNotification,
    modalDelete,
    confirmDelete,
    handleCancelDelete,
    handleDelete,
    isDeleting,
    page,
    setPage,
    totalPages,
  } = useProductos();

  useEffect(() => {
    const savedNotification = localStorage.getItem('productoNotification');
    if (savedNotification) {
      const { message, type } = JSON.parse(savedNotification);
      showNotification(message, type);
      localStorage.removeItem('productoNotification');
    }
  }, [showNotification]);

  const columns = [
    { field: "nombre", header: "Nombre" },
    {
      field: "precioVenta",
      header: "Precio Venta",
      render: (item) => formatCOP(item.precioVenta),
    },
    {
      field: "stockActual",
      header: "Stock",
      render: (item) => <StockCell item={item} />,
    },
    {
      field: "imagenes", 
      header: "Imágenes",
      render: (item) => (
        <ImageGallery 
          key={`img-gallery-${item.id}`}
          images={item.imagenes} 
          size="small" 
          showAsButton 
          productName={item.nombre}
        />
      ),
    },
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
        {error && (
          <Box sx={{ p: 2, bgcolor: '#ffebee', color: '#c62828', borderRadius: 1, mb: 2 }}>
            {error}
          </Box>
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
        
        {/* ✅ Paginación - ahora funcionará porque Typography está importado */}
        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Página {page} de {totalPages}
            </Typography>
          </Stack>
        )}

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Producto?"
          message={`¿Estás seguro de eliminar "${modalDelete.nombre}"?`}
          confirmText={isDeleting() ? "Eliminando..." : "Eliminar"}
          cancelText="Cancelar"
          showCancel={!isDeleting()}
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />
      </CrudLayout>
    </>
  );
}
