// src/features/compras/pages/producto/pages/DetalleProducto.jsx
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@shared/components/ui/Loading/Loading";
import { useProductoForm } from "../hooks/useProductoForm";
import { useProductoDetailQuery } from "../queries/useProductoDetailQuery";
import ProductoForm from "../components/ProductoForm";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: initialData, isLoading: loadingInitial } = useProductoDetailQuery(parseInt(id));

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
  } = useProductoForm({
    mode: "view",
    initialData,
    onSubmitSuccess: () => {},
    onError: () => {}
  });

  const handleOpenMarcaModal = () => {};
  const handleOpenCategoriaModal = () => {};
  const handleCancel = () => {
    navigate("/admin/compras/productos");
  };
  const handleEdit = () => {
    navigate(`/admin/compras/productos/editar/${id}`);
  };

  if (loadingInitial || loading) {
    return <Loading text="Cargando detalle del producto..." minHeight="400px" />;
  }

  if (!initialData) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <ProductoForm
      mode="view"
      title={`Detalle de Producto: ${initialData.nombre}`}
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
      onEdit={handleEdit}
      handleChange={handleChange}
      handleImageUpload={handleImageUpload}
      removeImage={removeImage}
      handleSubmit={handleSubmit}
    />
  );
}
