import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductoData } from "../../../../../lib/data/productosData";
import DetalleProductoPresentational from "../Presentational/DetalleProductoPresentational";

export default function DetalleProductoContainer() {
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

  useEffect(() => {
    loadProducto();
  }, [id]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const loadProducto = async () => {
    try {
      setLoading(true);
      const data = await ProductoData.getProductoById(parseInt(id));
      setProducto(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar producto:", err);
      setError("No se pudo cargar el producto");
      showNotification("Error al cargar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/compras/productos/editar/${id}`);
  };

  const handleBack = () => {
    navigate("/admin/compras/productos");
  };

  return (
    <DetalleProductoPresentational
      producto={producto}
      loading={loading}
      error={error}
      notification={notification}
      hideNotification={hideNotification}
      onEdit={handleEdit}
      onBack={handleBack}
    />
  );
}