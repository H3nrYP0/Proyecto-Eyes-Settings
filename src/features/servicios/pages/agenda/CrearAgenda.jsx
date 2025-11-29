import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAgenda } from '../../../../lib/data/agendaData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearAgenda() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: '',
    servicio: '',
    empleado: '',
    fecha: '',
    hora: '',
    metodo_pago: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Por favor selecciona una fecha');
      return;
    }

    if (!selectedTime) {
      alert('Por favor selecciona una hora');
      return;
    }
    
    // Formatear fecha a YYYY-MM-DD
    const fechaFormateada = selectedDate.toISOString().split('T')[0];
    
    // Formatear hora a HH:MM
    const horaFormateada = selectedTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    const nuevaCita = createAgenda({
      ...formData,
      fecha: fechaFormateada,
      hora: horaFormateada
    });
    
    console.log('Cita creada:', nuevaCita);
    navigate('/admin/servicios/agenda');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Excluir domingos
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0; // 0 es domingo
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nueva Cita</h1>
        <p>Programa una nueva cita para un cliente</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información de la Cita</h3>
            
            <div className="crud-form-group full-width">
              <label htmlFor="cliente">Cliente <span className="crud-required">*</span></label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="crud-input"
                placeholder="Nombre del cliente"
                required
              />
            </div>

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
                <option value="">Seleccionar servicio</option>
                <option value="Cita general">Cita general</option>
                <option value="Campaña de salud">Campaña de salud</option>
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
                <option value="">Seleccionar empleado</option>
                <option value="Dr. Carlos Méndez">Dr. Carlos Méndez</option>
                <option value="Dra. Ana Rodríguez">Dra. Ana Rodríguez</option>
                <option value="Técnico Javier López">Técnico Javier López</option>
              </select>
            </div>

            <div className="crud-form-group">
              <label>Fecha <span className="crud-required">*</span></label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                filterDate={isWeekday}
                dateFormat="dd/MM/yyyy"
                className="crud-input"
                placeholderText="Seleccionar fecha"
                required
              />
            </div>

            <div className="crud-form-group">
              <label>Hora <span className="crud-required">*</span></label>
              <DatePicker
                selected={selectedTime}
                onChange={setSelectedTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Hora"
                dateFormat="h:mm aa"
                minTime={new Date(0, 0, 0, 6, 0)} // 6:00 AM
                maxTime={new Date(0, 0, 0, 15, 0)} // 3:00 PM
                className="crud-input"
                placeholderText="Seleccionar hora"
                required
              />
            </div>

            <div className="crud-form-group full-width">
              <label htmlFor="metodo_pago">Método de Pago</label>
              <select
                id="metodo_pago"
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleChange}
                className="crud-input"
              >
                <option value="">Seleccionar método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/servicios/agenda')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}