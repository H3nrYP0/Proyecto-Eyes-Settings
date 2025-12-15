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
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Cliente:</strong> 
              <span>{cita.cliente}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Servicio:</strong> 
              <span>{cita.servicio}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Empleado:</strong> 
              <span>{cita.empleado}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha:</strong> 
              <span>{cita.fecha}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Hora:</strong> 
              <span>{cita.hora}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Duración:</strong> 
              <span>{cita.duracion} minutos</span>
            </div>

            <div className="crud-detail-item">
              <strong>Método de Pago:</strong> 
              <span>{cita.metodo_pago || 'No especificado'}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${cita.estado === "completada" ? "crud-badge-success" : cita.estado === "pendiente" ? "crud-badge-warning" : "crud-badge-error"}`}>
                {cita.estado === "pendiente" ? "Pendiente" : cita.estado === "completada" ? "Completada" : "Cancelada"}
              </span>
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/servicios/agenda')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
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