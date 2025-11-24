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
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Cliente: {cliente.nombre} {cliente.apellido}</h1>
        <p>Información completa del cliente</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información Personal</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{cliente.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Apellido:</strong> 
              <span>{cliente.apellido}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Tipo Documento:</strong> 
              <span>{cliente.tipoDocumento}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Número Documento:</strong> 
              <span>{cliente.documento}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Teléfono:</strong> 
              <span>{cliente.telefono}</span>
            </div>

            {cliente.correo && (
              <div className="crud-detail-item">
                <strong>Correo Electrónico:</strong> 
                <span>{cliente.correo}</span>
              </div>
            )}

            <div className="crud-detail-item">
              <strong>Fecha de Nacimiento:</strong> 
              <span>{new Date(cliente.fechaNacimiento).toLocaleDateString('es-ES')}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Género:</strong> 
              <span className={`genero-badge ${cliente.genero.toLowerCase()}`}>
                {cliente.genero}
              </span>
            </div>

            <div className="crud-detail-item">
              <strong>Ciudad:</strong> 
              <span>{cliente.ciudad}</span>
            </div>

            {cliente.direccion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Dirección:</strong> 
                <span>{cliente.direccion}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/ventas/clientes')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}