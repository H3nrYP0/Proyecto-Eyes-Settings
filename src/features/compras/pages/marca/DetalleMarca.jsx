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
    return <div className="crud-form-container" style={{ padding: '32px' }}>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Marca: {marca.nombre}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          {/* Nombre */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {marca.nombre}
            </div>
          </div>

          {/* Estado */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              <span className={`crud-badge ${marca.estado === "activa" ? "crud-badge-success" : "crud-badge-error"}`}>
                {marca.estado === 'activa' ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>

          {/* Descripción - Ocupa toda la fila */}
          <div className="crud-form-group" style={{ gridColumn: '1 / -1' }}>
            <div className="crud-input-view" style={{ 
              minHeight: '80px',
              alignItems: 'flex-start',
              paddingTop: '16px',
              whiteSpace: 'pre-wrap'
            }}>
              {marca.descripcion || 'Sin descripción'}
            </div>
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