import { Grid } from "@mui/material";

export default function BaseFormField({ children, fullWidth = false }) {
  return (
    <Grid item xs={12} md={fullWidth ? 12 : 6}>
      {children}
    </Grid>
  );
}
