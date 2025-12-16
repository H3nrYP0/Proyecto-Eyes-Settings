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
      <div className="crud-form-container" style={{ maxWidth: '850px' }}>
        <div className="crud-form-header" style={{ padding: '16px 20px' }}>
          <h1 style={{ fontSize: '1.4rem', margin: '0' }}>Detalle del Pedido</h1>
        </div>
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

  const tieneItemsDetallados = pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0;
  const tieneProductos = tieneItemsDetallados ? pedido.items.some(item => item.tipo === 'producto') : 
                         pedido.tipo?.includes('Producto') || false;
  const tieneServicios = tieneItemsDetallados ? pedido.items.some(item => item.tipo === 'servicio') : 
                         pedido.tipo?.includes('Servicio') || false;

  return (
    <div className="crud-form-container" style={{ maxWidth: '850px' }}>
      {/* HEADER COMPACTO - SIN DESCRIPCIÓN */}
      <div className="crud-form-header" style={{ padding: '16px 20px', minHeight: 'auto' }}>
        <h1 style={{ fontSize: '1.4rem', margin: '0' }}>Pedido: {pedido.cliente}</h1>
      </div>
      
      <div className="crud-form-content">
        {/* INFORMACIÓN BÁSICA COMPACTA */}
        <div className="crud-form-section" style={{ 
          padding: '16px', 
          marginBottom: '12px', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Cliente</label>
            <div className="crud-input-view" style={{ padding: '10px 12px', fontSize: '0.9rem' }}>
              {pedido.cliente}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Estado</label>
            <div className="crud-input-view" style={{ padding: '10px 12px' }}>
              <span className={`crud-badge estado-${getEstadoClass(pedido.estado)}`} style={{ fontSize: '0.8rem' }}>
                {pedido.estado}
              </span>
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Fecha Pedido</label>
            <div className="crud-input-view date" style={{ padding: '10px 12px', fontSize: '0.9rem' }}>
              {pedido.fechaPedido}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Fecha Entrega</label>
            <div className="crud-input-view date" style={{ padding: '10px 12px', fontSize: '0.9rem' }}>
              {pedido.fechaEntrega}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Tipo</label>
            <div className="crud-input-view" style={{ padding: '10px 12px' }}>
              <span className={`crud-badge ${tieneProductos && tieneServicios ? 'productos-servicios' : 
                               tieneProductos ? 'productos' : 'servicios'}`} style={{ fontSize: '0.8rem' }}>
                {tieneProductos && tieneServicios ? 'P y S' : 
                 tieneProductos ? 'Productos' : 'Servicios'}
              </span>
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Items</label>
            <div className="crud-input-view" style={{ padding: '10px 12px', fontSize: '0.9rem' }}>
              {tieneItemsDetallados ? pedido.items.length : '1'}
            </div>
          </div>
        </div>

        {/* MONETOS COMPACTOS */}
        <div className="crud-form-section" style={{ 
          padding: '12px', 
          marginBottom: '16px', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Total</label>
            <div className="crud-input-view" style={{ 
              color: 'var(--primary-color)',
              fontWeight: '600',
              fontSize: '0.9rem',
              padding: '10px 12px'
            }}>
              {formatCurrency(pedido.total)}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Abono</label>
            <div className="crud-input-view" style={{ padding: '10px 12px', fontSize: '0.9rem' }}>
              {formatCurrency(pedido.abono || 0)}
            </div>
          </div>

          <div className="crud-form-group">
            <label className="crud-label" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Saldo</label>
            <div className="crud-input-view" style={{ 
              color: pedido.saldoPendiente > 0 ? '#991b1b' : '#166534',
              fontWeight: '600',
              fontSize: '0.9rem',
              padding: '10px 12px'
            }}>
              {formatCurrency(pedido.saldoPendiente || 0)}
            </div>
          </div>
        </div>

        {/* ITEMS COMPACTOS */}
        <div style={{ 
          background: 'var(--gray-50)',
          borderRadius: '6px',
          border: '1px solid var(--gray-200)',
          padding: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--gray-700)', margin: '0' }}>
              {tieneProductos && tieneServicios ? 'Productos y Servicios' : 
               tieneProductos ? 'Productos' : 'Servicios'} 
              ({tieneItemsDetallados ? pedido.items.length : '1'})
            </h3>
          </div>
          
          <div style={{ 
            background: 'white',
            borderRadius: '5px',
            border: '1px solid var(--gray-200)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {tieneItemsDetallados ? (
              <>
                {pedido.items.map((item, index) => (
                  <div key={index} 
                       style={{ 
                         padding: '10px 12px',
                         borderBottom: index < pedido.items.length - 1 ? '1px solid var(--gray-100)' : 'none',
                         fontSize: '0.85rem'
                       }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{item.nombre}</span>
                        <span style={{ 
                          fontSize: '0.65rem',
                          padding: '1px 4px',
                          borderRadius: '2px',
                          background: item.tipo === 'producto' ? '#dbeafe' : '#dcfce7',
                          color: item.tipo === 'producto' ? '#1d4ed8' : '#166534'
                        }}>
                          {item.tipo === 'producto' ? 'P' : 'S'}
                        </span>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: '3px' }}>
                      {item.descripcion}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        ${item.precio.toLocaleString()} × {item.cantidad}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div style={{ 
                  padding: '12px',
                  background: 'var(--gray-100)',
                  borderTop: '1px solid var(--gray-300)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--gray-700)', fontSize: '0.95rem' }}>
                    TOTAL
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                    {formatCurrency(pedido.total)}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--gray-600)' }}>
                <div style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem' }}>
                  {pedido.productoServicio}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions" style={{ 
          paddingTop: '12px', 
          marginTop: '0',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <button 
            type="button"
            onClick={() => navigate('/admin/ventas/pedidos')}
            className="crud-btn crud-btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            ← Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/ventas/pedidos/editar/${pedido.id}`)}
            className="crud-btn crud-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}