import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById } from '../../../lib/data/comprasData';

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
    <div className="detalle-card">
      <h1>Detalle de Compra: {compra.numeroCompra}</h1>
      
      <div className="detalle-item">
        <strong>Proveedor:</strong> {compra.proveedorNombre}
      </div>
      
      <div className="detalle-item">
        <strong>Fecha:</strong> {formatDate(compra.fecha)}
      </div>
      
      <div className="detalle-item">
        <strong>Estado:</strong> 
        <span className={`estado-badge ${compra.estado.toLowerCase()}`}>
          {compra.estado}
        </span>
      </div>

      <div className="detalle-item">
        <strong>Productos:</strong>
        <ul>
          {compra.productos.map(producto => (
            <li key={producto.id}>
              {producto.nombre} - {producto.cantidad} x {formatCurrency(producto.precioUnitario)} = {formatCurrency(producto.total)}
            </li>
          ))}
        </ul>
      </div>

      <div className="detalle-item">
        <strong>Subtotal:</strong> {formatCurrency(compra.subtotal)}
      </div>
      
      <div className="detalle-item">
        <strong>IVA (19%):</strong> {formatCurrency(compra.iva)}
      </div>
      
      <div className="detalle-item">
        <strong>Total:</strong> {formatCurrency(compra.total)}
      </div>

      {compra.observaciones && (
        <div className="detalle-item">
          <strong>Observaciones:</strong> {compra.observaciones}
        </div>
      )}

      <div className="detalle-actions">
        <button 
          onClick={() => navigate('/admin/compras')}
          className="btn-secondary"
        >
          Volver
        </button>
        <button 
          onClick={() => navigate(`/admin/compras/editar/${compra.id}`)}
          className="btn-primary"
          disabled={compra.estado === "Anulada"}
        >
          Editar
        </button>
      </div>
    </div>
  );
}