import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById } from '../../../../lib/data/clientesData';
import { getFormulasByClienteId } from '../../../../lib/data/formulasData';
import "../../../../shared/styles/components/crud-forms.css";

export default function HistorialFormula() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  const [formulas, setFormulas] = useState([]);

  useEffect(() => {
    const clienteData = getClienteById(Number(id));
    if (clienteData) {
      setCliente(clienteData);
      const formulasData = getFormulasByClienteId(Number(id));
      setFormulas(formulasData);
    } else {
      navigate('/admin/ventas/clientes');
    }
  }, [id, navigate]);

  const formatearFormula = (formula) => {
    const formatOjo = (esf, cil, eje) => {
      if (!esf) return '-';
      let resultado = esf;
      if (cil && cil !== '0.00') resultado += ` ${cil}`;
      if (eje && eje !== '0') resultado += ` x ${eje}`;
      return resultado;
    };

    return {
      ojoDerecho: formatOjo(formula.ojoDerechoEsferico, formula.ojoDerechoCilindrico, formula.ojoDerechoEje),
      ojoIzquierdo: formatOjo(formula.ojoIzquierdoEsferico, formula.ojoIzquierdoCilindrico, formula.ojoIzquierdoEje)
    };
  };

  if (!cliente) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando información del cliente...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container" style={{ maxWidth: '1000px' }}>
      <div className="crud-form-header">
        <h1>Historial de Fórmulas</h1>
      </div>
      
      <div className="crud-form-content" style={{ padding: '24px !important' }}>
        {/* Lista de fórmulas - ESTILOS OVERRIDE */}
        <div style={{
          marginBottom: '24px',
          padding: '0 !important',
          background: 'transparent !important',
          border: 'none !important',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%'
        }}>
          {formulas.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: 'var(--gray-500)',
              gridColumn: '1 / -1'
            }}>
              <p style={{ margin: '0', fontSize: '1rem' }}>
                No hay fórmulas registradas para este cliente
              </p>
            </div>
          ) : (
            formulas.map((formula, index) => {
              const formulasFormat = formatearFormula(formula);
              return (
                <div key={formula.id} style={{
                  background: index === 0 ? '#f0f9ff' : '#ffffff',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '10px',
                  padding: '18px',
                  position: 'relative',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {/* Badge de estado */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '0.7rem !important',
                    padding: '3px 8px !important',
                    borderRadius: '12px',
                    background: index === 0 ? '#3b82f6' : '#6b7280',
                    color: 'white',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    zIndex: '1'
                  }}>
                    {index === 0 ? 'ACTUAL' : 'HISTÓRICO'}
                  </div>

                  {/* Contenido principal */}
                  <div style={{ flex: '1' }}>
                    {/* Fecha */}
                    <div style={{ 
                      fontSize: '0.85rem !important',
                      color: 'var(--gray-600)',
                      fontWeight: '500',
                      marginBottom: '14px',
                      paddingRight: '60px'
                    }}>
                      {new Date(formula.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Valores ópticos */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '14px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '0.75rem !important',
                          color: 'var(--gray-500)',
                          marginBottom: '4px',
                          fontWeight: '500'
                        }}>
                          OJO DERECHO
                        </div>
                        <div style={{
                          fontSize: '0.95rem !important',
                          fontWeight: '600',
                          color: 'var(--gray-800)',
                          fontFamily: "'Roboto Mono', monospace",
                          minHeight: '20px',
                          lineHeight: '1.3'
                        }}>
                          {formulasFormat.ojoDerecho}
                        </div>
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.75rem !important',
                          color: 'var(--gray-500)',
                          marginBottom: '4px',
                          fontWeight: '500'
                        }}>
                          OJO IZQUIERDO
                        </div>
                        <div style={{
                          fontSize: '0.95rem !important',
                          fontWeight: '600',
                          color: 'var(--gray-800)',
                          fontFamily: "'Roboto Mono', monospace",
                          minHeight: '20px',
                          lineHeight: '1.3'
                        }}>
                          {formulasFormat.ojoIzquierdo}
                        </div>
                      </div>
                    </div>

                    {/* Tipo de lente */}
                    <div style={{ 
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      <span style={{
                        fontSize: '0.75rem !important',
                        color: 'var(--gray-500)',
                        whiteSpace: 'nowrap'
                      }}>
                        Tipo de lente:
                      </span>
                      <span style={{
                        fontSize: '0.8rem !important',
                        fontWeight: '600',
                        color: '#1e40af',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: '#dbeafe',
                        whiteSpace: 'nowrap'
                      }}>
                        {formula.tipoLente}
                      </span>
                    </div>
                  </div>

                  {/* Observaciones (si hay) */}
                  {formula.observaciones && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--gray-200)',
                      flexShrink: '0'
                    }}>
                      <div style={{
                        fontSize: '0.75rem !important',
                        color: 'var(--gray-500)',
                        marginBottom: '4px',
                        fontWeight: '500'
                      }}>
                        Observaciones:
                      </div>
                      <div style={{
                        fontSize: '0.8rem !important',
                        color: 'var(--gray-700)',
                        lineHeight: '1.3',
                        fontStyle: 'italic',
                        maxHeight: '40px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {formula.observaciones}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="crud-form-actions" style={{ 
          paddingTop: '20px',
          marginTop: '16px',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <button 
            onClick={() => navigate('/admin/ventas/clientes')}
            className="crud-btn crud-btn-secondary"
            style={{ padding: '10px 24px' }}
          >
            ← Volver a Clientes
          </button>
        </div>
      </div>
    </div>
  );
}