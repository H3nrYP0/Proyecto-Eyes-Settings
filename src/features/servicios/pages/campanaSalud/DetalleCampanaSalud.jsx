import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampanaSaludById } from '../../../../lib/data/campanasSaludData';
import { getEmpleadoById } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleCampanaSalud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campana, setCampana] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const campanaData = getCampanaSaludById(Number(id));
    if (campanaData) {
      setCampana(campanaData);
      
      // Obtener información del empleado responsable
      if (campanaData.empleadoId) {
        const empleadoData = getEmpleadoById(campanaData.empleadoId);
        setEmpleado(empleadoData);
      }
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

  if (!campana) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Campaña no encontrada
          </div>
        </div>
      </div>
    );
  }

  // Función para formatear hora
  const formatearHora = (hora) => {
    if (!hora) return 'No especificada';
    const [hours, minutes] = hora.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Campaña de Salud</h1>
        <p>{campana.nombre}</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{campana.nombre || 'No especificado'}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Empresa:</strong> 
              <span>{campana.empresa || 'No especificada'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Contacto:</strong> 
              <span>{campana.contacto_nombre || campana.contacto || 'No especificado'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Teléfono Contacto:</strong> 
              <span>{campana.contacto_telefono || 'No especificado'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Empleado Responsable:</strong> 
              <span>{empleado ? `${empleado.nombre} - ${empleado.cargo || 'Sin cargo'}` : 'No asignado'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha:</strong> 
              <span>{campana.fecha || 'No especificada'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Hora Inicio:</strong> 
              <span>{formatearHora(campana.hora_inicio)}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Hora Fin:</strong> 
              <span>{formatearHora(campana.hora_fin)}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Participantes Estimados:</strong> 
              <span>{campana.participantes_estimados || 'No especificado'}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${
                campana.estado === "EN_CURSO" ? "crud-badge-success" : 
                campana.estado === "PLANIFICADA" ? "crud-badge-warning" : 
                campana.estado === "COMPLETADA" ? "crud-badge-info" : "crud-badge-error"
              }`}>
                {campana.estado === "PLANIFICADA" ? "Planificada" : 
                 campana.estado === "EN_CURSO" ? "En curso" : 
                 campana.estado === "COMPLETADA" ? "Completada" : "Cancelada"}
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
                {campana.direccion || 'No hay dirección disponible'}
              </div>
            </div>

            {campana.materiales && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Materiales:</strong> 
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}>
                  {campana.materiales}
                </div>
              </div>
            )}

            {campana.observaciones && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Observaciones:</strong> 
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}>
                  {campana.observaciones}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/servicios/campanas-salud')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/servicios/campanas-salud/editar/${campana.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Campaña
          </button>
        </div>
      </div>
    </div>
  );
}