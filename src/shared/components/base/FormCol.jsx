import { Grid } from "@mui/material";

export default function FormCol({ 
  children, 
  xs = 12,      // Mobile: full width
  sm = 12,      // Small tablet: full width
  md = 6,       // Desktop: half width (2 columns)
  lg = 4,       // Large desktop: one third (3 columns)
  xl = 3        // Extra large: one quarter (4 columns)
}) {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      {children}
    </Grid>
  );
}