// src/features/compras/pages/producto/pages/EditarProducto.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../shared/components/ui/Loading/Loading";
import { useProductoForm } from "../hooks/useProductoForm";
import { getProductoById } from "../services/productosService";
import ProductoForm from "../components/ProductoForm";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 6000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    navigate("/admin/compras/productos");
  }, [navigate]);

  const handleError = useCallback((error) => {
    showNotification(error, "error");
  }, [showNotification]);

  useEffect(() => {
    const loadProducto = async () => {
      try {
        const data = await getProductoById(parseInt(id));
        setInitialData(data);
      } catch (error) {
        showNotification("Error al cargar el producto", "error");
        navigate("/admin/compras/productos");
      } finally {
        setLoadingInitial(false);
      }
    };
    loadProducto();
  }, [id, navigate, showNotification]);

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
    handleSubmit
  } = useProductoForm({
    mode: "edit",
    initialData,
    onSubmitSuccess: handleSubmitSuccess,
    onError: handleError
  });

  const handleOpenMarcaModal = () => {};
  const handleOpenCategoriaModal = () => {};
  const handleCancel = () => {
    navigate("/admin/compras/productos");
  };

  if (loadingInitial || loading) {
    return <Loading message="Cargando información del producto..." minHeight="400px" />;
  }

  if (!initialData) {
    return <div>Producto no encontrado</div>;
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
        mode="edit"
        title={`Editar Producto: ${initialData.nombre}`}
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
      />
    </>
  );
}