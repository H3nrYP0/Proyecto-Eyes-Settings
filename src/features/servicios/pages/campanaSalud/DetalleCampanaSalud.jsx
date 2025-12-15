import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCampanaSaludById } from '../../../../lib/data/campanasSaludData';
import { getEmpleadoById } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function VerCampanaSalud() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campana, setCampana] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const campanaData = getCampanaSaludById(Number(id));
        if (!campanaData) {
          navigate('/admin/servicios/campanas-salud');
          return;
        }
        
        setCampana(campanaData);

        if (campanaData.empleadoId) {
          const empleadoData = getEmpleadoById(campanaData.empleadoId);
          setEmpleado(empleadoData);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

  const obtenerTextoEstado = (estado) => {
    switch(estado) {
      case 'PLANIFICADA': return 'Planificada';
      case 'EN_CURSO': return 'En curso';
      case 'COMPLETADA': return 'Completada';
      case 'CANCELADA': return 'Cancelada';
      default: return estado || 'No especificado';
    }
  };

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando datos...
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
            No se encontró la campaña
          </div>
        </div>
      </div>
    );
  }

return (
  <div className="crud-form-container">
    <div className="crud-form-header">
      <h1>Detalle de Campaña de Salud</h1>
    </div>
    
    <div className="crud-form-content">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="crud-form-section">
          <div className="crud-form-group">
            <input
              type="text"
              className="crud-input-view uniform-size"
              value={campana.nombre || ''}
              readOnly
              disabled
              placeholder="Nombre de la Campaña"
            />
          </div>

          <div className="crud-form-group">
            <input
              type="text"
              className="crud-input-view uniform-size"
              value={campana.empresa || ''}
              readOnly
              disabled
              placeholder="Empresa"
            />
          </div>

          <div className="crud-form-group">
            <input
              type="text"
              className="crud-input-view uniform-size"
              value={campana.contacto_nombre || campana.contacto || ''}
              readOnly
              disabled
              placeholder="Contacto"
            />
          </div>

          <div className="crud-form-group">
            <input
              type="text"
              className="crud-input-view uniform-size"
              value={campana.contacto_telefono || ''}
              readOnly
              disabled
              placeholder="Teléfono de Contacto"
            />
          </div>

          <div className="crud-form-group">
            <input
              type="text"
              className="crud-input-view uniform-size"
              value={empleado ? `${empleado.nombre} - ${empleado.cargo || 'Sin cargo'}` : 'No asignado'}
              readOnly
              disabled
              placeholder="Empleado Responsable"
            />
          </div>

          <div className="crud-form-group">
            <input
              type="date"
              className="crud-input-view uniform-size"
              value={campana.fecha || ''}
              readOnly
              disabled
            />
          </div>

          <div className="crud-form-group">
            <input
              type="time"
              className="crud-input-view uniform-size"
              value={campana.hora_inicio || ''}
              readOnly
              disabled
            />
          </div>

          <div className="crud-form-group">
            <input
              type="time"
              className="crud-input-view uniform-size"
              value={campana.hora_fin || ''}
              readOnly
              disabled
            />
          </div>

          <div className="crud-form-group">
            <textarea
              className="crud-input-view uniform-size"
              value={campana.direccion || ''}
              readOnly
              disabled
              placeholder="Dirección"
              style={{ resize: 'none', height: '56px' }}
            />
          </div>

          <div className="crud-form-group">
            <input
              type="number"
              className="crud-input-view uniform-size"
              value={campana.participantes_estimados || ''}
              readOnly
              disabled
              placeholder="Participantes Estimados"
            />
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view uniform-size" style={{ display: 'flex', alignItems: 'center' }}>
              <span className={`crud-badge ${
                campana.estado === "EN_CURSO" ? "crud-badge-success" : 
                campana.estado === "PLANIFICADA" ? "crud-badge-warning" : 
                campana.estado === "COMPLETADA" ? "crud-badge-info" : "crud-badge-error"
              }`}>
                {obtenerTextoEstado(campana.estado)}
              </span>
            </div>
          </div>

          <div className="crud-form-group">
            <textarea
              className="crud-input-view uniform-size"
              value={campana.materiales || ''}
              readOnly
              disabled
              placeholder="Materiales"
              style={{ resize: 'none', height: '56px' }}
            />
          </div>

          <div className="crud-form-group">
            <textarea
              className="crud-input-view uniform-size"
              value={campana.observaciones || ''}
              readOnly
              disabled
              placeholder="Observaciones"
              style={{ resize: 'none', height: '56px' }}
            />
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            type="button" 
            className="crud-btn crud-btn-secondary"
            onClick={() => navigate('/admin/servicios/campanas-salud')}
          >
            Volver
          </button>
          <button 
            type="button" 
            className="crud-btn crud-btn-primary"
            onClick={() => navigate(`/admin/servicios/campanas-salud/editar/${campana.id}`)}
          >
            Editar Campaña
          </button>
        </div>
      </form>
    </div>
  </div>
);
}