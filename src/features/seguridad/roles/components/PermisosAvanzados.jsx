// ============================================================
// PermisosAvanzados.jsx
// Muestra los permisos de una entidad en modo granular.
// Incluye permisos CRUD (ver, crear, editar, eliminar) y también
// los permisos especiales mapeados a la entidad (ej: cambiar_estado_cita).
// Diseño de 3 columnas con checkbox "Todos" por entidad.
// ============================================================

import { Box, Typography, Checkbox, FormControlLabel, Grid, Button, Stack } from "@mui/material";
import { useMemo, useCallback } from "react";

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
  gestionar_configuracion: "Gestionar Seguridad",   // ← texto actualizado
  ver_dashboard: "Ver Dashboard",
  cliente_acceso_basico: "Acceso Básico",
};

// Mapeo inverso de entidad -> lista de nombres de permisos especiales
const specialByEntity = {
  citas: ["cambiar_estado_cita"],
  pedidos: ["cambiar_estado_pedido"],
  ventas: ["cambiar_estado_venta"],
  imagenes: ["ver_imagenes", "subir_imagenes", "eliminar_imagenes"],
  seguridad: ["gestionar_configuracion"],   // ← ahora la entidad es "seguridad"
  dashboard: ["ver_dashboard"],
};

// Mapeo de nombres con tildes para mostrar al usuario
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
  seguridad: "Seguridad",     // ← nombre claro
  imagenes: "Imágenes",
  abonos: "Abonos",
  reportes: "Reportes",
};

const formatearNombreEntidad = (entidad) => {
  if (nombresConTildes[entidad]) return nombresConTildes[entidad];
  return entidad.charAt(0).toUpperCase() + entidad.slice(1).replace(/_/g, " ");
};

// Extrae la acción CRUD del nombre del permiso
const getAccion = (nombrePermiso) => {
  if (nombrePermiso.startsWith("ver_")) return "ver";
  if (nombrePermiso.startsWith("crear_")) return "crear";
  if (nombrePermiso.startsWith("editar_")) return "editar";
  if (nombrePermiso.startsWith("eliminar_")) return "eliminar";
  return null;
};

// Extrae la entidad del nombre CRUD
const getEntidad = (nombrePermiso) => {
  const accion = getAccion(nombrePermiso);
  if (!accion) return null;
  let entidad = nombrePermiso.replace(`${accion}_`, "");
  // Convertir "configuracion" a "seguridad"
  if (entidad === "configuracion") return "seguridad";
  return entidad;
};

