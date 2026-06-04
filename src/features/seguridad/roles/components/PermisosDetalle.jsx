// ============================================================
// Muestra los permisos de un rol agrupados por entidad.
// Versión read-only que replica el diseño de PermisosSelector
// (tarjetas con checkbox deshabilitado) usando las 15 entidades principales.
// ============================================================

import { Box, Typography, Grid, Checkbox } from "@mui/material";
import { useMemo } from "react";

// Lista de entidades principales
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

// Nombres con tildes para mostrar
const nombresConTildes = {
  dashboard: "Dashboard",
  servicios: "Servicios",
  citas: "Citas",
  empleados: "Empleados",
  campanas: "Campañas",
  compras: "Compras",
  productos: "Productos",
  categorias: "Categorías",
  marcas: "Marcas",
  proveedores: "Proveedores",
  clientes: "Clientes",
  pedidos: "Pedidos",
  ventas: "Ventas",
  usuarios: "Usuarios",
  seguridad: "Seguridad",
};

const formatearNombreEntidad = (entidad) =>
  nombresConTildes[entidad] || entidad.charAt(0).toUpperCase() + entidad.slice(1).replace(/_/g, " ");

// Mapeo de permisos especiales a entidad
const specialMapping = {
  cambiar_estado_cita: "citas",
  cambiar_estado_pedido: "pedidos",
  cambiar_estado_venta: "ventas",
  gestionar_configuracion: "seguridad",
  ver_dashboard: "dashboard",
  cliente_acceso_basico: "seguridad",
};

// Determina a qué entidad pertenece un permiso (CRUD o especial)
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

// Para cada entidad, obtiene la lista de IDs de permisos que le pertenecen
const obtenerIdsPorEntidad = (permisosDisponibles) => {
  const map = new Map();
  permisosDisponibles.forEach((p) => {
    const entity = getEntityForPermiso(p.nombre);
    if (!entity) return;
    if (!map.has(entity)) map.set(entity, []);
    map.get(entity).push(p.id);
  });
  return map;
};

export default function PermisosDetalle({ permisosDisponibles = [], value = [] }) {
  // Mapa entidad -> array de IDs de permisos que la componen
  const idsPorEntidad = useMemo(
    () => obtenerIdsPorEntidad(permisosDisponibles),
    [permisosDisponibles]
  );

  // Construir grupos solo para las entidades principales que tengan al menos un permiso
  const grupos = useMemo(() => {
    return ENTIDADES_MAIN.filter((entity) => idsPorEntidad.has(entity))
      .map((entity) => ({
        entity,
        ids: idsPorEntidad.get(entity),
      }));
  }, [idsPorEntidad]);

  // Estado de cada entidad: 'full', 'partial' o 'none'
  const getEstadoEntidad = (ids) => {
    if (ids.length === 0) return 'none';
    const todosSeleccionados = ids.every((id) => value.includes(id));
    if (todosSeleccionados) return 'full';
    const algunoSeleccionado = ids.some((id) => value.includes(id));
    return algunoSeleccionado ? 'partial' : 'none';
  };

  if (grupos.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", py: 2, fontStyle: "italic" }}
      >
        No hay entidades con permisos asignados.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {grupos.map(({ entity, ids }) => {
          const estado = getEstadoEntidad(ids);
          const checked = estado === 'full';
          const indeterminate = estado === 'partial';

          return (
            <Grid item xs={12} sm={6} md={4} key={entity}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 1.5,
                  backgroundColor: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight={500} sx={{ fontSize: "0.8rem" }}>
                  {formatearNombreEntidad(entity)}
                </Typography>
                <Checkbox
                  size="small"
                  checked={checked}
                  indeterminate={indeterminate}
                  disabled
                  sx={{ p: 0.5 }}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}