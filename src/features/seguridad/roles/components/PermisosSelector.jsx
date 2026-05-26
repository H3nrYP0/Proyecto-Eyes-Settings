// ============================================================
// PermisosSelector.jsx
// Selector de permisos: vista básica (3 columnas por entidad) o
// vista avanzada (permisos individuales en 3 columnas, con checkbox "Todos" por entidad).
// Un ícono de engranaje permite cambiar entre ambos modos.
// En vista básica, toda la tarjeta es clickeable.
// ============================================================

import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  FormHelperText,
  Checkbox,
  Grid,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PermisosAvanzados from "./PermisosAvanzados";

const BRAND_BORDER = "#e3e2f0";
const TEXT_PRIMARY = "#1a2c3e";

// Mapeo de permisos especiales a entidades (para la vista básica)
const specialMapping = {
  cambiar_estado_cita: "citas",
  cambiar_estado_pedido: "pedidos",
  cambiar_estado_venta: "ventas",
  cancelar_citas: "citas",
  generar_reporte_citas: "citas",
  generar_reporte_ventas: "ventas",
  generar_reporte_inventario: "productos",
  descargar_comprobante_pedido: "pedidos",
  ver_reportes: "reportes",
  ver_imagenes: "imagenes",
  subir_imagenes: "imagenes",
  eliminar_imagenes: "imagenes",
  crear_abono: "abonos",
  ver_abonos: "abonos",
  cancelar_abono: "abonos",
  gestionar_configuracion: "seguridad",   // ← ahora apunta a "seguridad"
  ver_dashboard: "dashboard",
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
  "seguridad",   // ← antes "configuracion"
];

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
  seguridad: "Seguridad",      // ← nombre más claro
  imagenes: "Imágenes",
  abonos: "Abonos",
  reportes: "Reportes",
};

// Función para obtener el nombre visible con tilde
const formatearNombreEntidad = (entidad) => {
  if (nombresConTildes[entidad]) return nombresConTildes[entidad];
  // Fallback: capitalizar normal
  return entidad.charAt(0).toUpperCase() + entidad.slice(1).replace(/_/g, " ");
};

const getEntityForPermiso = (nombre) => {
  const parts = nombre.split("_");
  if (parts.length >= 2) {
    const accion = parts[0];
    if (["ver", "crear", "editar", "eliminar"].includes(accion)) {
      const entity = parts.slice(1).join("_");
      // Aceptamos tanto "seguridad" como "configuracion" para compatibilidad
      if (entity === "configuracion") return "seguridad";
      if (ENTIDADES_MAIN.includes(entity)) return entity;
    }
  }
  if (specialMapping[nombre]) return specialMapping[nombre];
  return null;
};

const agruparPorEntidad = (permisos) => {
  const map = new Map();
  permisos.forEach((p) => {
    const entity = getEntityForPermiso(p.nombre);
    if (!entity) return;
    if (!map.has(entity)) map.set(entity, []);
    map.get(entity).push(p.id);
  });
  const orden = [...ENTIDADES_MAIN];
  return Array.from(map.entries())
    .map(([entity, ids]) => ({ entity, ids }))
    .sort((a, b) => orden.indexOf(a.entity) - orden.indexOf(b.entity));
};

const formatearNombre = (nombre) =>
  nombre.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function PermisosSelector({
  permisosDisponibles = [],
  value = [],
  onChange,
  error,
  disabled = false,
  readOnly = false,
  modo = "crear",
}) {
  const isReadOnly = disabled || readOnly;
  const [modoAvanzado, setModoAvanzado] = useState(false);

  const toggleModo = () => {
    if (isReadOnly) return;
    setModoAvanzado((prev) => !prev);
  };

  const grupos = useMemo(
    () => agruparPorEntidad(permisosDisponibles),
    [permisosDisponibles]
  );

  const permisosSeleccionados = useMemo(() => {
    if (!isReadOnly) return [];
    return permisosDisponibles.filter((p) => value.includes(p.id));
  }, [permisosDisponibles, value, isReadOnly]);

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

  // Modo solo lectura
  if (isReadOnly) {
    return (
      <Box sx={{ width: "100%" }}>
        {error && (
          <FormHelperText error sx={{ mb: 1, fontSize: "0.75rem" }}>
            {error}
          </FormHelperText>
        )}
        {permisosSeleccionados.length === 0 ? (
          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#999" }}>
            No se han seleccionado permisos.
          </Typography>
        ) : (
          <Grid container spacing={1} columns={12}>
            {permisosSeleccionados.map((permiso) => (
              <Grid item xs={4} sm={4} md={4} key={permiso.id}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.75rem", color: TEXT_PRIMARY, py: 0.5 }}
                >
                  {formatearNombre(permiso.nombre)}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Modo edición
  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <FormHelperText error sx={{ mb: 1, fontSize: "0.75rem" }}>
          {error}
        </FormHelperText>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton
          onClick={toggleModo}
          aria-label={modoAvanzado ? "Volver a vista básica" : "Cambiar a modo avanzado"}
          title={modoAvanzado ? "Volver a selección por entidad" : "Ver permisos individuales"}
          size="small"
          color={modoAvanzado ? "primary" : "default"}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      {!modoAvanzado && (
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
      )}

      {modoAvanzado && (
        <Box sx={{ mt: 1 }}>
          <PermisosAvanzados
            permisosDisponibles={permisosDisponibles}
            value={value}
            onChange={onChange}
            modo={modo}
          />
        </Box>
      )}
    </Box>
  );
}