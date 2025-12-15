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
import { getUsuarioById, updateUsuario } from '../../../../lib/data/usuariosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const usuario = getUsuarioById(Number(id));
    if (usuario) {
      setFormData(usuario);
    } else {
      navigate('/admin/seguridad/usuarios');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors = {};
    
    // Validar NOMBRE
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es requerido';
    } else if (!nombreRegex.test(formData.nombre.trim())) {
      newErrors.nombre = 'Solo letras y espacios (2-50 caracteres)';
    }
    
    // Validar EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido (ejemplo: usuario@dominio.com)';
    }
    
    // Validar TELÉFONO
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (7-15 dígitos, solo números)';
    }
    
    // Validar NÚMERO DE DOCUMENTO
    if (formData.numeroDocumento) {
      const numDoc = formData.numeroDocumento.trim();
      
      switch(formData.tipoDocumento) {
        case 'cedula':
          if (!/^[0-9]{6,10}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'Cédula inválida (6-10 dígitos)';
          }
          break;
        case 'cedula_extranjera':
          if (!/^[0-9]{6,10}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'Cédula extranjería inválida (6-10 dígitos)';
          }
          break;
        case 'pasaporte':
          if (!/^[A-Za-z0-9]{6,12}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'Pasaporte inválido (6-12 caracteres alfanuméricos)';
          }
          break;
        case 'ppt':
          if (!/^[0-9]{6,10}$/.test(numDoc)) {
            newErrors.numeroDocumento = 'PPT inválido (6-10 dígitos)';
          }
          break;
      }
    }
    
    // Validar CONTRASEÑA (si se cambia)
    if (formData.password && formData.password.trim() !== '') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos 1 mayúscula y 1 número';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Actualizar en la base de datos
    updateUsuario(Number(id), formData);
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

  if (!formData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editando: {formData.nombre}</h1>
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
                  value={formData.telefono || ''}
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
                value={formData.fechaNacimiento || ''}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: { fontWeight: 'normal' }
                }}
                InputProps={{
                  inputProps: { 
                    max: new Date().toISOString().split('T')[0]
                  }
                }}
              />
            </div>

            {/* Tipo de Documento y Número de Documento */}
            <div className="crud-form-row">
              <div className="crud-form-group">
                <FormControl fullWidth>
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
                    value={formData.tipoDocumento || 'cedula'}
                    onChange={handleChange}
                    label="Tipo de Documento"
                  >
                    <MenuItem value="cedula">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="cedula_extranjera">Cédula de Extranjería</MenuItem>
                    <MenuItem value="pasaporte">Pasaporte</MenuItem>
                    <MenuItem value="ppt">PPT (Permiso de Permanencia)</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Número de Documento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento || ''}
                  onChange={handleChange}
                  placeholder="Ej: 1234567890"
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
                  label="Nueva Contraseña (opcional)"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres, 1 mayúscula, 1 número"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password}
                  InputLabelProps={{
                    style: { fontWeight: 'normal' }
                  }}
                />
              </div>

              <div className="crud-form-group">
                <FormControl fullWidth>
                  <InputLabel 
                    id="estado-label"
                    style={{ fontWeight: 'normal' }}
                  >
                    Estado
                  </InputLabel>
                  <Select
                    labelId="estado-label"
                    id="estado"
                    name="estado"
                    value={formData.estado || 'activo'}
                    onChange={handleChange}
                    label="Estado"
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Rol */}
            <div className="crud-form-group">
              <FormControl fullWidth>
                <InputLabel 
                  id="rol-label"
                  style={{ fontWeight: 'normal' }}
                >
                  Rol
                </InputLabel>
                <Select
                  labelId="rol-label"
                  id="rol"
                  name="rol"
                  value={formData.rol || 'vendedor'}
                  onChange={handleChange}
                  label="Rol"
                  required
                >
                  <MenuItem value="vendedor">Vendedor</MenuItem>
                  <MenuItem value="administrador">Administrador</MenuItem>
                  <MenuItem value="optometra">Optómetra</MenuItem>
                  <MenuItem value="tecnico">Técnico</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/seguridad/usuarios')}
              className="crud-btn crud-btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}