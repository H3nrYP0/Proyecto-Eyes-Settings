// ============================================================
// PermisosDetalle.jsx
// Muestra los permisos de un rol agrupados por entidad.
// Versión minimalista: sin bordes marcados, colores suaves,
// espaciado reducido, tipografía más pequeña.
// ============================================================

import { Box, Typography, Grid, Chip } from "@mui/material";
import { useMemo } from "react";

// Mapeo de acciones CRUD a etiquetas
const accionMap = {
  ver: "Ver",
  crear: "Crear",
  editar: "Editar",
  eliminar: "Eliminar",
};

// Mapeo de permisos especiales a etiquetas legibles
const specialLabelMap = {
  cambiar_estado_cita: "Cambiar Estado",
  cambiar_estado_pedido: "Cambiar Estado",
  cambiar_estado_venta: "Cambiar Estado",
  ver_imagenes: "Ver Imágenes",
  subir_imagenes: "Subir Imágenes",
  eliminar_imagenes: "Eliminar Imágenes",
  gestionar_configuracion: "Gestionar Seguridad",
  ver_dashboard: "Ver Dashboard",
  cliente_acceso_basico: "Acceso Básico",
};

// Nombres de entidades con tildes
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
  imagenes: "Imágenes",
};

const formatearNombreEntidad = (entidad) =>
  nombresConTildes[entidad] || entidad.charAt(0).toUpperCase() + entidad.slice(1).replace(/_/g, " ");

// Mapeo de permisos especiales a entidad
const specialMapping = {
  cambiar_estado_cita: "citas",
  cambiar_estado_pedido: "pedidos",
  cambiar_estado_venta: "ventas",
  ver_imagenes: "imagenes",
  subir_imagenes: "imagenes",
  eliminar_imagenes: "imagenes",
  gestionar_configuracion: "seguridad",
  ver_dashboard: "dashboard",
  cliente_acceso_basico: "seguridad",
};

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
  "imagenes",
];

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

const getPermisoLabel = (nombre) => {
  const accion = Object.keys(accionMap).find((a) => nombre.startsWith(a + "_"));
  if (accion) return accionMap[accion];
  if (specialLabelMap[nombre]) return specialLabelMap[nombre];
  return nombre.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const agruparPermisosPorEntidad = (permisosIds, todosPermisos) => {
  const map = new Map();
  const idsSet = new Set(permisosIds);
  todosPermisos.forEach((p) => {
    if (!idsSet.has(p.id)) return;
    const entity = getEntityForPermiso(p.nombre);
    if (!entity) return;
    if (!map.has(entity)) map.set(entity, []);
    map.get(entity).push(p);
  });
  return Array.from(map.entries())
    .map(([entity, permisos]) => ({ entity, permisos }))
    .sort((a, b) => ENTIDADES_MAIN.indexOf(a.entity) - ENTIDADES_MAIN.indexOf(b.entity));
};

export default function PermisosDetalle({ permisosDisponibles = [], value = [] }) {
  const grupos = useMemo(
    () => agruparPermisosPorEntidad(value, permisosDisponibles),
    [permisosDisponibles, value]
  );

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
        {grupos.map(({ entity, permisos }) => (
          <Grid item xs={12} sm={6} md={4} key={entity}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                fontWeight={500}
                sx={{ mb: 0.5, color: "#4a5568", fontSize: "0.75rem", letterSpacing: "0.3px" }}
              >
                {formatearNombreEntidad(entity)}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {permisos.map((permiso) => (
                  <Chip
                    key={permiso.id}
                    label={getPermisoLabel(permiso.nombre)}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: "0.7rem",
                      backgroundColor: "#f8fafc",
                      borderColor: "#e2e8f0",
                      color: "#334155",
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}