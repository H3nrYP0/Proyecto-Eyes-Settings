import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../../../../lib/data/productosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const productoData = getProductoById(Number(id));
    setProducto(productoData);
  }, [id]);

  if (!producto) {
    return <div>Cargando...</div>;
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'activo': return 'crud-badge-success';
      case 'inactivo': return 'crud-badge-error';
      case 'bajo-stock': return 'crud-badge-warning';
      default: return 'crud-badge-success';
    }
  };

  const getEstadoText = (estado) => {
    switch(estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'bajo-stock': return 'Bajo Stock';
      default: return estado;
    }
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Producto: {producto.nombre}</h1>
        <p>Información completa del producto</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información General</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{producto.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Código:</strong> 
              <span>{producto.codigo}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Categoría:</strong> 
              <span>{producto.categoria}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Marca:</strong> 
              <span>{producto.marca}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Precio Venta:</strong> 
              <span>{formatCurrency(producto.precioVenta)}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Precio Compra:</strong> 
              <span>{formatCurrency(producto.precioCompra)}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Stock Actual:</strong> 
              <span>{producto.stockActual}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Stock Mínimo:</strong> 
              <span>{producto.stockMinimo}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${getEstadoBadge(producto.estado)}`}>
                {getEstadoText(producto.estado)}
              </span>
            </div>

            {producto.descripcion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Descripción:</strong> 
                <span>{producto.descripcion}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/compras/productos')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}