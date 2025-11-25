import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import { getServicioById, updateServicio } from "../../../../lib/data/serviciosData";
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarServicio() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const servicio = getServicioById(Number(id));
    if (servicio) {
      setFormData(servicio);
    } else {
      navigate('/admin/servicios');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateServicio(Number(id), formData);
    navigate('/admin/servicios');
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
      title="✏️ Editar Servicio"
      description={`Modifica la información del servicio`}
    >
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
          <p>Modifica la información del servicio</p>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <h3>Información del Servicio</h3>
              
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
                  placeholder="Descripción del servicio..."
                />
              </div>

              <div className="crud-form-row">
                <div className="crud-form-group">
                  <label htmlFor="duracion">Duración (min) <span className="crud-required">*</span></label>
                  <input
                    type="number"
                    id="duracion"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    className="crud-input"
                    min="1"
                    required
                  />
                </div>

                <div className="crud-form-group">
                  <label htmlFor="precio">Precio <span className="crud-required">*</span></label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="crud-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="crud-form-group">
                <label htmlFor="empleado">Empleado <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="empleado"
                  name="empleado"
                  value={formData.empleado}
                  onChange={handleChange}
                  className="crud-input"
                  required
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
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="crud-form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/admin/servicios')}
                className="crud-btn crud-btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
              >
                Actualizar Servicio
              </button>
            </div>
          </form>
        </div>
      </div>
    </CrudLayout>
  );
}