import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampanaSaludById } from '../../../../lib/data/campanasSaludData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleCampanaSalud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campana, setCampana] = useState(null);

  useEffect(() => {
    const campanaData = getCampanaSaludById(Number(id));
    setCampana(campanaData);
  }, [id]);

  if (!campana) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Campaña: {campana.nombre}</h1>
        <p>Información completa de la campaña de salud</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información General</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{campana.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Descuento:</strong> 
              <span>{campana.descuento}%</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha de Inicio:</strong> 
              <span>{campana.fechaInicio}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha de Fin:</strong> 
              <span>{campana.fechaFin}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${
                campana.estado === "activa" ? "crud-badge-success" : 
                campana.estado === "proxima" ? "crud-badge-warning" : 
                campana.estado === "finalizada" ? "crud-badge-info" : "crud-badge-error"
              }`}>
                {campana.estado === "activa" ? "Activa" : 
                 campana.estado === "proxima" ? "Próxima" : 
                 campana.estado === "finalizada" ? "Finalizada" : "Inactiva"}
              </span>
            </div>

            {campana.descripcion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Descripción:</strong> 
                <span>{campana.descripcion}</span>
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
        </div>
      </div>
    </div>
  );
}