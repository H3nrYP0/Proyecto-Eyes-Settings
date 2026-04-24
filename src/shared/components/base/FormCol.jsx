import { Grid } from "@mui/material";

/**
 * FormCol - Columna para grid de formulario
 * 
 * SIRVE PARA: Definir el ancho de cada campo
 * 
 */
export default function FormCol({ children, totalColsInRow = null, xs = 12 }) {
  // Calcular el ancho basado en cuántas columnas hay en la fila
  const getWidth = () => {
    if (!totalColsInRow) return 6; // Fallback: 50%
    
    if (totalColsInRow === 2) return 6;  // 2 columnas → 50% cada una
    if (totalColsInRow === 3) return 4;  // 3 columnas → 33.33% cada una
    return 6; // Por defecto: 50%
  };

  const mdWidth = getWidth();

  return (
    <Grid item xs={xs} sm={xs} md={mdWidth}>
      {children}
    </Grid>
  );
}