// Orden de las entidades según el sidebar
const ENTIDADES_ORDER = [
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

const agruparPermisosPorEntidad = (permisos) => {
  const map = new Map();
  permisos.forEach((p) => {
    const entidad = getEntidad(p.nombre);
    if (!entidad) return;
    if (!map.has(entidad)) map.set(entidad, []);
    map.get(entidad).push(p);
  });
  return Array.from(map.entries()).sort((a, b) => {
    const idxA = ENTIDADES_ORDER.indexOf(a[0]);
    const idxB = ENTIDADES_ORDER.indexOf(b[0]);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a[0].localeCompare(b[0]);
  });
};

export default function PermisosAvanzados({
  permisosDisponibles,
  value,
  onChange,
  modo = "crear",
}) {
  const permisosCRUD = useMemo(() => {
    return permisosDisponibles.filter((p) => getAccion(p.nombre) !== null);
  }, [permisosDisponibles]);

  const todosEspeciales = useMemo(() => {
    return permisosDisponibles.filter((p) => !getAccion(p.nombre));
  }, [permisosDisponibles]);

  const grupos = useMemo(() => agruparPermisosPorEntidad(permisosCRUD), [permisosCRUD]);

  const especialesPorEntidad = useMemo(() => {
    const map = new Map();
    for (const [entidad, especialesNombres] of Object.entries(specialByEntity)) {
      const encontrados = todosEspeciales.filter(p => especialesNombres.includes(p.nombre));
      if (encontrados.length) map.set(entidad, encontrados);
    }
    return map;
  }, [todosEspeciales]);

  const isSelected = (id) => value.includes(id);

  const togglePermiso = (id) => {
    const nuevos = isSelected(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(nuevos);
  };

  const todosSeleccionadosEnEntidad = (entidad, permisosCrud, permisosEsp) => {
    const todosIds = [...permisosCrud.map(p => p.id), ...permisosEsp.map(p => p.id)];
    if (todosIds.length === 0) return false;
    return todosIds.every(id => value.includes(id));
  };

  const toggleEntidadCompleta = (entidad, permisosCrud, permisosEsp) => {
    const todosIds = [...permisosCrud.map(p => p.id), ...permisosEsp.map(p => p.id)];
    const todosSeleccionados = todosSeleccionadosEnEntidad(entidad, permisosCrud, permisosEsp);
    let nuevos;
    if (todosSeleccionados) {
      nuevos = value.filter(id => !todosIds.includes(id));
    } else {
      const idsToAdd = todosIds.filter(id => !value.includes(id));
      nuevos = [...value, ...idsToAdd];
    }
    onChange(nuevos);
  };

  const seleccionarTodosGlobal = useCallback(() => {
    const todosIds = permisosCRUD.map(p => p.id);
    onChange(todosIds);
  }, [permisosCRUD, onChange]);

  const deseleccionarTodosGlobal = useCallback(() => {
    const idsActuales = permisosCRUD.map(p => p.id);
    const nuevos = value.filter(id => !idsActuales.includes(id));
    onChange(nuevos);
  }, [permisosCRUD, value, onChange]);

  const todosSeleccionadosGlobal = useMemo(() => {
    if (permisosCRUD.length === 0) return false;
    return permisosCRUD.every(p => value.includes(p.id));
  }, [permisosCRUD, value]);

  const textoBotonGlobal = todosSeleccionadosGlobal ? "Deseleccionar todos" : "Seleccionar todos";

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Modo avanzado - {modo === "crear" ? "Creación" : "Edición"} de roles
      </Typography>
      <Typography variant="caption" sx={{ mb: 2, display: "block", color: "text.secondary" }}>
        Permisos individuales por entidad (modo avanzado - {modo === "crear" ? "creación" : "edición"})
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="outlined" size="small" onClick={todosSeleccionadosGlobal ? deseleccionarTodosGlobal : seleccionarTodosGlobal}>
          {textoBotonGlobal}
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {grupos.map(([entidad, permisosCrud]) => {
          const permisosEsp = especialesPorEntidad.get(entidad) || [];
          const entidadCompleta = todosSeleccionadosEnEntidad(entidad, permisosCrud, permisosEsp);
          const parcial = !entidadCompleta && [...permisosCrud, ...permisosEsp].some(p => value.includes(p.id));
          const nombreMostrar = formatearNombreEntidad(entidad);

          return (
            <Grid item xs={12} sm={6} md={4} key={entidad}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 1.5,
                  backgroundColor: "#fafafa",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {nombreMostrar}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={entidadCompleta}
                        indeterminate={parcial}
                        onChange={() => toggleEntidadCompleta(entidad, permisosCrud, permisosEsp)}
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                        Todos
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {permisosCrud.map((permiso) => {
                    const accion = getAccion(permiso.nombre);
                    return (
                      <FormControlLabel
                        key={permiso.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={isSelected(permiso.id)}
                            onChange={() => togglePermiso(permiso.id)}
                          />
                        }
                        label={
                          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                            {accionMap[accion]}
                          </Typography>
                        }
                        sx={{ mr: 1 }}
                      />
                    );
                  })}
                  {permisosEsp.map((permiso) => (
                    <FormControlLabel
                      key={permiso.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={isSelected(permiso.id)}
                          onChange={() => togglePermiso(permiso.id)}
                        />
                      }
                      label={
                        <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                          {specialLabelMap[permiso.nombre] || permiso.nombre.replace(/_/g, ' ')}
                        </Typography>
                      }
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {grupos.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No hay permisos individuales disponibles.
        </Typography>
      )}
    </Box>
  );
}