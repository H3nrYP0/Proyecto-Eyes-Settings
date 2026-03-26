import { Grid } from "@mui/material";

export default function FormRow({ children, spacing = 2 }) {
  return (
    <Grid container spacing={spacing}>
      {children}
    </Grid>
  );
}