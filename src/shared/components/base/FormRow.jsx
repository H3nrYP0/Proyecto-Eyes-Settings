import { Grid } from "@mui/material";
import { Children, cloneElement, useEffect, useState } from "react";

/**
 * FormRow - Fila inteligente para formulario
 * 
 * SIRVE PARA: Distribuir campos automáticamente en filas de máximo 3 columnas
 * 
 * REGLAS MEJORADAS:
 * 1. Si hay 1 o 2 campos TOTALES en el formulario → 2 columnas (50% cada uno)
 * 2. Si hay 3 o más campos TOTALES → distribución en filas de 3 columnas (33.33%)
 * 3. Los campos se agrupan automáticamente en filas de 3
 * 4. Si la última fila tiene menos de 3 campos, esos campos ocupan 33.33% también
 * 
 * Props:
 * @param {node} children - Los FormCol con los campos
 * @param {number} spacing - Espaciado entre columnas (default: 2)
 */
export default function FormRow({ children, spacing = 1 }) {
  // Obtener todos los hijos como array
  const childrenArray = Children.toArray(children);
  const totalCampos = childrenArray.length;
  
  // Determinar cuántas columnas usar por fila
  const getColumnasPorFila = () => {
    // Si hay 2 campos o menos → usar 2 columnas
    if (totalCampos <= 2) return 2;
    // Si hay 3 o más campos → usar 3 columnas máximo
    return 3;
  };
  
  const columnasPorFila = getColumnasPorFila();
  const anchoPorColumna = columnasPorFila === 2 ? 6 : 4; // 6=50%, 4=33.33%
  
  // Agrupar los campos en filas de maxColumnas
  const agruparCampos = () => {
    const grupos = [];
    for (let i = 0; i < childrenArray.length; i += columnasPorFila) {
      const grupo = childrenArray.slice(i, i + columnasPorFila);
      grupos.push(grupo);
    }
    return grupos;
  };
  
  const gruposDeCampos = agruparCampos();
  
  // Clonar los hijos para pasarles el ancho correcto
  const enhancedChildren = gruposDeCampos.map((grupo, grupoIndex) => (
    <Grid container spacing={spacing} key={grupoIndex} sx={{ mb: 0 }}>
      {grupo.map((child, childIndex) => {
        if (child && child.type && (child.type.name === 'FormCol' || child.type.displayName === 'FormCol')) {
          return cloneElement(child, { 
            anchoColumna: anchoPorColumna,
            totalCamposEnFila: grupo.length,
            columnasPorFila: columnasPorFila
          });
        }
        return child;
      })}
    </Grid>
  ));

  return <>{enhancedChildren}</>;
}