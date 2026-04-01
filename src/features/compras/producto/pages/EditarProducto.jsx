// src/features/compras/pages/producto/pages/EditarProducto.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../shared/components/ui/Loading/Loading";
import { useProductoForm } from "../hooks/useProductoForm";
import { getProductoById } from "../services/productosService";
import ProductoForm from "../components/ProductoForm";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const loadProducto = async () => {
      try {
        const data = await getProductoById(parseInt(id));
        setInitialData(data);
      } catch (error) {
        alert("Error al cargar el producto");
        navigate("/admin/compras/productos");
      } finally {
        setLoadingInitial(false);
      }
    };
    loadProducto();
  }, [id, navigate]);

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
    onSubmitSuccess: () => {
      navigate("/admin/compras/productos");
    },
    onError: (error) => {
      alert(error);
    }
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
  );
}