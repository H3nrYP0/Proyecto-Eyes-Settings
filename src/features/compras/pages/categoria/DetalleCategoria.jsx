import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoriaById } from '../../../../lib/data/categoriasData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const categoriaData = getCategoriaById(Number(id));
    setCategoria(categoriaData);
  }, [id]);

  if (!categoria) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Categoría: {categoria.nombre}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          {/* Nombre */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {categoria.nombre}
            </div>
          </div>

          {/* Estado */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              <span className={`crud-badge ${categoria.estado === "activa" ? "crud-badge-success" : "crud-badge-error"}`}>
                {categoria.estado === "activa" ? "Activa" : "Inactiva"}
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
              {categoria.descripcion || 'Sin descripción'}
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/compras/categorias')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button
            onClick={() => navigate(`/admin/compras/categorias/editar/${categoria.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Categoría
          </button>
        </div>
      </div>
    </div>
  );
}