import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRolById, updateRol } from '../../../../lib/data/rolesData';
import {
  Checkbox,
  Grid,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarPermisos() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del rol a editar
  
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todosSeleccionados, setTodosSeleccionados] = useState(false);

  // Cargar datos del rol al montar el componente
  useEffect(() => {
    const cargarRol = async () => {
      try {
        setLoading(true);
        const rol = await getRolById(id);
        
        if (rol) {
          setFormData({
            nombre: rol.nombre || '',
            descripcion: rol.descripcion || '',
            estado: rol.estado || 'activo',
            permisos: rol.permisos || []
          });
          // Verificar si todos los permisos están seleccionados
          if (rol.permisos && rol.permisos.length === permisosDisponibles.length) {
            setTodosSeleccionados(true);
          }
        } else {
          setError('No se encontró el rol');
        }
      } catch (err) {
        setError('Error al cargar el rol');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarRol();
    }
  }, [id]);

  const handleSubmit = async (e) => {
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
    
    try {
      // Actualizar el rol
      const rolActualizado = await updateRol(id, formData);
      console.log('Rol actualizado:', rolActualizado);
      
      // Redirigir a la lista de roles
      navigate('/admin/seguridad/roles');
    } catch (err) {
      console.error('Error al actualizar el rol:', err);
      setError('Error al actualizar el rol');
    }
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
        const nuevosPermisos = prev.permisos.filter(id => id !== permisoId);
        // Si después de deseleccionar todos están vacíos, actualiza el botón
        if (nuevosPermisos.length === 0) {
          setTodosSeleccionados(false);
        }
        return {
          ...prev,
          permisos: nuevosPermisos
        };
      } else {
        const nuevosPermisos = [...prev.permisos, permisoId];
        // Si después de seleccionar llegamos a todos, actualiza el botón
        if (nuevosPermisos.length === permisosDisponibles.length) {
          setTodosSeleccionados(true);
        }
        return {
          ...prev,
          permisos: nuevosPermisos
        };
      }
    });
    
    // Limpiar error de permisos si se selecciona alguno
    if (errors.permisos) {
      setErrors({
        ...errors,
        permisos: ''
      });
    }
  };

  const toggleSeleccionarTodos = () => {
    if (todosSeleccionados) {
      // Deseleccionar todos
      setFormData(prev => ({
        ...prev,
        permisos: []
      }));
      setTodosSeleccionados(false);
    } else {
      // Seleccionar todos
      const todosIds = permisosDisponibles.map(permiso => permiso.id);
      setFormData(prev => ({
        ...prev,
        permisos: todosIds
      }));
      setTodosSeleccionados(true);
    }
    
    if (errors.permisos) {
      setErrors({
        ...errors,
        permisos: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="crud-form-container crear-rol-container">
        <div className="crud-form-header crear-rol-header">
          <h1>Editar Permisos del Rol</h1>
          <p>Cargando información del rol...</p>
        </div>
        <div className="crud-form-content crear-rol-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crud-form-container crear-rol-container">
        <div className="crud-form-header crear-rol-header">
          <h1>Editar Permisos del Rol</h1>
          <p>Error al cargar el rol</p>
        </div>
        <div className="crud-form-content crear-rol-content">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <button 
            type="button" 
            className="crud-btn crud-btn-secondary"
            onClick={() => navigate('/admin/seguridad/roles')}
          >
            Volver a Roles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container crear-rol-container">
      <div className="crud-form-header crear-rol-header">
        <h1>Editar Permisos del Rol</h1>
      </div>
      
      <div className="crud-form-content crear-rol-content">
        <form onSubmit={handleSubmit}>
          {/* Sección de información del rol */}
          <div className="crud-form-section">
            {/* Fila 1: Nombre del Rol (izquierda) */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre del Rol *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Administrador"
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            {/* Fila 1: Estado (derecha) */}
            <div className="crud-form-group">
              <FormControl fullWidth>
                <InputLabel style={{ fontWeight: 'normal' }}>Estado</InputLabel>
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

            {/* Fila 2: Descripción (ocupa 2 columnas) */}
            <div className="crud-form-group full-width">
              <TextField
                fullWidth
                label="Descripción *"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del rol..."
                required
                variant="outlined"
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>
          </div>

          {/* Sección de permisos */}
          <div className="permisos-section no-scroll">
            <div className="permisos-header-boolean">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0 }}>Permisos</h3>
                <span style={{ 
                  fontSize: '14px', 
                  backgroundColor: '#f0f0f0',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  ({formData.permisos.length} de {permisosDisponibles.length})
                </span>
              </div>
              <button 
                type="button" 
                className={`permiso-toggle-btn ${todosSeleccionados ? 'todos-seleccionados' : ''}`}
                onClick={toggleSeleccionarTodos}
              >
                {todosSeleccionados ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
              </button>
            </div>
            
            {errors.permisos && <div className="permisos-error">{errors.permisos}</div>}
            
            <Box className="permisos-grid-boolean">
              <Grid container spacing={1}>
                {permisosDisponibles.map(permiso => (
                  <Grid item xs={12} sm={6} md={4} key={permiso.id}>
                    <Box 
                      className={`permiso-item-boolean ${formData.permisos.includes(permiso.id) ? 'selected' : ''}`}
                      onClick={() => handlePermisoChange(permiso.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: formData.permisos.includes(permiso.id) ? '#e3f2fd' : '#fff',
                        borderColor: formData.permisos.includes(permiso.id) ? '#1976d2' : '#ddd',
                        '&:hover': {
                          backgroundColor: formData.permisos.includes(permiso.id) ? '#bbdefb' : '#f5f5f5'
                        }
                      }}
                    >
                      <Checkbox
                        checked={formData.permisos.includes(permiso.id)}
                        onChange={() => handlePermisoChange(permiso.id)}
                        size="small"
                        sx={{ mr: 0.5, padding: '4px' }}
                      />
                      <Typography 
                        sx={{ 
                          fontSize: '0.8rem', 
                          color: 'text.primary',
                          lineHeight: 1.2 
                        }}
                      >
                        {permiso.nombre}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/seguridad/roles')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Rol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}