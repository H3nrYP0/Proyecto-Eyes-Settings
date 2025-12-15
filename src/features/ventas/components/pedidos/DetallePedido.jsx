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
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando información del pedido...
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const getEstadoClass = (estado) => {
    const estadoMap = {
      'En proceso': 'proceso',
      'Pendiente pago': 'pendiente',
      'Pagado': 'pagado',
      'Entregado': 'entregado',
      'Cancelado': 'cancelado'
    };
    return estadoMap[estado] || 'proceso';
  };

  const getTipoClass = (tipo) => {
    return tipo === 'Venta' ? 'venta' : 'servicio';
  };

  // Verificar si tiene items detallados o solo la descripción antigua
  const tieneItemsDetallados = pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0;

  return (
    <div className="crud-form-container" style={{ maxWidth: '1000px' }}>
      <div className="crud-form-header">
        <h1>Pedido: {pedido.cliente}</h1>
        <p>Detalle completo del pedido</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          {/* Cliente */}
          <div className="crud-form-group">
            <label className="crud-label">Cliente</label>
            <div className="crud-input-view">
              {pedido.cliente}
            </div>
          </div>

          {/* Tipo */}
          <div className="crud-form-group">
            <label className="crud-label">Tipo</label>
            <div className="crud-input-view">
              <span className={`crud-badge ${getTipoClass(pedido.tipo)}`}>
                {pedido.tipo}
              </span>
            </div>
          </div>

          {/* Estado */}
          <div className="crud-form-group">
            <label className="crud-label">Estado</label>
            <div className="crud-input-view">
              <span className={`crud-badge estado-${getEstadoClass(pedido.estado)}`}>
                {pedido.estado}
              </span>
            </div>
          </div>

          {/* Fechas */}
          <div className="crud-form-group">
            <label className="crud-label">Fecha Pedido</label>
            <div className="crud-input-view date">
              {pedido.fechaPedido}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label">Fecha Entrega</label>
            <div className="crud-input-view date">
              {pedido.fechaEntrega}
            </div>
          </div>

          {/* Montos */}
          <div className="crud-form-group">
            <label className="crud-label">Total</label>
            <div className="crud-input-view important">
              {formatCurrency(pedido.total)}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label">Saldo Pendiente</label>
            <div className="crud-input-view">
              <span className={pedido.saldoPendiente > 0 ? "saldo-pendiente" : "saldo-pagado"}>
                {formatCurrency(pedido.saldoPendiente || 0)}
              </span>
            </div>
          </div>

          {/* Sección de productos/servicios */}
          <div className="crud-form-group full-width">
            <label className="crud-label" style={{ 
              marginBottom: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--gray-700)'
            }}>
              {pedido.tipo === 'Venta' ? 'Productos' : 'Servicios'} 
              ({tieneItemsDetallados ? pedido.items.length : '1'})
            </label>
            
            <div style={{ 
              background: 'white',
              borderRadius: '8px',
              border: '1px solid var(--gray-200)',
              overflow: 'hidden',
              marginTop: '8px'
            }}>
              {tieneItemsDetallados ? (
                // Mostrar items detallados
                <>
                  {pedido.items.map((item, index) => (
                    <div key={index} 
                         style={{ 
                           display: 'flex',
                           alignItems: 'center',
                           padding: '16px 20px',
                           borderBottom: index < pedido.items.length - 1 ? '1px solid var(--gray-100)' : 'none',
                           background: index % 2 === 0 ? 'white' : 'var(--gray-50)'
                         }}>
                      <div style={{ flex: '1' }}>
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{ 
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--gray-800)'
                          }}>
                            {item.nombre}
                          </div>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div style={{ 
                              fontSize: '0.9rem',
                              color: 'var(--gray-600)',
                              fontWeight: '500'
                            }}>
                              {item.cantidad}x
                            </div>
                            <div style={{ 
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'var(--primary-color)'
                            }}>
                              ${(item.precio * item.cantidad).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {item.descripcion && (
                          <div style={{ 
                            fontSize: '0.9rem',
                            color: 'var(--gray-600)',
                            marginBottom: '6px',
                            lineHeight: '1.4'
                          }}>
                            {item.descripcion}
                          </div>
                        )}
                        
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ 
                            fontSize: '0.85rem',
                            color: 'var(--gray-500)'
                          }}>
                            Precio unitario: <strong>${item.precio.toLocaleString()}</strong>
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: pedido.tipo === 'Venta' ? '#dbeafe' : '#dcfce7',
                            color: pedido.tipo === 'Venta' ? '#1d4ed8' : '#166534',
                            fontWeight: '600'
                          }}>
                            {pedido.tipo === 'Venta' ? 'PRODUCTO' : 'SERVICIO'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total resumen */}
                  <div style={{ 
                    padding: '20px',
                    background: 'var(--gray-50)',
                    borderTop: '2px solid var(--gray-300)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--gray-700)'
                    }}>
                      TOTAL DEL PEDIDO
                    </div>
                    <div style={{ 
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      color: 'var(--primary-color)'
                    }}>
                      {formatCurrency(pedido.total)}
                    </div>
                  </div>
                </>
              ) : (
                // Mostrar descripción antigua (para compatibilidad)
                <div style={{ 
                  padding: '20px',
                  textAlign: 'center',
                  color: 'var(--gray-600)'
                }}>
                  <div style={{ 
                    fontSize: '1rem',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {pedido.productoServicio}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem',
                    color: 'var(--gray-500)',
                    fontStyle: 'italic'
                  }}>
                    (Descripción general del pedido)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones - Full width */}
          {pedido.observaciones && (
            <div className="crud-form-group full-width">
              <label className="crud-label">Observaciones</label>
              <div className="crud-input-view" style={{ 
                minHeight: '56px',
                alignItems: 'flex-start',
                paddingTop: '16.5px',
                lineHeight: '1.5'
              }}>
                {pedido.observaciones}
              </div>
            </div>
          )}
        </div>

        <div className="crud-form-actions">
          <button 
            type="button"
            onClick={() => navigate('/admin/ventas/pedidos')}
            className="crud-btn crud-btn-secondary"
          >
            ← Volver a Pedidos
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