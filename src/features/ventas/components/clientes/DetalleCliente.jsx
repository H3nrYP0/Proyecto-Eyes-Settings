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
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: 'var(--gray-600)'
          }}>
            Cargando información del cliente...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container" style={{ maxWidth: '1000px' }}>
      <div className="crud-form-header">
        <h1>{cliente.nombre} {cliente.apellido}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          {/* Nombre */}
          <div className="crud-form-group">
            <label className="crud-label">Nombre</label>
            <div className="crud-input-view">
              {cliente.nombre}
            </div>
          </div>

          {/* Apellido */}
          <div className="crud-form-group">
            <label className="crud-label">Apellido</label>
            <div className="crud-input-view">
              {cliente.apellido}
            </div>
          </div>

          {/* Tipo Documento */}
          <div className="crud-form-group">
            <label className="crud-label">Tipo Documento</label>
            <div className="crud-input-view">
              {cliente.tipoDocumento}
            </div>
          </div>

          {/* Número Documento */}
          <div className="crud-form-group">
            <label className="crud-label">Número Documento</label>
            <div className="crud-input-view" style={{ 
              fontWeight: '600',
              color: 'var(--primary-color)'
            }}>
              {cliente.documento}
            </div>
          </div>

          {/* Teléfono */}
          <div className="crud-form-group">
            <label className="crud-label">Teléfono</label>
            <div className="crud-input-view">
              {cliente.telefono}
            </div>
          </div>

          {/* Correo Electrónico (si existe) */}
          {cliente.correo && (
            <div className="crud-form-group">
              <label className="crud-label">Correo Electrónico</label>
              <div className="crud-input-view">
                {cliente.correo}
              </div>
            </div>
          )}

          {/* Campo vacío para emparejar */}
          {!cliente.correo && (
            <div className="crud-form-group empty-field"></div>
          )}

          {/* Fecha de Nacimiento */}
          <div className="crud-form-group">
            <label className="crud-label">Fecha de Nacimiento</label>
            <div className="crud-input-view">
              {new Date(cliente.fechaNacimiento).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Género */}
          <div className="crud-form-group">
            <label className="crud-label">Género</label>
            <div className="crud-input-view">
              <span className={`crud-badge ${cliente.genero.toLowerCase()}`}>
                {cliente.genero}
              </span>
            </div>
          </div>

          {/* Ciudad */}
          <div className="crud-form-group">
            <label className="crud-label">Ciudad</label>
            <div className="crud-input-view">
              {cliente.ciudad}
            </div>
          </div>

          {/* Dirección (si existe) - full width */}
          {cliente.direccion && (
            <div className="crud-form-group full-width">
              <label className="crud-label">Dirección</label>
              <div className="crud-input-view" style={{ 
                minHeight: '56px',
                alignItems: 'flex-start',
                paddingTop: '16.5px'
              }}>
                {cliente.direccion}
              </div>
            </div>
          )}
        </div>

        <div className="crud-form-actions">
          <button 
            type="button"
            onClick={() => navigate('/admin/ventas/clientes')}
            className="crud-btn crud-btn-secondary"
          >
            ← Volver a Lista de Clientes
          </button>
        </div>
      </div>
    </div>
  );
}