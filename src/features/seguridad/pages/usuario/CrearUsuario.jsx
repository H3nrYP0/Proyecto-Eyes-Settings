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
import { createUsuario } from '../../../../lib/data/usuariosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    tipoDocumento: 'cedula',
    numeroDocumento: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Calcular fecha máxima (18 años atrás desde hoy)
  const calcularFechaMaxima = () => {
    const hoy = new Date();
    const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    return fechaMax.toISOString().split('T')[0];
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors = {};
    
    // 1. Validar NOMBRE (solo letras y espacios, 2-50 caracteres)
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es requerido';
    } else if (!nombreRegex.test(formData.nombre.trim())) {
      newErrors.nombre = 'Solo letras y espacios (2-50 caracteres)';
    }
    
    // 2. Validar EMAIL (formato estricto)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido (ejemplo: usuario@dominio.com)';
    }
    
    // 3. Validar TELÉFONO (opcional pero con formato)
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (7-15 dígitos, solo números)';
    }
    
    // 4. Validar FECHA DE NACIMIENTO (mayor de 18 años)
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      const edad = calcularEdad(formData.fechaNacimiento);
      
      if (fechaNac > hoy) {
        newErrors.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad < 18) {
        newErrors.fechaNacimiento = `Debe ser mayor de 18 años (edad: ${edad})`;
      }
    }
    
    // 5. Validar NÚMERO DE DOCUMENTO (depende del tipo)
    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = 'El número de documento es requerido';
    } else {
      const numDoc = formData.numeroDocumento.trim();
      
      switch(formData.tipoDocumento) {
        case 'cedula':
          // Cédula colombiana: 6-10 dígitos
          if (!/^[0-9]{6,10}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'Cédula inválida (6-10 dígitos)';
          }
          break;
        case 'cedula_extranjera':
          // Cédula extranjería: 6-10 dígitos
          if (!/^[0-9]{6,10}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'Cédula extranjería inválida (6-10 dígitos)';
          }
          break;
        case 'pasaporte':
          // Pasaporte: letras y números, 6-12 caracteres
          if (!/^[A-Za-z0-9]{6,12}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'Pasaporte inválido (6-12 caracteres alfanuméricos)';
          }
          break;
        case 'ppt':
          // PPT venezolano: 6-10 dígitos
          if (!/^[0-9]{6,10}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'PPT inválido (6-10 dígitos)';
          }
          break;
        default:
          newErrors.numeroDocumento = 'Tipo de documento no válido';
      }
    }
    
    // 6. Validar CONTRASEÑA (mínimo 6 caracteres, 1 mayúscula, 1 número)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Debe incluir al menos 1 mayúscula y 1 número';
    }
    
    // 7. Validar CONFIRMACIÓN DE CONTRASEÑA
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // 8. Validar TIPO DE DOCUMENTO
    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = 'Seleccione un tipo de documento';
    }
    
    // SI HAY ERRORES, DETENER Y MOSTRAR
    if (Object.keys(newErrors).length > 0) {
      console.log('Errores de validación:', newErrors);
      setErrors(newErrors);
      
      // Scroll al primer error
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    // SOLO si pasa TODAS las validaciones, crear el usuario
    const { confirmPassword, ...usuarioData } = formData;
    const usuarioConEstado = {
      ...usuarioData,
      estado: 'activo'
    };
    
    console.log('Datos válidos para crear usuario:', usuarioConEstado);
    const nuevoUsuario = createUsuario(usuarioConEstado);
    navigate('/admin/seguridad/usuarios');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al cambiar
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
        <h1>Crear Nuevo Usuario</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            {/* Nombre Completo */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez García"
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            {/* Correo Electrónico y Teléfono */}
            <div className="crud-form-row">
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@visualoutlet.com"
                  required
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email}
                  InputLabelProps={{
                    style: { fontWeight: 'normal' }
                  }}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 3001234567"
                  variant="outlined"
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  InputLabelProps={{
                    style: { fontWeight: 'normal' }
                  }}
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: { fontWeight: 'normal' }
                }}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento}
                inputProps={{ 
                  max: calcularFechaMaxima()
                }}
                required
              />
            </div>

            {/* Tipo de Documento y Número de Documento */}
            <div className="crud-form-row">
              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.tipoDocumento}>
                  <InputLabel 
                    id="tipoDocumento-label"
                    style={{ fontWeight: 'normal' }}
                  >
                    Tipo de Documento
                  </InputLabel>
                  <Select
                    labelId="tipoDocumento-label"
                    id="tipoDocumento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    label="Tipo de Documento"
                    required
                  >
                    <MenuItem value="cedula">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="cedula_extranjera">Cédula de Extranjería</MenuItem>
                    <MenuItem value="pasaporte">Pasaporte</MenuItem>
                    <MenuItem value="ppt">PPT (Permiso de Permanencia)</MenuItem>
                  </Select>
                  {errors.tipoDocumento && (
                    <FormHelperText error>
                      {errors.tipoDocumento}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Número de Documento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Ej: 1234567890"
                  required
                  variant="outlined"
                  error={!!errors.numeroDocumento}
                  helperText={errors.numeroDocumento}
                  InputLabelProps={{
                    style: { fontWeight: 'normal' }
                  }}
                />
              </div>
            </div>

            {/* Contraseña y Confirmar Contraseña */}
            <div className="crud-form-row">
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres, 1 mayúscula, 1 número"
                  required
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password}
                  InputLabelProps={{
                    style: { fontWeight: 'normal' }
                  }}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  required
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputLabelProps={{
                    style: { fontWeight: 'normal' }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/seguridad/usuarios')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary crear-rol-btn crear-rol-primary"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}