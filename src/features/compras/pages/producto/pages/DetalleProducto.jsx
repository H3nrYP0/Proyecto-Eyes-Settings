// src/features/compras/pages/producto/pages/DetalleProducto.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../shared/components/ui/Loading/Loading";
import { useProductoForm } from "../hooks/useProductoForm";
import { getProductoById } from "../services/productosService";
import ProductoForm from "../components/ProductoForm";

export default function DetalleProducto() {
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
    return <Loading message="Cargando detalle del producto..." minHeight="400px" />;
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