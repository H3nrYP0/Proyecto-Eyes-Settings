// ============================================================
// PermisosAvanzados.jsx
// Componente que muestra los permisos de forma granular (ver, crear, editar, eliminar)
// organizados por entidad en TRES COLUMNAS.
// Cada entidad tiene un checkbox "Seleccionar todos" para marcar/desmarcar todos sus permisos.
// Incluye además un botón global para seleccionar/deseleccionar todos los permisos.
// ============================================================

import { Box, Typography, Checkbox, FormControlLabel, Grid, Button, Stack } from "@mui/material";
import { useMemo, useCallback } from "react";

const accionMap = {
  ver: "Ver",
  crear: "Crear",
  editar: "Editar",
  eliminar: "Eliminar",
};

const getAccion = (nombrePermiso) => {
  if (nombrePermiso.startsWith("ver_")) return "ver";
  if (nombrePermiso.startsWith("crear_")) return "crear";
  if (nombrePermiso.startsWith("editar_")) return "editar";
  if (nombrePermiso.startsWith("eliminar_")) return "eliminar";
  return null;
};

const getEntidad = (nombrePermiso) => {
  const accion = getAccion(nombrePermiso);
  if (!accion) return null;
  return nombrePermiso.replace(`${accion}_`, "");
};

const agruparPermisosPorEntidad = (permisos) => {
  const map = new Map();
  permisos.forEach((p) => {
    const entidad = getEntidad(p.nombre);
    if (!entidad) return;
    if (!map.has(entidad)) map.set(entidad, []);
    map.get(entidad).push(p);
  });
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
};

const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");

export default function PermisosAvanzados({
  permisosDisponibles,
  value,
  onChange,
  modo = "crear",
}) {
  const permisosCRUD = useMemo(() => {
    return permisosDisponibles.filter((p) => getAccion(p.nombre) !== null);
  }, [permisosDisponibles]);

  const grupos = useMemo(() => agruparPermisosPorEntidad(permisosCRUD), [permisosCRUD]);

  const isSelected = (id) => value.includes(id);

  const togglePermiso = (id) => {
    const nuevos = isSelected(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(nuevos);
  };

  // Verificar si todos los permisos de una entidad están seleccionados
  const todosSeleccionadosEnEntidad = (entidadPermisos) => {
    if (entidadPermisos.length === 0) return false;
    return entidadPermisos.every((p) => value.includes(p.id));
  };

  // Seleccionar/deseleccionar todos los permisos de una entidad
  const toggleEntidadCompleta = (entidadPermisos) => {
    const todosIds = entidadPermisos.map((p) => p.id);
    const todosSeleccionados = todosSeleccionadosEnEntidad(entidadPermisos);
    let nuevos;
    if (todosSeleccionados) {
      // Deseleccionar todos los de esta entidad
      nuevos = value.filter((id) => !todosIds.includes(id));
    } else {
      // Seleccionar los que faltan
      const idsToAdd = todosIds.filter((id) => !value.includes(id));
      nuevos = [...value, ...idsToAdd];
    }
    onChange(nuevos);
  };

  // Botones globales
  const seleccionarTodosGlobal = useCallback(() => {
    const todosIds = permisosCRUD.map((p) => p.id);
    onChange(todosIds);
  }, [permisosCRUD, onChange]);

  const deseleccionarTodosGlobal = useCallback(() => {
    const idsActuales = permisosCRUD.map((p) => p.id);
    const nuevos = value.filter((id) => !idsActuales.includes(id));
    onChange(nuevos);
  }, [permisosCRUD, value, onChange]);

  const todosSeleccionadosGlobal = useMemo(() => {
    if (permisosCRUD.length === 0) return false;
    return permisosCRUD.every((p) => value.includes(p.id));
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

      {/* Grid de 3 columnas (xs=4 para 12 columnas) */}
      <Grid container spacing={2}>
        {grupos.map(([entidad, permisos]) => {
          const entidadCompleta = todosSeleccionadosEnEntidad(permisos);
          const parcial = !entidadCompleta && permisos.some((p) => value.includes(p.id));

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
                    {capitalizar(entidad)}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={entidadCompleta}
                        indeterminate={parcial}
                        onChange={() => toggleEntidadCompleta(permisos)}
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
                  {permisos.map((permiso) => {
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