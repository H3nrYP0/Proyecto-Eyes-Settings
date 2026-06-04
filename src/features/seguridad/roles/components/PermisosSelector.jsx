// ============================================================
// Selector de permisos por entidad (diseño 3 columnas).
// Cada entidad tiene un solo checkbox que representa TODOS los permisos de esa entidad.
// Toda la tarjeta es clickeable.
// ============================================================

import { useMemo } from "react";
import {
  Box,
  Typography,
  FormHelperText,
  Checkbox,
  Grid,
} from "@mui/material";

const BRAND_BORDER = "#e3e2f0";
const TEXT_PRIMARY = "#1a2c3e";

// Mapeo de permisos especiales a entidades (para agrupar)
const specialMapping = {
  cambiar_estado_cita: "citas",
  cambiar_estado_pedido: "pedidos",
  cambiar_estado_venta: "ventas",
  // Las entidades "imagenes" ya no se incluyen en la lista principal
  // ver_imagenes, subir_imagenes, eliminar_imagenes se omiten
  gestionar_configuracion: "seguridad",
  ver_dashboard: "dashboard",
  cliente_acceso_basico: "seguridad",
};

// Lista de entidades principales (15) - orden deseado
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

// Nombres mostrados con tildes
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
  // imagenes ya no se muestra
};

const formatearNombreEntidad = (entidad) => {
  if (nombresConTildes[entidad]) return nombresConTildes[entidad];
  return entidad.charAt(0).toUpperCase() + entidad.slice(1).replace(/_/g, " ");
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

// Agrupa los IDs de permisos por entidad, solo entidades principales
const agruparPorEntidad = (permisos) => {
  const map = new Map();
  permisos.forEach((p) => {
    const entity = getEntityForPermiso(p.nombre);
    if (!entity) return;
    if (!ENTIDADES_MAIN.includes(entity)) return; // filtrar solo principales
    if (!map.has(entity)) map.set(entity, []);
    map.get(entity).push(p.id);
  });
  // Orden según ENTIDADES_MAIN
  return ENTIDADES_MAIN.filter(entity => map.has(entity))
    .map(entity => ({ entity, ids: map.get(entity) }));
};

export default function PermisosSelector({
  permisosDisponibles = [],
  value = [],
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) {
  const isReadOnly = disabled || readOnly;

  const grupos = useMemo(
    () => agruparPorEntidad(permisosDisponibles),
    [permisosDisponibles]
  );

  const isCompleta = (grupo) => {
    if (grupo.ids.length === 0) return false;
    return grupo.ids.every((id) => value.includes(id));
  };

  const isParcial = (grupo) => {
    if (grupo.ids.length === 0) return false;
    const algunos = grupo.ids.some((id) => value.includes(id));
    return algunos && !isCompleta(grupo);
  };

  const toggleEntidad = (grupo) => {
    if (isReadOnly) return;
    const todas = isCompleta(grupo);
    let nuevos;
    if (todas) {
      nuevos = value.filter((id) => !grupo.ids.includes(id));
    } else {
      const idsToAdd = grupo.ids.filter((id) => !value.includes(id));
      nuevos = [...value, ...idsToAdd];
    }
    onChange(nuevos);
  };

  // Modo solo lectura: muestra la lista de entidades seleccionadas (solo principales)
  if (isReadOnly) {
    const entidadesSeleccionadas = grupos
      .filter(grupo => isCompleta(grupo))
      .map(grupo => formatearNombreEntidad(grupo.entity));
    return (
      <Box sx={{ width: "100%" }}>
        {error && (
          <FormHelperText error sx={{ mb: 1, fontSize: "0.75rem" }}>
            {error}
          </FormHelperText>
        )}
        {entidadesSeleccionadas.length === 0 ? (
          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#999" }}>
            No se han seleccionado entidades.
          </Typography>
        ) : (
          <Grid container spacing={1} columns={12}>
            {entidadesSeleccionadas.map((nombre) => (
              <Grid item xs={4} sm={4} md={4} key={nombre}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.75rem", color: TEXT_PRIMARY, py: 0.5 }}
                >
                  {nombre}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Modo edición: selectores por entidad
  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <FormHelperText error sx={{ mb: 1, fontSize: "0.75rem" }}>
          {error}
        </FormHelperText>
      )}
      <Box sx={{ maxHeight: 420, overflowY: "auto", pr: 1 }}>
        <Grid container spacing={1} columns={12}>
          {grupos.map((grupo) => (
            <Grid item xs={4} sm={4} md={4} key={grupo.entity}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: `1px solid ${BRAND_BORDER}`,
                  borderRadius: "8px",
                  p: 1,
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => toggleEntidad(grupo)}
              >
                <Typography fontWeight={500} sx={{ fontSize: "0.8rem" }}>
                  {formatearNombreEntidad(grupo.entity)}
                </Typography>
                <Checkbox
                  size="small"
                  checked={isCompleta(grupo)}
                  indeterminate={isParcial(grupo)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleEntidad(grupo)}
                  sx={{ p: 0.5 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}