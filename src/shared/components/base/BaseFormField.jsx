import { Grid } from "@mui/material";

/**
 * BaseFormField - Contenedor para campo individual del formulario
 * 
 * SIRVE PARA: Envolver cada campo (alternativa a FormCol)
 * 
 * Props:
 * @param {node} children - El campo del formulario
 * @param {boolean} fullWidth - Si es true, ocupa el ancho completo
 * @param {number} totalColsInRow - Número de columnas en la fila (para cálculo)
 * 
 * NOTA: Es preferible usar FormCol en lugar de BaseFormField
 */
export default function BaseFormField({ children, fullWidth = false, totalColsInRow = null }) {
  const getWidth = () => {
    if (fullWidth) return 12;
    if (!totalColsInRow) return 4;
    
    switch(totalColsInRow) {
      case 1: return 12;
      case 2: return 6;
      case 3: return 4;
      default: return 4;
    }
  };

  const mdWidth = getWidth();

  return (
    <Grid item xs={12} md={mdWidth}>
      {children}
    </Grid>
  );
}