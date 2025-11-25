import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import { getCategoriaById, updateCategoria } from "../../../../lib/data/categoriasData";
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const categoria = getCategoriaById(Number(id));
    if (categoria) {
      setFormData(categoria);
    } else {
      navigate('/admin/compras/categorias');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateCategoria(Number(id), formData);
    navigate('/admin/compras/categorias');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!formData) {
    return <div>Cargando...</div>;
  }

  return (
    <CrudLayout
      title="✏️ Editar Categoría"
      description={`Modifica la información de la categoría`}
    >
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
          <p>Modifica la información de la categoría</p>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <h3>Información de la Categoría</h3>
              
              <div className="crud-form-group">
                <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  rows="3"
                  className="crud-input crud-textarea"
                  placeholder="Descripción de la categoría..."
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="crud-input"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>

            <div className="crud-form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/admin/compras/categorias')}
                className="crud-btn crud-btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
              >
                Actualizar Categoría
              </button>
            </div>
          </form>
        </div>
      </div>
    </CrudLayout>
  );
}