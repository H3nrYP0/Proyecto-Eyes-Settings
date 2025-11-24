import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgendaById, updateAgenda } from '../../../../lib/data/agendaData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarAgenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const cita = getAgendaById(Number(id));
    if (cita) {
      setFormData(cita);
    } else {
      navigate('/admin/servicios/agenda');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateAgenda(Number(id), formData);
    navigate('/admin/servicios/agenda');
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
        <h1>Editando Cita: {formData.cliente}</h1>
        <p>Modifica la información de la cita</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información de la Cita</h3>
            
            <div className="crud-form-group">
              <label htmlFor="cliente">Cliente <span className="crud-required">*</span></label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="servicio">Servicio <span className="crud-required">*</span></label>
                <select
                  id="servicio"
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="Examen de la Vista">Examen de la Vista</option>
                  <option value="Adaptación Lentes de Contacto">Adaptación Lentes de Contacto</option>
                  <option value="Limpieza y Ajuste de Monturas">Limpieza y Ajuste de Monturas</option>
                </select>
              </div>

              <div className="crud-form-group">
                <label htmlFor="empleado">Empleado <span className="crud-required">*</span></label>
                <select
                  id="empleado"
                  name="empleado"
                  value={formData.empleado}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="Dr. Carlos Méndez">Dr. Carlos Méndez</option>
                  <option value="Dra. Ana Rodríguez">Dra. Ana Rodríguez</option>
                  <option value="Técnico Javier López">Técnico Javier López</option>
                </select>
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="fecha">Fecha <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="hora">Hora <span className="crud-required">*</span></label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>
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
                <label htmlFor="metodo_pago">Método de Pago</label>
                <select
                  id="metodo_pago"
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                  className="crud-input"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
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
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/servicios/agenda')}
              className="crud-btn crud-btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}