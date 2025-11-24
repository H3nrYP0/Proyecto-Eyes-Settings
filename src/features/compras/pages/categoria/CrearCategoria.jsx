import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategoria } from '../../../../lib/data/categoriasData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearCategoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear la categoría
    const nuevaCategoria = createCategoria(formData);
    console.log('Categoría creada:', nuevaCategoria);
    navigate('/admin/compras/categorias');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nueva Categoría</h1>
        <p>Registra una nueva categoría para organizar productos</p>
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
                placeholder="Ej: Lentes de Sol, Monturas, etc."
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
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
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/compras/categorias')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}