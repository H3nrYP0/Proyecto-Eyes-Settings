import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAgendaById, updateAgenda } from '../../../../lib/data/agendaData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarAgenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  
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

  // Cargar datos de la cita
  useEffect(() => {
    const cita = getAgendaById(Number(id));
    if (cita) {
      setFormData({
        cliente: cita.cliente,
        servicio: cita.servicio,
        empleado: cita.empleado,
        fecha: cita.fecha,
        hora: cita.hora,
        metodo_pago: cita.metodo_pago || '',
      });

      // Convertir fecha string a Date object
      if (cita.fecha) {
        const [year, month, day] = cita.fecha.split('-');
        setSelectedDate(new Date(year, month - 1, day));
      }

      // Convertir hora string a Date object
      if (cita.hora) {
        const [hours, minutes] = cita.hora.split(':');
        const timeDate = new Date();
        timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        setSelectedTime(timeDate);
      }
    }
  }, [id]);

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

    // Actualizar la cita
    updateAgenda(Number(id), {
      ...formData,
      fecha: fechaFormateada,
      hora: horaFormateada
    });
    
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
        <h1>Editar Cita</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            {/* Cliente - Ocupa toda la fila */}
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

            {/* Servicio y Empleado - Primera fila de 2 columnas */}
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

            {/* Fecha y Hora - Segunda fila de 2 columnas */}
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

            {/* Método de Pago - Ocupa toda la fila */}
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
              Actualizar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}