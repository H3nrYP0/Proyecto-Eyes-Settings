import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createServicio } from '../../../../lib/data/serviciosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearServicio() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    empleado: '',
    estado: 'activo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el servicio
    const nuevoServicio = createServicio({
      ...formData,
      duracion: Number(formData.duracion),
      precio: Number(formData.precio)
    });
    console.log('Servicio creado:', nuevoServicio);
    navigate('/admin/servicios');
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
        <h1>Crear Nuevo Servicio</h1>
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
                placeholder="Ej: Examen de la Vista, Adaptación Lentes de Contacto, etc."
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
                  placeholder="30"
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
                  placeholder="50000"
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
                placeholder="Ej: Dr. Carlos Méndez"
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
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/servicios')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}