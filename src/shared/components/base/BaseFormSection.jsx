import { Grid } from "@mui/material";

export default function BaseFormSection({ children }) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}
