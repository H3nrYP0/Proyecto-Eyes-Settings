// src/features/compras/pages/producto/pages/CrearProducto.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Loading from "../../../../shared/components/ui/Loading/Loading";
import { useProductoForm } from "../hooks/useProductoForm";
import { useChatBot } from "../hooks/useChatBot";
import { useCategoriaForm } from "../../categoria/hooks/useCategoriaForm";
import { marcasService as MarcaData } from "/src/features/compras/marca/services/marcasService.js";
import ProductoForm from "../components/ProductoForm";
import ChatBot from "../components/ChatBot";
import Modal from "../../../../shared/components/ui/Modal";
import { MarcaForm } from "../../marca";
import CategoriaForm from "../../categoria/components/CategoriaForm";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function CrearProducto() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [refreshMarcas, setRefreshMarcas] = useState(0);
  const [refreshCategorias, setRefreshCategorias] = useState(0);
  const [formMode, setFormMode] = useState("create");
  
  const [marcaModal, setMarcaModal] = useState({
    open: false,
    loading: false
  });
  
  const [categoriaModal, setCategoriaModal] = useState({
    open: false,
    loading: false
  });

  const [isCategoriaSubmitting, setIsCategoriaSubmitting] = useState(false);
  const [isMarcaSubmitting, setIsMarcaSubmitting] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmitSuccess = useCallback(() => {
    navigate("/admin/compras/productos");
  }, [navigate]);

  const handleError = useCallback((error) => {
    showNotification(error, "error");
  }, [showNotification]);

  const {
    formData,
    errors,
    nombreExists,
    marcas,
    categorias,
    loading,
    isView,
    isCreate,
    imagenes,
    imagePreviews,
    uploadingImages,
    handleChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    setFormData
  } = useProductoForm({
    mode: formMode,
    refreshMarcas,
    refreshCategorias,
    onSubmitSuccess: handleSubmitSuccess,
    onError: handleError
  });

  const {
    formData: categoriaFormData,
    errors: categoriaErrors,
    nombreExists: categoriaNombreExists,
    submitting: categoriaSubmitting,
    handleChange: handleCategoriaChange,
    handleSubmit: handleCategoriaSubmit,
    resetForm: resetCategoriaForm,
  } = useCategoriaForm({
    mode: "create",
    onSubmitSuccess: () => {
      handleCloseCategoriaModal();
      setRefreshCategorias(prev => prev + 1);
      showNotification("Categoría creada exitosamente", "success");
      resetCategoriaForm();
    },
    onError: (error) => {
      showNotification(error, "error");
    },
  });

  const {
    open: chatBotOpen,
    step: chatBotStep,
    handleOpen: handleOpenChatBot,
    handleClose: handleCloseChatBot,
    handleNext: handleChatBotNext,
    handleConfirm: handleChatBotConfirm,
    handleNewProduct: handleChatBotNewProduct
  } = useChatBot({
    onConfirmExisting: () => {
      setFormMode("full-create");
      handleCloseChatBot();
    },
    onNewProduct: () => {
      setFormMode("create");
      handleCloseChatBot();
      showNotification("Creando producto nuevo desde cero", "info");
    }
  });

  const handleCategoriaSubmitSafe = async (data) => {
    if (isCategoriaSubmitting) return;
    setIsCategoriaSubmitting(true);
    try {
      await handleCategoriaSubmit(data);
    } finally {
      setIsCategoriaSubmitting(false);
    }
  };

  const handleMarcaSubmitSafe = async (data) => {
    if (isMarcaSubmitting) return;
    setIsMarcaSubmitting(true);
    try {
      await handleMarcaSubmit(data);
    } finally {
      setIsMarcaSubmitting(false);
    }
  };

  const handleOpenMarcaModal = () => {
    setMarcaModal({ open: true, loading: false });
  };

  const handleCloseMarcaModal = () => {
    setMarcaModal({ open: false, loading: false });
  };

  const handleMarcaSubmit = async (data) => {
    try {
      setMarcaModal(prev => ({ ...prev, loading: true }));
      await MarcaData.createMarca(data);
      setRefreshMarcas(prev => prev + 1);
      handleCloseMarcaModal();
      showNotification("Marca creada exitosamente", "success");
    } catch (error) {
      showNotification("Error al crear la marca", "error");
    } finally {
      setMarcaModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleOpenCategoriaModal = () => {
    resetCategoriaForm();
    setCategoriaModal({ open: true, loading: false });
  };

  const handleCloseCategoriaModal = () => {
    setCategoriaModal({ open: false, loading: false });
    resetCategoriaForm();
  };

  const handleCancel = () => {
    navigate("/admin/compras/productos");
  };

  if (loading) {
    return <Loading message="Cargando datos del formulario..." minHeight="400px" />;
  }

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
        onClick={handleOpenChatBot}
        sx={{ mb: 2, ml: 3 }}
        size="small"
      >
        ¿Ya existe el producto?
      </Button>

      <ProductoForm
        mode={formMode}
        title={formMode === "create" ? "Crear Nuevo Producto" : "Registrar Producto Existente"}
        formData={formData}
        errors={errors}
        nombreExists={nombreExists}
        marcas={marcas}
        categorias={categorias}
        isView={isView}
        isCreate={isCreate}
        imagenes={imagenes}
        imagePreviews={imagePreviews}
        uploadingImages={uploadingImages}
        onOpenMarcaModal={handleOpenMarcaModal}
        onOpenCategoriaModal={handleOpenCategoriaModal}
        onCancel={handleCancel}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        handleSubmit={handleSubmit}
        refreshMarcas={refreshMarcas}
        refreshCategorias={refreshCategorias}
      />

      <ChatBot
        open={chatBotOpen}
        step={chatBotStep}
        onClose={handleCloseChatBot}
        onNext={handleChatBotNext}
        onConfirm={handleChatBotConfirm}
        onNewProduct={handleChatBotNewProduct}
      />

      <Modal
        open={marcaModal.open}
        type="info"
        title="Crear Nueva Marca"
        confirmText={marcaModal.loading ? "Guardando..." : "Guardar"}
        cancelText="Cancelar"
        showCancel={!marcaModal.loading}
        onConfirm={() => {
          const form = document.getElementById("marca-modal-form");
          if (form && form.requestSubmit) {
            form.requestSubmit();
          } else if (form) {
            const btn = form.querySelector('button[type="submit"]');
            btn?.click();
          }
        }}
        onCancel={handleCloseMarcaModal}
      >
        <MarcaForm
          id="marca-modal-form"
          mode="create"
          onSubmit={handleMarcaSubmitSafe}
          onCancel={handleCloseMarcaModal}
          embedded={true}
        />
      </Modal>

      <Modal
        open={categoriaModal.open}
        type="info"
        title="Crear Nueva Categoría"
        confirmText={categoriaSubmitting ? "Guardando..." : "Guardar"}
        cancelText="Cancelar"
        showCancel={!categoriaSubmitting}
        onConfirm={() => {
          const form = document.getElementById("categoria-modal-form");
          if (form && form.requestSubmit) {
            form.requestSubmit();
          } else if (form) {
            const btn = form.querySelector('button[type="submit"]');
            btn?.click();
          }
        }}
        onCancel={handleCloseCategoriaModal}
      >
        <CategoriaForm
          id="categoria-modal-form"
          mode="create"
          formData={categoriaFormData}
          errors={categoriaErrors}
          nombreExists={categoriaNombreExists}
          submitting={categoriaSubmitting}
          handleChange={handleCategoriaChange}
          handleSubmit={handleCategoriaSubmitSafe}
          onCancel={handleCloseCategoriaModal}
          embedded={true}
        />
      </Modal>
    </>
  );
}