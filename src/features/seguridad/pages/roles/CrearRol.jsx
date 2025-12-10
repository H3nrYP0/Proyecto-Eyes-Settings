import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRol } from '../../../../lib/data/rolesData';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import "../../../../shared/styles/components/crud-forms.css";
// Agrega esta importación si creas un archivo separado
// import "./CrearRol.css"; 

export default function CrearRol() {
  const navigate = useNavigate();
  
  // Lista de permisos disponibles según la imagen
  const permisosDisponibles = [
    { id: 'dashboard', nombre: 'Gestionar Dashboard' },
    { id: 'categorias', nombre: 'Gestionar Categorías' },
    { id: 'compras', nombre: 'Gestionar Compras' },
    { id: 'empleados', nombre: 'Gestionar Empleados' },
    { id: 'ventas', nombre: 'Gestionar Ventas' },
    { id: 'roles', nombre: 'Gestionar Roles' },
    { id: 'productos', nombre: 'Gestionar Productos' },
    { id: 'servicios', nombre: 'Gestionar Servicios' },
    { id: 'clientes', nombre: 'Gestionar Clientes' },
    { id: 'campanas_salud', nombre: 'Gestionar Campañas de Salud' },
    { id: 'usuarios', nombre: 'Gestionar Usuarios' },
    { id: 'proveedores', nombre: 'Gestionar Proveedores' },
    { id: 'agenda', nombre: 'Gestionar Agenda' },
    { id: 'pedidos', nombre: 'Gestionar Pedidos' }
  ];

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo',
    permisos: []
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del rol es requerido';
    }
    
    if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (formData.permisos.length === 0) {
      newErrors.permisos = 'Debe seleccionar al menos un permiso';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Crear el rol
    const nuevoRol = createRol(formData);
    console.log('Rol creado:', nuevoRol);
    navigate('/admin/seguridad/roles');
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

  const handlePermisoChange = (permisoId) => {
    setFormData(prev => {
      if (prev.permisos.includes(permisoId)) {
        // Remover permiso
        return {
          ...prev,
          permisos: prev.permisos.filter(id => id !== permisoId)
        };
      } else {
        // Agregar permiso
        return {
          ...prev,
          permisos: [...prev.permisos, permisoId]
        };
      }
    });
    
    // Limpiar error de permisos si se selecciona alguno
    if (errors.permisos && formData.permisos.length >= 0) {
      setErrors({
        ...errors,
        permisos: ''
      });
    }
  };

  const seleccionarTodosPermisos = () => {
    const todosIds = permisosDisponibles.map(permiso => permiso.id);
    setFormData(prev => ({
      ...prev,
      permisos: todosIds
    }));
  };

  const deseleccionarTodosPermisos = () => {
    setFormData(prev => ({
      ...prev,
      permisos: []
    }));
  };

  return (
    <div className="crud-form-container crear-rol-container">
      <div className="crud-form-header crear-rol-header">
        <h1>Crear Nuevo Rol</h1>
        <p>Define un nuevo rol con sus permisos correspondientes</p>
      </div>
      
      <div className="crud-form-content crear-rol-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section crear-rol-section">
            <h3>Información del Rol</h3>
            
            <div className="crear-rol-form-row">
              <TextField
                fullWidth
                label="Nombre del Rol"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
                placeholder="Ej: Administrador"
                size="small"
                variant="outlined"
                className="crear-rol-mui-field"
              />
              
              <FormControl fullWidth size="small" className="crear-rol-mui-field">
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  variant="outlined"
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </div>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              required
              placeholder="Describe las funciones y responsabilidades de este rol..."
              variant="outlined"
              size="small"
              className="crear-rol-mui-field"
            />
          </div>

          {/* SECCIÓN DE PERMISOS CON MATERIAL UI - ACTUALIZADA */}
          <div className="crud-form-section crear-rol-section permisos-section">
            <div className="permisos-header">
              <div>
                <h3>Permisos</h3>
                <p className="permisos-count">
                  <span className="permisos-numero">{formData.permisos.length}</span> de{' '}
                  <span className="permisos-total">{permisosDisponibles.length}</span> permisos seleccionados
                </p>
              </div>
              
              <div className="permisos-buttons">
                <button 
                  type="button" 
                  className="permiso-btn permiso-btn-outline"
                  onClick={seleccionarTodosPermisos}
                >
                  Seleccionar Todos
                </button>
                <button 
                  type="button" 
                  className="permiso-btn permiso-btn-outline"
                  onClick={deseleccionarTodosPermisos}
                >
                  Deseleccionar Todos
                </button>
              </div>
            </div>
            
            {errors.permisos && <div className="error-message permisos-error">{errors.permisos}</div>}
            
            <Box sx={{ mt: 2 }} className="permisos-grid-container">
              <Grid container spacing={2}>
                {permisosDisponibles.map(permiso => (
                  <Grid item xs={12} sm={6} md={4} key={permiso.id}>
                    <Box 
                      className={`permiso-item ${formData.permisos.includes(permiso.id) ? 'selected' : ''}`}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          backgroundColor: '#f7fafc',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.1)'
                        }
                      }}
                      onClick={() => handlePermisoChange(permiso.id)}
                    >
                      <Checkbox
                        checked={formData.permisos.includes(permiso.id)}
                        onChange={() => handlePermisoChange(permiso.id)}
                        size="small"
                        sx={{ 
                          mr: 1,
                          '&.Mui-checked': {
                            color: '#667eea'
                          }
                        }}
                        className="permiso-checkbox"
                      />
                      <Typography 
                        sx={{ 
                          fontSize: '0.9rem',
                          color: '#4a5568',
                          flex: 1,
                          fontWeight: formData.permisos.includes(permiso.id) ? 600 : 500
                        }}
                        className="permiso-label"
                      >
                        {permiso.nombre}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>

          <div className="crud-form-actions crear-rol-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary crear-rol-btn crear-rol-secondary"
              onClick={() => navigate('/admin/seguridad/roles')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary crear-rol-btn crear-rol-primary"
            >
              Crear Rol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}