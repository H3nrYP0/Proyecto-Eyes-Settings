// src/features/compras/pages/productos/Presentational/DetalleProductoPresentational.jsx
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ProductoForm from "../components/ProductoForm";
import CrudNotification from "../../../../../shared/styles/components/notifications/CrudNotification";

export default function DetalleProductoPresentational({
  producto,
  loading,
  error,
  notification,
  hideNotification,
  onEdit,
  onBack
}) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !producto) {
    return (
      <>
        <CrudNotification
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="error" gutterBottom>
            {error || "Producto no encontrado"}
          </Typography>
          <Button variant="contained" onClick={onBack}>
            Volver a productos
          </Button>
        </Box>
      </>
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
      <ProductoForm
        mode="view"
        title={`Detalle de Producto: ${producto.nombre}`}
        initialData={producto}
        onCancel={onBack}
        onEdit={onEdit}
      />
    </>
  );
}