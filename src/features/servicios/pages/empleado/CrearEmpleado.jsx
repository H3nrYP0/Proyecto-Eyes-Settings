import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import { createEmpleado } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearEmpleado() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocumento: 'CC',
    numero_documento: '',
    telefono: '',
    correo: '',
    cargo: '',
    fecha_ingreso: '',
    direccion: '',
    estado: true
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'Mínimo 3 caracteres';
    }
    
    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = 'Seleccione un tipo de documento';
    }
    
    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = 'El número de documento es requerido';
    } else {
      const doc = formData.numero_documento.trim();
      if (formData.tipoDocumento === 'CC') {
        if (!/^[0-9]{6,10}$/.test(doc)) {
          newErrors.numero_documento = 'Cédula inválida (6-10 dígitos)';
        }
      } else if (formData.tipoDocumento === 'CE') {
        if (!/^[0-9]{6,10}$/.test(doc)) {
          newErrors.numero_documento = 'Cédula extranjería inválida (6-10 dígitos)';
        }
      } else if (formData.tipoDocumento === 'PA') {
        if (!/^[A-Za-z0-9]{6,12}$/.test(doc)) {
          newErrors.numero_documento = 'Pasaporte inválido (6-12 caracteres)';
        }
      }
    }
    
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (7-15 dígitos)';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = 'Formato de email inválido';
    }
    
    if (!formData.cargo) {
      newErrors.cargo = 'Seleccione un cargo';
    }
    
    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = 'La fecha de ingreso es requerida';
    } else {
      const fechaIngreso = new Date(formData.fecha_ingreso);
      const hoy = new Date();
      if (fechaIngreso > hoy) {
        newErrors.fecha_ingreso = 'La fecha no puede ser futura';
      }
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
    
    const empleadoData = {
      ...formData,
      estado: true
    };
    
    createEmpleado(empleadoData);
    navigate('/admin/servicios/empleados');
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

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Registrar Nuevo Empleado</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Carlos Andrés Méndez"
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.tipoDocumento}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Tipo de Documento
                </InputLabel>
                <Select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  label="Tipo de Documento"
                  required
                >
                  <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                  <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                  <MenuItem value="PA">Pasaporte</MenuItem>
                </Select>
                {errors.tipoDocumento && (
                  <FormHelperText error>{errors.tipoDocumento}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Número de Documento"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                placeholder="123456789"
                required
                variant="outlined"
                error={!!errors.numero_documento}
                helperText={errors.numero_documento}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="3001234567"
                required
                variant="outlined"
                error={!!errors.telefono}
                helperText={errors.telefono}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@optica.com"
                variant="outlined"
                error={!!errors.correo}
                helperText={errors.correo}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección completa..."
                variant="outlined"
                multiline
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.cargo}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Cargo
                </InputLabel>
                <Select
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  label="Cargo"
                  required
                >
                  <MenuItem value="">Seleccionar cargo</MenuItem>
                  <MenuItem value="Optómetra">Optómetra</MenuItem>
                  <MenuItem value="Asistente">Asistente</MenuItem>
                  <MenuItem value="Técnico">Técnico</MenuItem>
                  <MenuItem value="Administrador">Administrador</MenuItem>
                  <MenuItem value="Recepcionista">Recepcionista</MenuItem>
                  <MenuItem value="Vendedor">Vendedor</MenuItem>
                </Select>
                {errors.cargo && (
                  <FormHelperText error>{errors.cargo}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Fecha de Ingreso"
                name="fecha_ingreso"
                type="date"
                value={formData.fecha_ingreso}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: { fontWeight: 'normal' }
                }}
                error={!!errors.fecha_ingreso}
                helperText={errors.fecha_ingreso}
              />
            </div>

            <div className="crud-form-group" style={{ opacity: 0 }}>
              <div style={{ height: '56px' }}></div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/servicios/empleados')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Registrar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}