import { Grid } from "@mui/material";

/**
 * BaseFormSection - Contenedor de sección de formulario
 * 
 * Sirve para agrupar campos relacionados dentro del formulario.
 * Por defecto crea un grid con espaciado de 2 unidades entre campos.
 * 
 * Props:
 * @param {node} children - Los FormCol con los campos
 * 
 * NOTA: Este componente es opcional, se puede usar FormRow directamente
 * que ya tiene la lógica de 3 columnas
 */
export default function BaseFormSection({ children }) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}