import { Grid } from "@mui/material";

/**
 * FormCol - Columna para grid de formulario
 * 
 * SIRVE PARA: Definir el ancho de cada campo
 * 
 * Props:
 * @param {node} children - El campo del formulario
 * @param {number} anchoColumna - Ancho de la columna (6=50%, 4=33.33%)
 * @param {number} totalCamposEnFila - Total de campos en esta fila
 * @param {number} columnasPorFila - Número de columnas esperadas (2 o 3)
 */
export default function FormCol({ 
  children, 
  anchoColumna = 6, 
  totalCamposEnFila = null,
  columnasPorFila = 3,
  xs = 12 
}) {
  // Si es la única columna y hay menos de 3 columnas esperadas, ajustar
  const getWidth = () => {
    // Si hay 2 columnas o menos en total
    if (columnasPorFila === 2) return 6; // 50% cada una
    
    // Si hay 3 columnas o más
    if (columnasPorFila === 3) {
      // Si esta fila tiene menos de 3 campos, mantener 33.33% para todos
      // para que sean consistentes
      return 4; // 33.33%
    }
    
    return anchoColumna;
  };

  const mdWidth = getWidth();

  return (
    <Grid item xs={xs} sm={xs} md={mdWidth}>
      {children}
    </Grid>
  );
}