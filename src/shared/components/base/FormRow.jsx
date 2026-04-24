import { Grid } from "@mui/material";
import { Children, cloneElement } from "react";

/**
 * FormRow - Fila para formulario
 * 
 * SIRVE PARA: Organizar los campos en filas
 * 
 * Props:
 * @param {node} children - Los FormCol con los campos
 * @param {number} spacing - Espaciado entre columnas (default: 2)
 * @param {number} totalCamposFormulario - Número TOTAL de campos en todo el formulario
 */
export default function FormRow({ children, spacing = 2, totalCamposFormulario = null }) {
  // Contar cuántos FormCol hay en ESTA fila
  const childrenArray = Children.toArray(children);
  const totalColsEnEstaFila = childrenArray.length;
  
  // Determinar cuántas columnas usar por fila basado en el TOTAL del formulario
  const getColumnasPorFila = () => {
    // Si no tenemos el total, asumimos 3 columnas
    if (!totalCamposFormulario) return 3;
    
    // Si el formulario tiene 2 campos o menos → usar 2 columnas
    if (totalCamposFormulario <= 2) return 2;
    
    // Si tiene 3 o más campos → usar máximo 3 columnas
    return 3;
  };
  
  const columnasPorFila = getColumnasPorFila();
  
  // Clonar los hijos para pasarles cuántas columnas hay en esta fila
  const enhancedChildren = childrenArray.map(child => {
    if (child && child.type && (child.type.name === 'FormCol' || child.type.displayName === 'FormCol')) {
      return cloneElement(child, { totalColsInRow: columnasPorFila });
    }
    return child;
  });

  return (
    <Grid container spacing={spacing}>
      {enhancedChildren}
    </Grid>
  );
}