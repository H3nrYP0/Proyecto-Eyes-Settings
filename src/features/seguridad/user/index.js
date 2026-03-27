// Re-exporta las páginas del módulo
export { default as Roles }          from './pages/Roles';
export { default as CrearRol }       from './pages/CrearRol';
export { default as EditarPermisos } from './pages/EditarPermisos';
export { default as DetalleRol }     from './pages/DetalleRol';

// Rutas del módulo de roles
export const rolesRoutes = [
  { path: 'roles',             element: <Roles /> },
  { path: 'roles/crear',       element: <CrearRol /> },
  { path: 'roles/editar/:id',  element: <EditarPermisos /> },
  { path: 'roles/detalle/:id', element: <DetalleRol /> },
];