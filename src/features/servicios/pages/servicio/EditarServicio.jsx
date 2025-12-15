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
import { getServicioById, updateServicio } from "../../../../lib/data/serviciosData";
import { getAllEmpleados } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarServicio() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion_min: '',
    precio: '',
    empleadoId: '',
    estado: true
  });

  const [empleados, setEmpleados] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const servicio = getServicioById(Number(id));
    const empleadosData = getAllEmpleados();

    if (!servicio) {
      navigate('/admin/servicios');
      return;
    }

    setFormData({
      nombre: servicio.nombre || '',
      descripcion: servicio.descripcion || '',
      duracion_min: servicio.duracion_min || servicio.duracion || '',
      precio: servicio.precio || '',
      empleadoId: servicio.empleadoId || servicio.empleado || '',
      estado: servicio.estado === true || servicio.estado === 'activo'
    });

    const empleadosActivos = empleadosData.filter(
      emp => emp.estado === true || emp.estado === 'Activo'
    );
    setEmpleados(empleadosActivos);
    setLoading(false);
  }, [id, navigate]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
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
      newErrors.nombre = 'El nombre del servicio es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'Mínimo 3 caracteres';
    }

    if (!formData.duracion_min) {
      newErrors.duracion_min = 'La duración es requerida';
    } else {
      const duracion = Number(formData.duracion_min);
      if (isNaN(duracion) || duracion <= 0) {
        newErrors.duracion_min = 'Debe ser mayor a 0';
      } else if (duracion > 480) {
        newErrors.duracion_min = 'Máximo 480 minutos';
      }
    }

    if (formData.precio === '') {
      newErrors.precio = 'El precio es requerido';
    } else if (Number(formData.precio) < 0) {
      newErrors.precio = 'Debe ser mayor o igual a 0';
    }

    if (!formData.empleadoId) {
      newErrors.empleadoId = 'Debe seleccionar un empleado responsable';
    }

    if (formData.descripcion && formData.descripcion.length > 200) {
      newErrors.descripcion = 'Máximo 200 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const servicioData = {
      ...formData,
      duracion_min: Number(formData.duracion_min),
      precio: Number(formData.precio),
      empleadoId: Number(formData.empleadoId)
    };

    updateServicio(Number(id), servicioData);

    setNotification({
      isVisible: true,
      message: 'Servicio actualizado correctamente',
      type: 'success'
    });

    setTimeout(() => {
      navigate('/admin/servicios');
    }, 800);
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
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editar Servicio</h1>
          <p>Actualizando: {formData.nombre}</p>
        </div>

        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Nombre del Servicio"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  multiline
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </div>

              <div className="crud-form-row">
                <div className="crud-form-group">
                  <TextField
                    fullWidth
                    label="Duración (minutos)"
                    name="duracion_min"
                    type="number"
                    value={formData.duracion_min}
                    onChange={handleChange}
                    inputProps={{ min: 1, max: 480 }}
                    error={!!errors.duracion_min}
                    helperText={errors.duracion_min}
                  />
                </div>

                <div className="crud-form-group">
                  <TextField
                    fullWidth
                    label="Precio"
                    name="precio"
                    type="number"
                    value={formData.precio}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 100 }}
                    error={!!errors.precio}
                    helperText={errors.precio}
                    InputProps={{
                      startAdornment: <span style={{ marginRight: 6 }}>$</span>
                    }}
                  />
                </div>
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.empleadoId}>
                  <InputLabel>Empleado Responsable</InputLabel>
                  <Select
                    name="empleadoId"
                    value={formData.empleadoId}
                    onChange={handleChange}
                    label="Empleado Responsable"
                  >
                    <MenuItem value="">Seleccione un empleado</MenuItem>
                    {empleados.map(emp => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.nombre} - {emp.cargo || 'Sin cargo'}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.empleadoId}</FormHelperText>
                </FormControl>
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado ? 'Activo' : 'Inactivo'}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        estado: e.target.value === 'Activo'
                      }))
                    }
                    label="Estado"
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
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
                Actualizar Servicio
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
