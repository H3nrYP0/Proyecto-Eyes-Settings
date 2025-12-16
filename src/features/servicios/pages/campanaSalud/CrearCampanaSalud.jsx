import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import { createCampanaSalud } from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function CrearCampanaSalud() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    contacto_nombre: '',
    contacto_telefono: '',
    empleadoId: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    direccion: '',
    participantes_estimados: '',
    materiales: '',
    estado: 'PLANIFICADA',
    observaciones: ''
  });

  useEffect(() => {
    const empleadosData = getAllEmpleados();
    const empleadosActivos = empleadosData.filter(
      emp => emp.estado === true || emp.estado === 'Activo'
    );
    setEmpleados(empleadosActivos);
    setLoading(false);
  }, []);

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la campaña es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'Mínimo 3 caracteres';
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'El nombre de la empresa es requerido';
    }

    if (!formData.empleadoId) {
      newErrors.empleadoId = 'Debe seleccionar un empleado responsable';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        newErrors.fecha = 'La fecha no puede ser pasada';
      }
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es requerida';
    } else if (
      formData.hora_inicio &&
      formData.hora_fin &&
      formData.hora_fin <= formData.hora_inicio
    ) {
      newErrors.hora_fin = 'La hora de fin debe ser mayor a la hora de inicio';
    }

    if (
      formData.participantes_estimados &&
      Number(formData.participantes_estimados) < 1
    ) {
      newErrors.participantes_estimados = 'Debe ser mayor a 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const campanaData = {
      ...formData,
      empleadoId: Number(formData.empleadoId),
      participantes_estimados: formData.participantes_estimados
        ? Number(formData.participantes_estimados)
        : null,
      estado: 'PLANIFICADA'
    };

    createCampanaSalud(campanaData);

    setNotification({
      isVisible: true,
      message: 'Campaña creada correctamente',
      type: 'success'
    });

    setTimeout(() => {
      navigate('/admin/servicios/campanas-salud');
    }, 800);
  };

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando empleados...
          </div>
        </div>
      </div>
    );
  }

return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Crear Nueva Campaña de Salud</h1>
        </div>

        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
             

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                  error={!!errors.empresa}
                  helperText={errors.empresa}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Contacto"
                  name="contacto_nombre"
                  value={formData.contacto_nombre}
                  onChange={handleChange}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Teléfono de Contacto"
                  name="contacto_telefono"
                  value={formData.contacto_telefono}
                  onChange={handleChange}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.empleadoId}>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Empleado Responsable
                  </InputLabel>
                  <Select
                    name="empleadoId"
                    value={formData.empleadoId}
                    onChange={handleChange}
                    label="Empleado Responsable"
                  >
                    <MenuItem value="">Seleccionar empleado</MenuItem>
                    {empleados.map(emp => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.nombre} - {emp.cargo || 'Sin cargo'}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>{errors.empleadoId}</FormHelperText>
                </FormControl>
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, style: { fontWeight: 'normal' } }}
                  error={!!errors.fecha}
                  helperText={errors.fecha}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  type="time"
                  label="Hora Inicio"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, style: { fontWeight: 'normal' } }}
                  error={!!errors.hora_inicio}
                  helperText={errors.hora_inicio}
                />
              </div>

           

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

             
              
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
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
    </>
  );
}