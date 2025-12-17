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
import { 
  getCampanaSaludById, 
  updateCampanaSalud 
} from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarCampanaSalud() {
  const { id } = useParams();
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
    const cargarDatos = async () => {
      try {
        const campana = getCampanaSaludById(Number(id));
        if (!campana) {
          navigate('/admin/servicios/campanas-salud');
          return;
        }

        setFormData({
          nombre: campana.nombre || '',
          empresa: campana.empresa || '',
          contacto_nombre: campana.contacto_nombre || campana.contacto || '',
          contacto_telefono: campana.contacto_telefono || '',
          empleadoId: campana.empleadoId ? String(campana.empleadoId) : '',
          fecha: campana.fecha || '',
          hora_inicio: campana.hora_inicio || '',
          hora_fin: campana.hora_fin || '',
          direccion: campana.direccion || '',
          participantes_estimados: campana.participantes_estimados || '',
          materiales: campana.materiales || '',
          estado: campana.estado || 'PLANIFICADA',
          observaciones: campana.observaciones || ''
        });

        const empleadosData = getAllEmpleados();
        const empleadosActivos = empleadosData.filter(
          emp => emp.estado === true || emp.estado === 'Activo'
        );
        setEmpleados(empleadosActivos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

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
      id: Number(id),
      empleadoId: Number(formData.empleadoId),
      participantes_estimados: formData.participantes_estimados
        ? Number(formData.participantes_estimados)
        : null
    };

    updateCampanaSalud(campanaData);

    setNotification({
      isVisible: true,
      message: 'Campaña actualizada correctamente',
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
            Cargando datos...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editar Campaña de Salud</h1>
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
                  placeholder="Nombre de la empresa organizadora"
                  required
                  variant="outlined"
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
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
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