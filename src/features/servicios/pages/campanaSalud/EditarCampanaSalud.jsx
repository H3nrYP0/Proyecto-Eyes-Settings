import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import { getCampanaSaludById, updateCampanaSalud } from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"; // Para notificaciones

export default function EditarCampanaSalud() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [empleados, setEmpleados] = useState([]);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 👇 Para la validación de cambios
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    empresa: '',
    contacto: '',
    fecha: '',
    hora: '',
    direccion: '',
    observaciones: '',
    empleadoId: '',
    estado: 'activa'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  // Cargar empleados
  useEffect(() => {
    const empleadosList = getAllEmpleados();
    const empleadosActivos = empleadosList.filter(empleado => empleado.estado === 'activo');
    setEmpleados(empleadosActivos);
  }, []);

  // Cargar datos de la campaña
  useEffect(() => {
    if (!id) return;
    const campana = getCampanaSaludById(Number(id));
    const empleadosData = getAllEmpleados();
    
    if (campana) {
      // Adaptar datos del formulario anterior al nuevo formato
      const datosAdaptados = {
        nombre: campana.nombre || '',
        empresa: campana.empresa || '',
        contacto_nombre: campana.contacto_nombre || campana.contacto || '',
        contacto_telefono: campana.contacto_telefono || '',
        empleadoId: campana.empleadoId || campana.empleado || '',
        fecha: campana.fecha || campana.fechaInicio || '',
        hora_inicio: campana.hora_inicio || '',
        hora_fin: campana.hora_fin || '',
        direccion: campana.direccion || '',
        participantes_estimados: campana.participantes_estimados || '',
        materiales: campana.materiales || campana.descripcion || '',
        estado: campana.estado || 'PLANIFICADA',
        observaciones: campana.observaciones || ''
      };
      setFormData(datosAdaptados);
    } else {
      navigate('/admin/servicios/campanas-salud');
    }
    
    const empleadosActivos = empleadosData.filter(emp => emp.estado === true || emp.estado === 'Activo');
    setEmpleados(empleadosActivos);
    setLoading(false);
  }, [id, navigate]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 👇 FUNCIÓN CORREGIDA: Verificar si es domingo (hora local)
  const isSunday = (dateString) => {
    if (!dateString) return false;
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.getDay() === 0;
  };

  // 👇 Manejar el input de contacto (máximo 10 dígitos)
  const handleContactoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setFormData({
      ...formData,
      contacto: value
    });
  };

  // 👇 Generar opciones de hora (6AM - 6PM)
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let hora = 6; hora <= 18; hora++) {
      opciones.push(`${hora.toString().padStart(2, '0')}:00`);
      if (hora < 18) {
        opciones.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
    return opciones;
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
    }
    
    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }
    
    if (!formData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es requerida';
    } else if (formData.hora_inicio && formData.hora_fin) {
      if (formData.hora_fin <= formData.hora_inicio) {
        newErrors.hora_fin = 'La hora de fin debe ser mayor a la hora de inicio';
      }
    }
    
    if (formData.participantes_estimados && Number(formData.participantes_estimados) < 1) {
      newErrors.participantes_estimados = 'Debe ser mayor a 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const campanaData = {
      ...formData,
      empleadoId: Number(formData.empleadoId),
      participantes_estimados: formData.participantes_estimados ? Number(formData.participantes_estimados) : null
    };
    
    updateCampanaSalud(Number(id), campanaData);
    navigate('/admin/servicios/campanas-salud');
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

  if (loading || !formData) {
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
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editar Campaña de Salud</h1>
        <p>Actualizando: {formData.nombre}</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre de la Campaña"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Chequeo Visual Gratuito, Descuento en Lentes de Sol"
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Nombre de la empresa organizadora"
                required
                variant="outlined"
                error={!!errors.empresa}
                helperText={errors.empresa}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Contacto"
                  name="contacto_nombre"
                  value={formData.contacto_nombre}
                  onChange={handleChange}
                  placeholder="Nombre de la persona de contacto"
                  variant="outlined"
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
                  placeholder="Número de teléfono"
                  variant="outlined"
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
                  required
                >
                  <MenuItem value="">Seleccionar empleado</MenuItem>
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.id} value={empleado.id}>
                      {empleado.nombre} - {empleado.cargo || 'Sin cargo'}
                    </MenuItem>
                  ))}
                </Select>
                {errors.empleadoId && (
                  <FormHelperText error>{errors.empleadoId}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    style: { fontWeight: 'normal' }
                  }}
                  error={!!errors.fecha}
                  helperText={errors.fecha}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Hora Inicio"
                  name="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    style: { fontWeight: 'normal' }
                  }}
                  error={!!errors.hora_inicio}
                  helperText={errors.hora_inicio}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Hora Fin"
                  name="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    style: { fontWeight: 'normal' }
                  }}
                  error={!!errors.hora_fin}
                  helperText={errors.hora_fin}
                />
              </div>
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección donde se realizará la campaña"
                variant="outlined"
                multiline
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Participantes Estimados"
                name="participantes_estimados"
                type="number"
                value={formData.participantes_estimados}
                onChange={handleChange}
                placeholder="Número estimado de participantes"
                variant="outlined"
                inputProps={{ min: 1 }}
                error={!!errors.participantes_estimados}
                helperText={errors.participantes_estimados}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Materiales"
                name="materiales"
                value={formData.materiales}
                onChange={handleChange}
                placeholder="Materiales necesarios para la campaña"
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
                placeholder="Observaciones adicionales"
                variant="outlined"
                multiline
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <FormControl fullWidth>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Estado
                </InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="PLANIFICADA">Planificada</MenuItem>
                  <MenuItem value="EN_CURSO">En curso</MenuItem>
                  <MenuItem value="COMPLETADA">Completada</MenuItem>
                  <MenuItem value="CANCELADA">Cancelada</MenuItem>
                </Select>
              </FormControl>
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
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Campaña
            </button>
          </div>
        </form>
      </div>

      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
    </>
  );
}