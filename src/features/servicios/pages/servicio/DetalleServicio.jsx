import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicioById } from '../../../../lib/data/serviciosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleServicio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);

  useEffect(() => {
    const servicioData = getServicioById(Number(id));
    setServicio(servicioData);
  }, [id]);

  if (!servicio) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Servicio: {servicio.nombre}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{servicio.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Duración:</strong> 
              <span>{servicio.duracion} minutos</span>
            </div>

            <div className="crud-detail-item">
              <strong>Precio:</strong> 
              <span>${servicio.precio.toLocaleString()}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Empleado:</strong> 
              <span>{servicio.empleado}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${servicio.estado === "activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {servicio.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>

            {servicio.descripcion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Descripción:</strong> 
                <span>{servicio.descripcion}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/servicios')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
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