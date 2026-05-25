import { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Colores
const BRAND_LIGHT = "#eef2f8";
const BRAND_BORDER = "#e3e2f0";
const TEXT_PRIMARY = "#1a2c3e";

// ============================================================
// 1. MAPEO DE PERMISOS ESPECIALES A ENTIDADES
// ============================================================
const specialMapping = {
  // Cambios de estado
  cambiar_estado_cita: "citas",
  cambiar_estado_pedido: "pedidos",
  cambiar_estado_venta: "ventas",
  // Cancelaciones
  cancelar_citas: "citas",
  // Reportes
  generar_reporte_citas: "citas",
  generar_reporte_ventas: "ventas",
  generar_reporte_inventario: "inventario",
  ver_reportes: "reportes",
  // Comprobantes
  descargar_comprobante_pedido: "pedidos",
  // Imágenes
  subir_imagenes: "imagenes",
  ver_imagenes: "imagenes",
  eliminar_imagenes: "imagenes",
  // Abonos
  crear_abono: "abonos",
  ver_abonos: "abonos",
  cancelar_abono: "abonos",
  // Configuración
  gestionar_configuracion: "configuracion",
  // Dashboard
  ver_dashboard: "dashboard",
  // Otros (ajusta según tu seed)
  ver_bitacora: "bitacora",
  exportar_datos: "datos",
};

// ============================================================
// 2. FUNCIONES AUXILIARES
// ============================================================
// Obtener entidad de un permiso CRUD (ver_*, crear_*, etc.)
const getEntityFromCrud = (nombre) => {
  const parts = nombre.split("_");
  if (parts.length >= 2) {
    const accion = parts[0];
    if (["ver", "crear", "editar", "eliminar"].includes(accion)) {
      return parts.slice(1).join("_");
    }
  }
  return null;
};

// Función principal: determina la entidad de cualquier permiso
const getEntityForPermiso = (nombre) => {
  // 1. CRUD
  let entity = getEntityFromCrud(nombre);
  if (entity) return entity;
  // 2. Mapeo especial
  if (specialMapping[nombre]) return specialMapping[nombre];
  // 3. Fallback: "otros"
  return "otros";
};

// Agrupar permisos por entidad
const agruparPermisos = (permisos) => {
  const grupos = new Map();

  permisos.forEach((p) => {
    const entity = getEntityForPermiso(p.nombre);
    if (!grupos.has(entity)) {
      grupos.set(entity, { entity, items: [] });
    }
    grupos.get(entity).items.push(p);
  });

  // Ordenar alfabéticamente (puedes cambiar el orden si quieres)
  return Array.from(grupos.values()).sort((a, b) =>
    a.entity.localeCompare(b.entity)
  );
};

// Capitalizar primera letra
const capitalizar = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");

// Formatear nombre de permiso para mostrar
const formatearNombre = (nombre) => {
  return nombre.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// ============================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================
export default function PermisosSelector({
  permisosDisponibles = [],
  value = [],
  onChange,
  error,
  disabled = false,
}) {
  const grupos = useMemo(
    () => agruparPermisos(permisosDisponibles),
    [permisosDisponibles]
  );

  // Todos los IDs (para el botón global)
  const allPermisoIds = useMemo(
    () => permisosDisponibles.map((p) => p.id),
    [permisosDisponibles]
  );
  const allSelected = value.length === allPermisoIds.length && allPermisoIds.length > 0;

  const handleToggleAll = () => {
    if (disabled) return;
    onChange(allSelected ? [] : allPermisoIds);
  };

  const isGrupoCompleto = (grupo) => {
    const ids = grupo.items.map((i) => i.id);
    if (ids.length === 0) return false;
    return ids.every((id) => value.includes(id));
  };

  const isGrupoParcial = (grupo) => {
    const ids = grupo.items.map((i) => i.id);
    if (ids.length === 0) return false;
    return ids.some((id) => value.includes(id)) && !isGrupoCompleto(grupo);
  };

  const toggleGrupo = (grupo) => {
    if (disabled) return;
    const ids = grupo.items.map((i) => i.id);
    const todas = ids.every((id) => value.includes(id));
    if (todas) {
      onChange(value.filter((id) => !ids.includes(id)));
    } else {
      const toAdd = ids.filter((id) => !value.includes(id));
      onChange([...value, ...toAdd]);
    }
  };

  const togglePermiso = (permisoId) => {
    if (disabled) return;
    if (value.includes(permisoId)) {
      onChange(value.filter((id) => id !== permisoId));
    } else {
      onChange([...value, permisoId]);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Cabecera */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Permisos
          </Typography>
          <Chip
            label={`${value.length} de ${permisosDisponibles.length}`}
            size="small"
            sx={{
              bgcolor: BRAND_LIGHT,
              color: TEXT_PRIMARY,
              border: `1px solid ${BRAND_BORDER}`,
              fontWeight: 500,
            }}
          />
        </Box>
        {!disabled && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleAll}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              borderColor: BRAND_BORDER,
              color: TEXT_PRIMARY,
              bgcolor: "transparent",
              "&:hover": { borderColor: "#9aaebf", bgcolor: BRAND_LIGHT },
              px: 2,
              py: 0.5,
              fontSize: "0.75rem",
            }}
          >
            {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
          </Button>
        )}
      </Box>

      {/* Lista de acordeones por entidad */}
      <Box sx={{ maxHeight: 420, overflowY: "auto", pr: 1 }}>
        {grupos.map((grupo) => (
          <Accordion
            key={grupo.entity}
            disableGutters
            elevation={0}
            sx={{
              border: `1px solid ${BRAND_BORDER}`,
              borderRadius: "8px !important",
              mb: 1.5,
              "&:before": { display: "none" },
              background: "transparent",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 48,
                "& .MuiAccordionSummary-content": { my: 1 },
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  pr: 2,
                }}
              >
                <Typography fontWeight={600} sx={{ fontSize: "0.9rem" }}>
                  {capitalizar(grupo.entity)}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip
                    label={`${grupo.items.filter((i) => value.includes(i.id)).length}/${
                      grupo.items.length
                    }`}
                    size="small"
                    sx={{ bgcolor: BRAND_LIGHT, fontSize: "0.7rem" }}
                  />
                  <Checkbox
                    size="small"
                    checked={isGrupoCompleto(grupo)}
                    indeterminate={isGrupoParcial(grupo)}
                    onChange={() => toggleGrupo(grupo)}
                    disabled={disabled}
                    sx={{ p: 0.5 }}
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1, pb: 1, pl: 2 }}>
              <Grid container spacing={1}>
                {grupo.items.map((permiso) => (
                  <Grid item xs={6} sm={4} md={3} key={permiso.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={value.includes(permiso.id)}
                          onChange={() => togglePermiso(permiso.id)}
                          disabled={disabled}
                        />
                      }
                      label={formatearNombre(permiso.nombre)}
                      sx={{
                        m: 0,
                        "& .MuiFormControlLabel-label": { fontSize: "0.75rem" },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {error && (
        <FormHelperText error sx={{ mt: 1.5, fontSize: "0.75rem" }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}