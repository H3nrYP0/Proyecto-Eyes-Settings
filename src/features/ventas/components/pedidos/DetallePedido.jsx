import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById } from '../../../../lib/data/pedidosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetallePedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const pedidoData = getPedidoById(Number(id));
    setPedido(pedidoData);
  }, [id]);

  if (!pedido) {
    return <div>Cargando...</div>;
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Pedido: {pedido.cliente}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Cliente:</strong> 
              <span>{pedido.cliente}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Producto/Servicio:</strong> 
              <span>{pedido.productoServicio}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Tipo:</strong> 
              <span className={`badge-${pedido.tipo === "Venta" ? 'venta' : 'servicio'}`}>
                {pedido.tipo}
              </span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha Pedido:</strong> 
              <span>{pedido.fechaPedido}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha Entrega:</strong> 
              <span>{pedido.fechaEntrega}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Total:</strong> 
              <span>{formatCurrency(pedido.total)}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Saldo Pendiente:</strong> 
              <span className={pedido.saldoPendiente > 0 ? "saldo-pendiente" : "saldo-pagado"}>
                {formatCurrency(pedido.saldoPendiente)}
              </span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`estado-pedido estado-${pedido.estado.toLowerCase().replace(' ', '-')}`}>
                {pedido.estado}
              </span>
            </div>

            {pedido.observaciones && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Observaciones:</strong> 
                <span>{pedido.observaciones}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/ventas/pedidos')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/ventas/pedidos/editar/${pedido.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}