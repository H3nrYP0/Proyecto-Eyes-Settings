import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import { getMarcaById, updateMarca } from "../../../../lib/data/marcasData";
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarMarca() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const marca = getMarcaById(Number(id));
    if (marca) {
      setFormData(marca);
    } else {
      navigate('/admin/compras/marcas');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateMarca(Number(id), formData);
    navigate('/admin/compras/marcas');
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
      title="✏️ Editar Marca"
      description={`Modifica la información de la marca`}
    >
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
          <p>Modifica la información de la marca</p>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <h3>Información de la Marca</h3>
              
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
                  placeholder="Descripción de la marca..."
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
                onClick={() => navigate('/admin/compras/marcas')}
                className="crud-btn crud-btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
              >
                Actualizar Marca
              </button>
            </div>
          </form>
        </div>
      </div>
    </CrudLayout>
  );
}