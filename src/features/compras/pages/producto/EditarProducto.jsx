import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductoForm from "./components/ProductoForm";
import { ProductoData } from "../../../../lib/data/productosData";

export default function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducto();
  }, [id]);

  const loadProducto = async () => {
    try {
      setLoading(true);
      const data = await ProductoData.getProductoById(parseInt(id));
      setProducto(data);
    } catch (err) {
      console.error("Error al cargar producto:", err);
      setError("No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async (data) => {
  try {
    setLoading(true);
    await ProductoData.updateProducto(parseInt(id), data);
    navigate("/admin/compras/productos");
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    alert("Error al actualizar el producto");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <ProductoForm
      mode="edit"
      title={`Editar Producto: ${producto.nombre}`}
      initialData={producto}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/compras/productos")}
    />
  );
}