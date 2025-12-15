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

export default function EditarServicio() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar servicio y empleados simultáneamente
    const servicio = getServicioById(Number(id));
    const empleadosData = getAllEmpleados();
    
    if (servicio) {
      // Adaptar datos del formulario anterior al nuevo formato
      const datosAdaptados = {
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        duracion_min: servicio.duracion_min || servicio.duracion || '',
        precio: servicio.precio || '',
        empleadoId: servicio.empleadoId || servicio.empleado || '',
        estado: servicio.estado === true || servicio.estado === 'activo'
      };
      setFormData(datosAdaptados);
    } else {
      navigate('/admin/servicios');
    }
    
    // Filtrar solo empleados activos
    const empleadosActivos = empleadosData.filter(emp => emp.estado === true || emp.estado === 'Activo');
    setEmpleados(empleadosActivos);
    setLoading(false);
  }, [id, navigate]);

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
        newErrors.duracion_min = 'La duración debe ser mayor a 0';
      } else if (duracion > 480) {
        newErrors.duracion_min = 'La duración máxima es 480 minutos (8 horas)';
      }
    }
    
    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else {
      const precio = Number(formData.precio);
      if (isNaN(precio) || precio < 0) {
        newErrors.precio = 'El precio debe ser mayor o igual a 0';
      }
    }
    
    if (!formData.empleadoId) {
      newErrors.empleadoId = 'Debe seleccionar un empleado responsable';
    }
    
    if (formData.descripcion.trim().length > 200) {
      newErrors.descripcion = 'La descripción no puede exceder 200 caracteres';
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
    
    const servicioData = {
      ...formData,
      duracion_min: Number(formData.duracion_min),
      precio: Number(formData.precio),
      empleadoId: Number(formData.empleadoId)
    };
    
    updateServicio(Number(id), servicioData);
    navigate('/admin/servicios');
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
                placeholder="Ej: Examen de la Vista, Adaptación Lentes de Contacto"
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
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción detallada del servicio"
                variant="outlined"
                multiline
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
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
                  placeholder="30"
                  required
                  variant="outlined"
                  inputProps={{ 
                    min: 1,
                    max: 480
                  }}
                  error={!!errors.duracion_min}
                  helperText={errors.duracion_min}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
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
                  placeholder="50000"
                  required
                  variant="outlined"
                  inputProps={{ 
                    min: 0,
                    step: 100
                  }}
                  error={!!errors.precio}
                  helperText={errors.precio}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: '8px' }}>$</span>
                  }}
                />
              </div>
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
                  <MenuItem value="">Seleccione un empleado</MenuItem>
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
              <FormControl fullWidth>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Estado
                </InputLabel>
                <Select
                  name="estado"
                  value={formData.estado ? 'Activo' : 'Inactivo'}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      estado: e.target.value === 'Activo'
                    });
                  }}
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
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}