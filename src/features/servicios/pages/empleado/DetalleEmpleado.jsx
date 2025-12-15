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
          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.nombre}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.tipoDocumento || empleado.tipo_documento}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.numero_documento}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.telefono}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.correo || empleado.email || 'No especificado'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view" style={{ 
              minHeight: '56px',
              alignItems: 'flex-start',
              paddingTop: '12px'
            }}>
              {empleado.direccion || 'No especificada'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.cargo}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleado.fecha_ingreso}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
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
            Cancelar
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