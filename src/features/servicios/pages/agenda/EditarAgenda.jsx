import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getAgendaById, updateAgenda } from '../../../../lib/data/agendaData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarAgenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    cliente: '',
    servicio: '',
    empleado: '',
    metodo_pago: '',
    duracion: '',
    estado: ''
  });
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar datos de la cita
  useEffect(() => {
    const cita = getAgendaById(Number(id));
    if (cita) {
      setFormData({
        cliente: cita.cliente || '',
        servicio: cita.servicio || '',
        empleado: cita.empleado || '',
        metodo_pago: cita.metodo_pago || '',
        duracion: cita.duracion || '',
        estado: cita.estado || 'pendiente'
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
    setLoading(false);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.cliente.trim()) {
      newErrors.cliente = 'Debe ingresar un cliente';
    }
    
    if (!formData.servicio) {
      newErrors.servicio = 'Debe seleccionar un servicio';
    }
    
    if (!formData.empleado) {
      newErrors.empleado = 'Debe seleccionar un empleado';
    }
    
    if (!selectedDate) {
      newErrors.fecha = 'Debe seleccionar una fecha';
    }
    
    if (!selectedTime) {
      newErrors.hora = 'Debe seleccionar una hora';
    }
    
    if (!formData.duracion) {
      newErrors.duracion = 'La duración es requerida';
    } else if (Number(formData.duracion) <= 0) {
      newErrors.duracion = 'La duración debe ser mayor a 0';
    }
    
    if (!formData.estado) {
      newErrors.estado = 'Debe seleccionar un estado';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      hora: horaFormateada,
      duracion: Number(formData.duracion)
    });
    
    navigate('/admin/servicios/agenda');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editar Cita</h1>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Nombre del cliente"
                  required
                  variant="outlined"
                  error={!!errors.cliente}
                  helperText={errors.cliente}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.servicio}>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Servicio
                  </InputLabel>
                  <Select
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleChange}
                    label="Servicio"
                    required
                  >
                    <MenuItem value="">Seleccionar servicio</MenuItem>
                    <MenuItem value="Cita general">Cita general</MenuItem>
                    <MenuItem value="Campaña de salud">Campaña de salud</MenuItem>
                  </Select>
                  {errors.servicio && (
                    <FormHelperText error>{errors.servicio}</FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.empleado}>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Empleado
                  </InputLabel>
                  <Select
                    name="empleado"
                    value={formData.empleado}
                    onChange={handleChange}
                    label="Empleado"
                    required
                  >
                    <MenuItem value="">Seleccionar empleado</MenuItem>
                    <MenuItem value="Dr. Carlos Méndez">Dr. Carlos Méndez</MenuItem>
                    <MenuItem value="Dra. Ana Rodríguez">Dra. Ana Rodríguez</MenuItem>
                    <MenuItem value="Técnico Javier López">Técnico Javier López</MenuItem>
                  </Select>
                  {errors.empleado && (
                    <FormHelperText error>{errors.empleado}</FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="crud-form-group">
                <DatePicker
                  label="Fecha"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    if (errors.fecha) {
                      setErrors({ ...errors, fecha: '' });
                    }
                  }}
                  minDate={new Date()}
                  shouldDisableDate={(date) => {
                    const day = date.getDay();
                    return day === 0; // Excluir domingos
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.fecha}
                      helperText={errors.fecha}
                      InputLabelProps={{ style: { fontWeight: 'normal' } }}
                    />
                  )}
                />
              </div>

              <div className="crud-form-group">
                <TimePicker
                  label="Hora"
                  value={selectedTime}
                  onChange={(newValue) => {
                    setSelectedTime(newValue);
                    if (errors.hora) {
                      setErrors({ ...errors, hora: '' });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.hora}
                      helperText={errors.hora}
                      InputLabelProps={{ style: { fontWeight: 'normal' } }}
                    />
                  )}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Duración (minutos)"
                  name="duracion"
                  type="number"
                  value={formData.duracion}
                  onChange={handleChange}
                  placeholder="30"
                  required
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  error={!!errors.duracion}
                  helperText={errors.duracion}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">min</InputAdornment>,
                  }}
                />
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.estado}>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Estado de la Cita
                  </InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    label="Estado de la Cita"
                    required
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="confirmada">Confirmada</MenuItem>
                    <MenuItem value="en_proceso">En proceso</MenuItem>
                    <MenuItem value="completada">Completada</MenuItem>
                    <MenuItem value="cancelada">Cancelada</MenuItem>
                  </Select>
                  {errors.estado && (
                    <FormHelperText error>{errors.estado}</FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Método de Pago
                  </InputLabel>
                  <Select
                    name="metodo_pago"
                    value={formData.metodo_pago}
                    onChange={handleChange}
                    label="Método de Pago"
                  >
                    <MenuItem value="">Seleccionar método</MenuItem>
                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                    <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                    <MenuItem value="Transferencia">Transferencia</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="crud-form-group" style={{ opacity: 0 }}>
                <div style={{ height: '56px' }}></div>
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
    </LocalizationProvider>
  );
}