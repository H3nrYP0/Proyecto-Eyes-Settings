const ENTIDADES_MAIN = [
  "dashboard",
  "servicios",
  "citas",
  "empleados",
  "campanas",
  "compras",
  "productos",
  "categorias",
  "marcas",
  "proveedores",
  "clientes",
  "pedidos",
  "ventas",
  "usuarios",
  "seguridad",
];

const specialMapping = {
  cambiar_estado_cita: "citas",
  cambiar_estado_pedido: "pedidos",
  cambiar_estado_venta: "ventas",
  gestionar_configuracion: "seguridad",
  ver_dashboard: "dashboard",
  cliente_acceso_basico: "seguridad",
};

const getEntityForPermiso = (nombre) => {
  const parts = nombre.split("_");
  if (parts.length >= 2) {
    const accion = parts[0];
    if (["ver", "crear", "editar", "eliminar"].includes(accion)) {
      const entity = parts.slice(1).join("_");
      if (entity === "configuracion") return "seguridad";
      if (ENTIDADES_MAIN.includes(entity)) return entity;
    }
  }
  if (specialMapping[nombre]) return specialMapping[nombre];
  return null;
};

export const contarEntidadesConPermisos = (permisos) => {
  if (!Array.isArray(permisos)) return 0;
  const entidadesSet = new Set();
  permisos.forEach((p) => {
    const entity = getEntityForPermiso(p.nombre);
    if (entity) entidadesSet.add(entity);
  });
  return entidadesSet.size;
};