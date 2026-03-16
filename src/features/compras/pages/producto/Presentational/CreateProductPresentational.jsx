import { Button} from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ProductoForm from "../components/ProductoForm";
import ChatBotContainer from "../components/ChatBotContainer";
import Modal from "../../../../../shared/components/ui/Modal";
import MarcaForm from "../../marca/components/MarcasForm";
import CategoriaForm from "../../categoria/components/categoriasForm";
import CrudNotification from "../../../../../shared/styles/components/notifications/CrudNotification";

export default function CreateProductPresentational({
  notification,
  hideNotification,
  marcaModal,
  categoriaModal,
  refreshMarcas,
  refreshCategorias,

   chatBotOpen,
  onOpenChatBot,
  onCloseChatBot,
  onConfirmExisting,  
  formMode,
  onNewProduct,

  handleSubmit,
  handleOpenMarcaModal,
  handleCloseMarcaModal,
  handleMarcaSubmit,
  handleOpenCategoriaModal,
  handleCloseCategoriaModal,
  handleCategoriaSubmit,
  navigate
}) {
  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <Button
        variant="outlined"
        startIcon={<SmartToyIcon />}
        onClick={onOpenChatBot}
        sx={{ mb: 2, ml: 3 }}
        size="small"
      >
       ¿Ya existe el producto?
      </Button>

      <ProductoForm
        mode={formMode} 
        title={formMode === "create" ? "Crear Nuevo Producto" : "Registrar Producto Existente"} 
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/compras/productos")}
        onOpenMarcaModal={handleOpenMarcaModal}
        onOpenCategoriaModal={handleOpenCategoriaModal}
        refreshMarcas={refreshMarcas}
        refreshCategorias={refreshCategorias}
      />
      <ChatBotContainer
      open={chatBotOpen}
      onClose={onCloseChatBot}
      onConfirmExisting={onConfirmExisting} 
      onNewProduct={onNewProduct}
    />

      <Modal
        open={marcaModal.open}
        type="info"
        title="Crear Nueva Marca"
        confirmText={marcaModal.loading ? "Guardando..." : "Guardar"}
        cancelText="Cancelar"
        showCancel={!marcaModal.loading}
        onConfirm={() => {
          const formElement = document.getElementById("marca-modal-form");
          if (formElement) {
            formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        }}
        onCancel={handleCloseMarcaModal}
      >
        <MarcaForm
          id="marca-modal-form"
          mode="create"
          onSubmit={handleMarcaSubmit}
          onCancel={handleCloseMarcaModal}
          embedded={true}
        />
      </Modal>

      <Modal
        open={categoriaModal.open}
        type="info"
        title="Crear Nueva Categoría"
        confirmText={categoriaModal.loading ? "Guardando..." : "Guardar"}
        cancelText="Cancelar"
        showCancel={!categoriaModal.loading}
        onConfirm={() => {
          const formElement = document.getElementById("categoria-modal-form");
          if (formElement) {
            formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        }}
        onCancel={handleCloseCategoriaModal}
      >
        <CategoriaForm
          id="categoria-modal-form"
          mode="create"
          onSubmit={handleCategoriaSubmit}
          onCancel={handleCloseCategoriaModal}
          embedded={true}
        />
      </Modal>
    </>
  );
}