import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById } from '../../../../lib/data/clientesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const clienteData = getClienteById(Number(id));
    setCliente(clienteData);
  }, [id]);

  if (!cliente) {
    return <div style={{ 
      textAlign: 'center', 
      padding: '40px',
      color: 'var(--gray-600)'
    }}>Cargando información del cliente...</div>;
  }

  return (
    <div className="crud-form-container" style={{ maxWidth: '1100px' }}>
      <div className="crud-form-header" style={{ padding: '20px 32px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
          {cliente.nombre} {cliente.apellido}
        </h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.9 }}>
          Información detallada del cliente
        </p>
      </div>
      
      <div className="crud-form-content" style={{ padding: '0 32px 32px' }}>
        <div className="crud-form-section" style={{ 
          background: 'transparent', 
          border: 'none', 
          padding: '0',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            fontSize: '1.3rem',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '3px solid var(--primary-color)'
          }}>
            Información Personal
          </h3>
          
          <div className="crud-detail-grid" style={{ gap: '16px' }}>
            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Nombre:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.nombre}</span>
            </div>
            
            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Apellido:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.apellido}</span>
            </div>

            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Tipo Documento:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.tipoDocumento}</span>
            </div>

            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Número Documento:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.documento}</span>
            </div>

            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Teléfono:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.telefono}</span>
            </div>

            {cliente.correo && (
              <div className="crud-detail-item" style={{ minHeight: '85px' }}>
                <strong>Correo Electrónico:</strong> 
                <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.correo}</span>
              </div>
            )}

            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Fecha de Nacimiento:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                {new Date(cliente.fechaNacimiento).toLocaleDateString('es-ES')}
              </span>
            </div>

            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Género:</strong> 
              <span className={`genero-badge ${cliente.genero.toLowerCase()}`} style={{ 
                padding: '6px 16px',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                {cliente.genero}
              </span>
            </div>

            <div className="crud-detail-item" style={{ minHeight: '85px' }}>
              <strong>Ciudad:</strong> 
              <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.ciudad}</span>
            </div>

            {cliente.direccion && (
              <div className="crud-detail-item" style={{ 
                gridColumn: '1 / 3',
                minHeight: '85px'
              }}>
                <strong>Dirección:</strong> 
                <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>{cliente.direccion}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions" style={{ 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '2px solid var(--gray-200)'
        }}>
          <button 
            onClick={() => navigate('/admin/ventas/clientes')}
            className="crud-btn crud-btn-secondary"
            style={{ padding: '12px 28px', fontSize: '1rem' }}
          >
            ← Volver a Lista de Clientes
          </button>
        </div>
      </div>
    </div>
  );
}