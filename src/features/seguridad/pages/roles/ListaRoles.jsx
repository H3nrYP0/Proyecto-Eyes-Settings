import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRolById } from '../../../../lib/data/rolesData';
import { Grid, Typography, Box, Checkbox } from '@mui/material';
import "../../../../shared/styles/components/crud-forms.css";
import "../../../../shared/styles/components/crud-especificos-rol.css";

export default function EditarPermisos() {
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
      <div className="crud-form-container crear-rol-container">
        <div className="crud-form-content crear-rol-content">
          Cargando...
        </div>
      </div>
    );
  }

  if (!rol) {
    return (
      <div className="crud-form-container crear-rol-container">
        <div className="crud-form-content crear-rol-content">
          Rol no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container crear-rol-container">
      <div className="crud-form-header crear-rol-header">
        <h1>Detalle del Rol</h1>
      </div>

      <div className="crud-form-content crear-rol-content">

        <div className="crud-form-section crear-rol-section">
          <div className="crear-rol-form-row">
            <Typography variant="subtitle2">Nombre del Rol</Typography>
            <Typography>{rol.nombre}</Typography>
          </div>

          <div className="crear-rol-form-row">
            <Typography variant="subtitle2">Descripción</Typography>
            <Typography>{rol.descripcion}</Typography>
          </div>

          <div className="crear-rol-form-row">
            <Typography variant="subtitle2">Estado</Typography>
            <span className={`crud-badge ${rol.estado === 'activo'
              ? 'crud-badge-success'
              : 'crud-badge-error'
            }`}>
              {rol.estado}
            </span>
          </div>
        </div>

        {/* PERMISOS (solo visual) */}
        <div className="permisos-section no-scroll">
          <div className="permisos-header-boolean">
            <h3>Permisos</h3>
          </div>

          <Box className="permisos-grid-boolean">
            <Grid container spacing={1}>
              {permisosDisponibles.map(permiso => {
                const activo = rol.permisos?.includes(permiso.id);

                return (
                  <Grid item xs={12} sm={6} md={4} key={permiso.id}>
                    <Box
                      className={`permiso-item-boolean ${activo ? 'selected' : ''}`}
                    >
                      <Checkbox checked={activo} disabled size="small" />
                      <Typography className="permiso-text">
                        {permiso.nombre}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </div>

        <div className="crud-form-actions crear-rol-actions">
          <button
            className="crud-btn crud-btn-secondary crear-rol-btn crear-rol-secondary"
            onClick={() => navigate('/admin/seguridad/roles')}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
