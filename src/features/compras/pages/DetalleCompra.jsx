import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById } from '../../../lib/data/comprasData';
import "../../../shared/styles/components/crud-forms.css";

export default function DetalleCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const compraData = getCompraById(Number(id));
    setCompra(compraData);
  }, [id]);

  if (!compra) {
    return <div>Cargando...</div>;
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Compra: {compra.numeroCompra}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Proveedor:</strong> 
              <span>{compra.proveedorNombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Fecha:</strong> 
              <span>{formatDate(compra.fecha)}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${compra.estado === "Completada" ? "crud-badge-success" : "crud-badge-error"}`}>
                {compra.estado}
              </span>
            </div>

            <div className="crud-detail-item">
              <strong>Número:</strong> 
              <span>{compra.numeroCompra}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Subtotal:</strong> 
              <span>{formatCurrency(compra.subtotal)}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>IVA (19%):</strong> 
              <span>{formatCurrency(compra.iva)}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Total:</strong> 
              <span>{formatCurrency(compra.total)}</span>
            </div>

            {compra.observaciones && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Observaciones:</strong> 
                <span>{compra.observaciones}</span>
              </div>
            )}
          </div>
        </div>

        {compra.productos.length > 0 && (
          <div className="crud-form-section">
            <h3>Productos</h3>
            <div className="crud-detail-grid">
              {compra.productos.map(producto => (
                <div key={producto.id} className="crud-detail-item">
                  <strong>{producto.nombre}</strong>
                  <span>{producto.cantidad} x {formatCurrency(producto.precioUnitario)} = {formatCurrency(producto.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/compras')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/compras/editar/${compra.id}`)}
            className="crud-btn crud-btn-primary"
            disabled={compra.estado === "Anulada"}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}