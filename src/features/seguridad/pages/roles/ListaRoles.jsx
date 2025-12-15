import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRolById } from '../../../../lib/data/rolesData';
import { Grid, Typography, Box, Checkbox } from '@mui/material';
import "../../../../shared/styles/components/crud-forms.css";
import "../../../../shared/styles/components/crud-especificos-rol.css";

export default function DetalleRol() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getRolById(id);
    setRol(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          Cargando...
        </div>
      </div>
    );
  }

  if (!rol) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          Rol no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle del Rol: {rol.nombre}</h1>
      </div>

      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-form-group">
            <div className="crud-input-view">
              {rol.nombre}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {rol.estado === 'activo' ? 'Activo' : 'Inactivo'}
            </div>
          </div>

          <div className="crud-form-group full-width">
            <div className="crud-input-view">
              {rol.descripcion}
            </div>
          </div>
        </div>

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
                ({rol.permisos?.length || 0} de {permisosDisponibles.length})
              </span>
            </div>
          </div>
          
          <Box className="permisos-grid-boolean">
            <Grid container spacing={1}>
              {permisosDisponibles.map(permiso => {
                const activo = rol.permisos?.includes(permiso.id);

                return (
                  <Grid item xs={12} sm={6} md={4} key={permiso.id}>
                    <Box
                      className={`permiso-item-boolean ${activo ? 'selected' : ''}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: activo ? '#e3f2fd' : '#fff',
                        borderColor: activo ? '#1976d2' : '#ddd',
                        cursor: 'default',
                        minHeight: '42px'
                      }}
                    >
                      <Checkbox 
                        checked={activo} 
                        disabled 
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
                );
              })}
            </Grid>
          </Box>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/seguridad/roles')}
            className="crud-btn crud-btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={() => navigate(`/admin/seguridad/roles/editar/${rol.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Rol
          </button>       
        </div>
      </div>
    </div>
  );
}