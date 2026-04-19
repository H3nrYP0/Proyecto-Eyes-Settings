// ==================== PÁGINAS ====================
// Roles
export { default as Roles }          from './roles/pages/Roles';
export { default as CrearRol }       from './roles/pages/CrearRol';
export { default as EditarPermisos } from './roles/pages/EditarPermisos';
export { default as DetalleRol }     from './roles/pages/ListaRoles';

// Usuarios
export { default as GestionUsuarios } from './user/pages/GestionUsuarios';
export { default as CrearUsuario }    from './user/pages/CrearUsuario';
export { default as EditarUsuario }   from './user/pages/EditarUsuario';
export { default as DetalleUsuario }  from './user/pages/DetalleUsuario';

// ==================== SERVICIOS ====================
export * from './roles/services/rolServices';
export * from './user/services/userServices';
export * from './user/services/clienteServices';

// ==================== HOOKS ====================
export * from './roles/hooks/useRol';
export * from './user/hooks/useUsuario';
export * from './user/hooks/useUserForm';

// ==================== COMPONENTES ====================
export { default as RolForm }          from './roles/components/RolForm';
export { default as PermisosSelector } from './roles/components/PermisosSelector';
export { default as UserForm }         from './user/components/UserForm';

// ==================== UTILS ====================
// Roles
export * from './roles/utils/permisosUtils';
export * from './roles/utils/rolFilters';
export * from './roles/utils/rolNormalizer';
export * from './roles/utils/rolValidators';

// Usuarios
export * from './user/utils/userFilters';
export * from './user/utils/userNormalizer';
export * from './user/utils/userValidators';