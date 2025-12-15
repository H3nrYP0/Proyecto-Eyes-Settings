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
      
      <div className="crud-form-content" style={{ padding: '0px' }}>
        <form>
          <div className="crud-form-section">
            {/* Nombre */}
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={marca.nombre || ''}
                disabled
                className="crud-input"
                placeholder="Ej: Ray-Ban, Oakley, etc."
              />
            </div>

            {/* Descripción (ocupa toda la fila) */}
            <div className="crud-form-group ">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={marca.descripcion || ''}
                disabled
                rows="3"
                className="crud-input crud-textarea"
                placeholder="Descripción de la marca..."
              />
            </div>

            {/* Estado - Nuevo campo que faltaba en el detalle original */}
            <div className="crud-form-group">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={marca.estado === 'activa' ? 'Activa' : 'Inactiva'}
                disabled
                className="crud-input"
              />
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
        </form>
      </div>
    </div>
  );
}