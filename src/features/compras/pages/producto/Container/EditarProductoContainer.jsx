import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductoData } from "../../../../../lib/data/productosData";
import EditarProductoPresentational from "../Presentational/EditarProductoPresentational";

export default function EditarProductoContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

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
      showNotification("Error al cargar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    // Convertir estado de string a booleano
    const dataToSend = {
      ...data,
      estado: data.estado === 'activo'
    };
    
    try {
      setLoading(true);
      const nombreExists = await ProductoData.checkProductoExists(data.nombre, parseInt(id));
      
      if (nombreExists) {
        showNotification("No se puede actualizar: el nombre del producto ya existe", "error");
        setLoading(false);
        return;
      }
      
      await ProductoData.updateProducto(parseInt(id), dataToSend);
      showNotification("Producto actualizado exitosamente", "success");
      
      setTimeout(() => {
        navigate("/admin/compras/productos");
      }, 2000);
      
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      showNotification("Error al actualizar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/compras/productos");
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <EditarProductoPresentational
      producto={producto}
      notification={notification}
      hideNotification={hideNotification}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}