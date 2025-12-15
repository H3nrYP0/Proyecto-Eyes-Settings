import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicioById } from '../../../../lib/data/serviciosData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData'; 
import { formatToPesos } from '../../../../shared/utils/formatCOP'; 
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleServicio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [empleadoNombre, setEmpleadoNombre] = useState('');

  useEffect(() => {
    const servicioData = getServicioById(Number(id));
    if (servicioData) {
      setServicio(servicioData);

      const empleados = getAllEmpleados();
      const empleado = empleados.find(emp => emp.nombre === servicioData.empleado);
      setEmpleadoNombre(empleado ? `${empleado.nombre} - ${empleado.cargo}` : 'Empleado no encontrado');
    }
  }, [id]);

  if (!servicio) {
    return <div className="crud-form-container" style={{ padding: '32px' }}>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Servicio: {servicio.nombre}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-form-group">
            <div className="crud-input-view">
              {servicio.nombre}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view" style={{ 
              minHeight: '56px',
              alignItems: 'flex-start',
              paddingTop: '12px'
            }}>
              {servicio.descripcion || ''}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {servicio.duracion || ''} minutos
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {formatToPesos(servicio.precio?.toString() || '0')}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {empleadoNombre}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {servicio.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/servicios')}
            className="crud-btn crud-btn-secondary"
          >
            Cancelar
          </button>
          <button 
            onClick={() => navigate(`/admin/servicios/editar/${servicio.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Servicio
          </button>
        </div>
      </div>
    </div>
  );
}