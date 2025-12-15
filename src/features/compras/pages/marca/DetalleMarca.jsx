import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMarcaById } from '../../../../lib/data/marcasData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleMarca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marca, setMarca] = useState(null);

  useEffect(() => {
    const marcaData = getMarcaById(Number(id));
    setMarca(marcaData);
  }, [id]);

  if (!marca) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Marca: {marca.nombre}</h1>
        <p>Información completa de la marca</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información General</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{marca.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${marca.estado === "activa" ? "crud-badge-success" : "crud-badge-error"}`}>
                {marca.estado === "activa" ? "Activa" : "Inactiva"}
              </span>
            </div>

            {marca.descripcion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Descripción:</strong> 
                <span>{marca.descripcion}</span>
              </div>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/compras/marcas')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button
            onClick={() => navigate(`/admin/compras/marcas/editar/${marca.id}`)}
            className="crud-btn crud-btn-primary"
        >
            Editar Marca
        </button>
        </div>
      </div>
    </div>
  );
}