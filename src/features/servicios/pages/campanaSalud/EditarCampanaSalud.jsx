import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCampanaSaludById, updateCampanaSalud } from '../../../../lib/data/campanasSaludData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarCampanaSalud() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const campana = getCampanaSaludById(Number(id));
    if (campana) {
      setFormData(campana);
    } else {
      navigate('/admin/servicios/campanas-salud');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateCampanaSalud(Number(id), formData);
    navigate('/admin/servicios/campanas-salud');
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
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editando: {formData.nombre}</h1>
        <p>Modifica la información de la campaña</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información de la Campaña</h3>
            
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
                placeholder="Descripción detallada de la campaña..."
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="fechaInicio">Fecha de Inicio <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="fechaFin">Fecha de Fin <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="descuento">Descuento (%) <span className="crud-required">*</span></label>
                <input
                  type="number"
                  id="descuento"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleChange}
                  className="crud-input"
                  min="0"
                  max="100"
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
                  <option value="proxima">Próxima</option>
                  <option value="activa">Activa</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/servicios/campanas-salud')}
              className="crud-btn crud-btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Campaña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}