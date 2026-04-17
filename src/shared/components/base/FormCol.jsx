import { Grid } from "@mui/material";

/**
 * FormCol normaliza columnas automáticamente según el total de campos
 * en la fila (prop totalCols). Máximo 4 columnas. Móvil siempre full width.
 *
 *   totalCols=1 → md=12
 *   totalCols=2 → md=6  (2 columnas)
 *   totalCols=3 → md=4  (3 columnas)
 *   totalCols=4 → md=3  (4 columnas)
 *
 * Si no se pasa totalCols, usa los props manuales (xs, sm, md, lg, xl).
 */
function getMdFromTotal(totalCols) {
  const map = { 1: 12, 2: 6, 3: 4, 4: 3 };
  return map[Math.min(totalCols, 4)] ?? 6;
}

export default function FormCol({
  children,
  totalCols = null,
  xs = 12,
  sm = 12,
  md = 6,
  lg = 4,
  xl = 3,
}) {
  const resolvedMd = totalCols !== null ? getMdFromTotal(totalCols) : md;
  const resolvedLg = totalCols !== null ? getMdFromTotal(totalCols) : lg;
  const resolvedXl = totalCols !== null ? getMdFromTotal(totalCols) : xl;

  return (
    <Grid item xs={xs} sm={sm} md={resolvedMd} lg={resolvedLg} xl={resolvedXl}>
      {children}
    </Grid>
  );
}