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
        <p>Información completa de la categoría</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información General</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{categoria.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${categoria.estado === "activa" ? "crud-badge-success" : "crud-badge-error"}`}>
                {categoria.estado === "activa" ? "Activa" : "Inactiva"}
              </span>
            </div>

            {categoria.descripcion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Descripción:</strong> 
                <span>{categoria.descripcion}</span>
              </div>
            )}
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