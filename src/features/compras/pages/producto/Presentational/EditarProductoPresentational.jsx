import ProductoForm from "../components/ProductoForm";
import CrudNotification from "../../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarProductoPresentational({
  producto,
  notification,
  hideNotification,
  onSubmit,
  onCancel
}) {
  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      <ProductoForm
        mode="edit"
        title={`Editar Producto: ${producto.nombre}`}
        initialData={producto}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onOpenMarcaModal={() => {}} 
        onOpenCategoriaModal={() => {}} 
      />
    </>
  );
}