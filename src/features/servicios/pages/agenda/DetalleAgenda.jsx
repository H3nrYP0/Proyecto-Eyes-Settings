import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgendaById } from '../../../../lib/data/agendaData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleAgenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cita, setCita] = useState(null);

  useEffect(() => {
    const citaData = getAgendaById(Number(id));
    setCita(citaData);
  }, [id]);

  if (!cita) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Cita: {cita.cliente}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.cliente}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.servicio}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.empleado}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.fecha}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.hora}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.duracion} minutos
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              <span className={`crud-badge ${cita.estado === "completada" ? "crud-badge-success" : cita.estado === "pendiente" ? "crud-badge-warning" : "crud-badge-error"}`}>
                {cita.estado === "pendiente" ? "Pendiente" : cita.estado === "completada" ? "Completada" : "Cancelada"}
              </span>
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cita.metodo_pago || 'No especificado'}
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/servicios/agenda')}
            className="crud-btn crud-btn-secondary"
          >
            Cancelar
          </button>
          <button 
            onClick={() => navigate(`/admin/servicios/agenda/editar/${cita.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Cita
          </button>
        </div>
      </div>
    </div>
  );
}