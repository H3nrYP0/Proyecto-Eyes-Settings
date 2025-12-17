import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompraById } from '../../../lib/data/comprasData';
import "../../../shared/styles/components/crud-forms.css";
import { TextField } from '@mui/material';

export default function DetalleCompra() {
  const { id } = useParams();
  const compraId = parseInt(id, 10);
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    if (isNaN(compraId)) {
      navigate('/admin/compras');
      return;
    }

    const compraData = getCompraById(compraId);
    if (!compraData) {
      navigate('/admin/compras');
      return;
    }
    setCompra(compraData);
  }, [compraId, navigate]);

  if (!compra) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '30px' }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const estadoLabel = compra.estado === 'Completada' ? 'Completada' : 'Anulada';

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de la Compra</h1>
      </div>

      <div className="crud-form-content">
        {/* Información básica */}
        <div className="crud-form-section" style={{
          gap: '16px',
          padding: '16px'
        }}>
          <div className="crud-form-group" style={{ margin: 0 }}>
            <TextField
              fullWidth
              label="Proveedor"
              value={compra.proveedorNombre || ''}
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: {
                  backgroundColor: 'white',
                  height: '48px',
                  fontSize: '0.9rem'
                }
              }}
              InputLabelProps={{
                style: { fontWeight: 'normal', fontSize: '0.85rem' }
              }}
            />
          </div>

          <div className="crud-form-group" style={{ margin: 0 }}>
            <TextField
              fullWidth
              label="Fecha"
              value={formatDate(compra.fecha)}
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: {
                  backgroundColor: 'white',
                  height: '48px',
                  fontSize: '0.9rem'
                }
              }}
              InputLabelProps={{
                shrink: true,
                style: { fontWeight: 'normal', fontSize: '0.85rem' }
              }}
            />
          </div>

          <div className="crud-form-group" style={{ margin: 0 }}>
            <TextField
              fullWidth
              label="Estado"
              value={estadoLabel}
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: {
                  backgroundColor: 'white',
                  height: '48px',
                  fontSize: '0.9rem',
                  color: compra.estado === 'Completada' ? '#10b981' : '#ef4444'
                }
              }}
              InputLabelProps={{
                style: { fontWeight: 'normal', fontSize: '0.85rem' }
              }}
            />
          </div>
        </div>

        {/* Productos y Totales */}
        {compra.productos?.length > 0 && (
          <div className="detalle-compra-responsive-grid">
            {/* Productos */}
            <div>
              <h4 style={{
                color: 'var(--gray-800)',
                fontSize: '1rem',
                fontWeight: '600',
                margin: '0 0 12px 0'
              }}>
                Productos en la Compra
              </h4>
              <div className="crud-products-section">
                <table className="crud-products-table" style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.85rem'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: 'var(--gray-50)',
                      borderBottom: '1px solid var(--gray-300)'
                    }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Producto</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Cantidad</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Precio Unitario</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compra.productos.map((producto, index) => (
                      <tr key={producto.id || index} style={{
                        borderBottom: '1px solid var(--gray-200)'
                      }}>
                        <td style={{ padding: '8px' }}>{producto.nombre}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{producto.cantidad}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(producto.precioUnitario)}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(producto.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totales */}
            <div style={{
              backgroundColor: 'var(--gray-50)',
              border: '1px solid var(--gray-200)',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: 'var(--gray-800)',
                fontSize: '1rem',
                fontWeight: '600',
                borderBottom: '1px solid var(--gray-300)',
                paddingBottom: '8px'
              }}>
                Resumen de la Compra
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(compra.subtotal || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>IVA (19%):</span>
                <span>{formatCurrency(compra.iva || 0)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'var(--primary-color)'
              }}>
                <span>Total:</span>
                <span>{formatCurrency(compra.total || 0)}</span>
              </div>
              {/* Botón Volver */}
              <div className="crud-form-actions">
                <button
                  type="button"
                  className="crud-btn crud-btn-secondary"
                  onClick={() => navigate('/admin/compras')}
                >
                  Volver
                </button>
                <button
                  type="button"
                  className="crud-btn unified-btn-pdf"
                  onClick={() => navigate(`pdf`)}
                  style={{
                    height: 'auto',
                    padding: '4px 10px',        // Reduce el relleno interno
                    fontSize: '0.85rem',        // Texto más pequeño
                    minHeight: 'auto',          // Evita altura mínima fija
                    height: 'auto',             // Permite que el botón se ajuste al contenido
                    lineHeight: '1.2',          // Ajusta el espaciado del texto
                    minWidth: 'auto'
                  }}
                >
                  Generar PDF
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}