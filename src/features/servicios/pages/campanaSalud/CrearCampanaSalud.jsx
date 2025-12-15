import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampanaSalud } from '../../../../lib/data/campanasSaludData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearCampanaSalud() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    descuento: '',
    estado: 'proxima'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear la campaña
    const nuevaCampana = createCampanaSalud({
      ...formData,
      descuento: Number(formData.descuento)
    });
    console.log('Campaña creada:', nuevaCampana);
    navigate('/admin/servicios/campanas-salud');
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
        <h1>Crear Nueva Campaña de Salud</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">        
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="crud-input"
                placeholder="Ej: Chequeo Visual Gratuito, Descuento en Lentes de Sol, etc."
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
                  placeholder="20"
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
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/servicios/campanas-salud')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Campaña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}