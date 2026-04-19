import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Select, MenuItem } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import Loading from "../../../../shared/components/ui/Loading/Loading";
import { useProductos } from "../hooks/useProductos";
import StockCell from "../components/StockCell";
import { ImageGallery } from "../components/ImageGallery";
import { formatCOP } from "../../../../shared/utils/formatCOP";

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
    handleDelete,
  } = useProductos();

  const limpiarFiltros = () => {
    setSearch("");
    setFilterEstado("");
    setFilterMarca("");
    setFilterCategoria("");
  };

  const hayFiltrosActivos = search !== "" || filterEstado !== "" || filterMarca !== "" || filterCategoria !== "";

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
          key={`img-gallery-${item.id}`}  // ← clave única por producto
          images={item.imagenes} 
          size="small" 
          showAsButton 
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
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Select
            value={filterMarca}
            onChange={(e) => setFilterMarca(e.target.value)}
            displayEmpty
            size="small"
            sx={{ minWidth: 150 }}
          >
            {marcaFilters.map((filter) => (
              <MenuItem key={filter.value} value={filter.value}>
                {filter.label}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            displayEmpty
            size="small"
            sx={{ minWidth: 150 }}
          >
            {categoriaFilters.map((filter) => (
              <MenuItem key={filter.value} value={filter.value}>
                {filter.label}
              </MenuItem>
            ))}
          </Select>

          {hayFiltrosActivos && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={limpiarFiltros}
              color="error"
              sx={{ height: 40 }}
            >
              Limpiar filtros
            </Button>
          )}
        </Stack>

        {error && (
          <Box
            sx={{
              p: 2,
              bgcolor: '#ffebee',
              color: '#c62828',
              borderRadius: 1,
              mb: 2,
            }}
          >
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

        {showEmptyState && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button onClick={onCreateClick} variant="contained" color="primary">
              Crear Primer Producto
            </Button>
          </Box>
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