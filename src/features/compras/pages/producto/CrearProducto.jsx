import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductoForm from "./components/ProductoForm";
import { ProductoData } from "../../../../lib/data/productosData";

export default function CrearProducto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await ProductoData.createProducto(data);
      navigate("/admin/compras/productos");
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductoForm
      mode="create"
      title="Crear Nuevo Producto"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/compras/productos")}
    />
  );
}