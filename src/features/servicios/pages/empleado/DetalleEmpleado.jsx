import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmpleadoById } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);

  useEffect(() => {
    const empleadoData = getEmpleadoById(Number(id));
    setEmpleado(empleadoData);
  }, [id]);

  if (!empleado) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Empleado: {empleado.nombre}</h1>
        <p>Información completa del empleado</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información Personal</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{empleado.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Tipo Documento:</strong> 
              <span>{empleado.tipo_documento}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Número Documento:</strong> 
              <span>{empleado.numero_documento}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Teléfono:</strong> 
              <span>{empleado.telefono}</span>
            </div>

            {empleado.email && (
              <div className="crud-detail-item">
                <strong>Email:</strong> 
                <span>{empleado.email}</span>
              </div>
            )}

            {empleado.direccion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Dirección:</strong> 
                <span>{empleado.direccion}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-section">
          <h3>Información Laboral</h3>
          
          <div className="crud-detail-grid">
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