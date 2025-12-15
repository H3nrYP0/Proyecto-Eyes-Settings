import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmpleadoById } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const empleadoData = getEmpleadoById(Number(id));
    if (empleadoData) {
      // Adaptar datos si es necesario
      const empleadoAdaptado = {
        ...empleadoData,
        estado: empleadoData.estado === true || empleadoData.estado === 'activo' ? 'activo' : 'inactivo'
      };
      setEmpleado(empleadoAdaptado);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!empleado) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Empleado no encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Empleado</h1>
        <p>{empleado.nombre}</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{empleado.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Tipo de Documento:</strong> 
              <span>{empleado.tipoDocumento || empleado.tipo_documento}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Número de Documento:</strong> 
              <span>{empleado.numero_documento}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Teléfono:</strong> 
              <span>{empleado.telefono}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Correo Electrónico:</strong> 
              <span>{empleado.correo || empleado.email || 'No especificado'}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Cargo:</strong> 
              <span>{empleado.cargo}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha de Ingreso:</strong> 
              <span>{empleado.fecha_ingreso}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${empleado.estado === "activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {empleado.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
              <strong>Dirección:</strong> 
              <div style={{ 
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                {empleado.direccion || 'No especificada'}
              </div>
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/servicios/empleados')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/servicios/empleados/editar/${empleado.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Empleado
          </button>
        </div>
      </div>
    </div>
  );
}